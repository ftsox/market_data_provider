const ccxt = require ('ccxt');
require('dotenv').config();
let sleep = require('util').promisify(setTimeout);
const axios = require('axios');
const { ethers } = require("ethers");
// var Web3 = require('web3');
// const { fromWei } = Web3.utils;
// const EthTx = require("ethereumjs-tx");
const math = require("mathjs");
const nodemailer = require("nodemailer");
var url = require('url');
const {BigQuery} = require('@google-cloud/bigquery');
// // @ts-ignore

const bigquery = new BigQuery();
const dataset = bigquery.dataset('FTSO');
const Exchangetable = dataset.table('ExchangeData');

var orig = console.log
console.log = function log() {
    orig.apply(console, [`${process.pid} `, ...arguments])
}

let useSystemTime = (process.env.USE_SYSTEM_TIME || 'FALSE') == 'TRUE' ? true : false;
let exchangeSource = process.env.EXCHANGE_SOURCE || '';
let exchanges = exchangeSource.replace(/\s/g,'').split(',');
var firstEpochStartTime, submitPeriod, revealPeriod;  
let baseCurrency = process.env.BASE_CURRENCY || 'USD';
let baseCurrencyAltsRaw = process.env.BASE_CURRENCY_ALTS || '';   // enable multiple alternative bases
var baseCurrencyAlts = []

if (baseCurrencyAltsRaw.length == 0) {
    baseCurrencyAlts = []; 
} else {
    baseCurrencyAlts = baseCurrencyAltsRaw.replace(/\s/g,'').split(',');
}

let priceSubmitterAddr = '0x1000000000000000000000000000000000000003';
let mailErrCount = 0;
let shouldInitialize: boolean;

async function getTime(): Promise<number> {
    return (new Date()).getTime() / 1000;
}

async function getPrices(epochId: number, assets: string[], decimals: number[]) {
    var nAssets = assets.length;
    if (nAssets == 0) {
        return [];
    }

    await getPricesCCXT(epochId,assets);       
}

function populateQuoteVolume(tickerData: any): any {
    if(tickerData.quoteVolume == null) {
        tickerData.quoteVolume = tickerData.baseVolume * ((tickerData.bid + tickerData.ask) / 2);
    }
    return tickerData;
}

function insertHandler(err, apiResponse) {
    if (err) {
      // An API error or partial failure occurred.
        console.log(JSON.stringify(err));
    }
}
var timeToSleep, idx = 0;
let firstTime = true;
var nxtWakeUp = 0;

async function getPricesCCXT(epochId: number, assets: string[]) {

    if(exchanges.length == 0)
    {
        console.error("CCXT chosen but no exchange source, exiting")
        process.exit(1);
    }
    var string = "";
    exchanges.forEach(function(element){
        string += element + " ";
    });
    console.log("Ex Src: ", string);


    let basesCombined = [baseCurrency, ...baseCurrencyAlts];

    //['XRP/USD`, 'LTC/USD' ...]
    let tickersBase = assets.map((sym) => `${sym}/${baseCurrency}`);
    // [][] -> ['XRP/USDT`, `LTC/USDT` ...][`XRP/BTC`, `LTC/BTC` ...]
    let tickersBaseAlts = baseCurrencyAlts.map(baseCurrencyAlt => assets.map((sym) => `${sym}/${baseCurrencyAlt}`));
    //[] -> [XRP/USDT`, `LTC/USDT`..., `XRP/BTC`, `LTC/BTC`...]
    let tickersBaseAltsFlat = tickersBaseAlts.reduce((partial_list, a) => [...partial_list, ...a], []);
    // Note: Only Kraken, Coinbase, and FTX has USDT/USD pair: https://coinmarketcap.com/currencies/tether/markets/
    //[] -> [`USDT/USD`, `USDT/BTC`]
    let tickersAltsToBase = baseCurrencyAlts.map((alt) => `${alt}/${baseCurrency}`);
    // let baseCurrencyAltToBaseCurrencyTicker = `${baseCurrencyAlt}/${baseCurrency}`;
    //[] -> [`XRP/USD`, `LTC/USD`,... `XRP/USDT`, `LTC/USDT`..., `XRP/BTC`, `LTC/BTC`...]
    let tickersFull = [...new Set([...tickersBase, ...tickersBaseAltsFlat, ...tickersAltsToBase])];     // deduplication with Set
    // Map [`XRP` -> `XRP/USD`]
    let tickersBaseToSymbolsMap = new Map(assets.map((sym, i) => [sym, tickersBase[i]]));       // doesn't include USD/USDT
    // let tickersBaseAltToSymbolsMap = new Map(assets.map((sym, i) => [sym, tickersBaseAltsFlat[i]]));
    
    let pxsEx = {};     // arrays of prices for each ticker
    let volsEx = {};    // arrays of volumes for each ticker (in base pair numeraire)
    // let formattedSingleRawData = {};
    let exchangesObjs = exchanges.map((ex) => new ccxt[ex]({}));
    for(let i = 0; i < exchangesObjs.length; i++)
    {
        await exchangesObjs[i].load_markets()
    }

    var timeToEpochEndList = [60, 45, 30, 25, 20, 15, 10, 5, 0];
    let workingEpoch = 0;
    let missCount = 0;
    let gracePeriod = 5;
  
    while(true) {
        // Get epoch info for current loop
        let loopStart = (new Date()).getTime() / 1000;
        let loopEpoch = (Math.floor((loopStart - firstEpochStartTime) / submitPeriod));
        let loopEpochEnd = loopEpoch * submitPeriod + firstEpochStartTime;
        console.log(`\nEpoch ${loopEpoch}`);
        console.log(`\tCumulative miss count: ${missCount}`);
        let currentEpoch = loopEpoch;
        let nextEpoch = currentEpoch + 1;
        let nextEpochEnd = nextEpoch * submitPeriod + firstEpochStartTime;

        // Loop over desired time snapshots
        for (var timeToEpochEnd of timeToEpochEndList) {
            try {
                // get current times
                let now = (new Date()).getTime() / 1000;
                let startTimeToEpochEnd = nextEpochEnd - now;
                let nextTimeToEpochEnd = timeToEpochEnd;
                let waitTime = Math.max(startTimeToEpochEnd - nextTimeToEpochEnd, 0);  // don't wait negative time

                // Log current times
                console.log(`\tCurrently time to epoch end: ${startTimeToEpochEnd}`);
                console.log(`\tNext price snapshot from epoch end: ${nextTimeToEpochEnd}`);
                console.log(`\tWaiting for ${waitTime} seconds before getting price`);
                
                // Check if we've missed the window for this timeToEpochEnd
                // Give a grace period to try to recover
                if (startTimeToEpochEnd < nextTimeToEpochEnd - gracePeriod) {
                    console.log(`\tMissed this timeToEpochEnd`);
                    missCount += 1;
                    continue;
                }

                await sleep(waitTime * 1000);

                let bulkPxPromises: any[] = [];
                let singlePxPromises: any[] = [];

                // Bulk fetch exchanges
                let bulkFetchIdxs = exchangesObjs.map((ex, idx) => ex.has[`fetchTickers`] || false);
                let bulkTickerExs = exchangesObjs.filter((ex, i) => bulkFetchIdxs[i])
                bulkPxPromises = bulkTickerExs.map((ex, idx) => ex.fetchTickers(tickersFull));
                
                // individual ticker exchanges
                // Only do for Coinbase
                // TODO: add more single ticker exchanges, like Kraken
                // let usdTickers = tickersFull.filter((ticker, idx) => ticker.split('/')[1] == 'USD')
                let singleTickerExs = exchangesObjs.filter((ex, i) => !bulkFetchIdxs[i] && ex.id == 'coinbasepro')
                for (let singleTickerEx of singleTickerExs) {
                    if (singleTickerEx.id == 'coinbasepro') {
                        // need to filter out XRP/USD from Coinbase
                        let singleTickerExSupportedTickers = tickersFull.filter(
                            (ticker, idx) => singleTickerEx.symbols.includes(ticker) && ticker != 'XRP/USD'
                        )
                        // TODO: this may cause too many request issues, may need to loop individually over each ticker as we did previously
                        // push rather than concat to have parallel structure as bulkPxPromises of a separate array for each exchange
                        singlePxPromises.push(singleTickerExSupportedTickers.map((ticker, idx) => singleTickerEx.fetchTicker(ticker)))
                    }
                }
                
                // Note unsupported exchanges
                let unsupportedExs = exchangesObjs.filter((ex, i) => !bulkFetchIdxs[i] && ex.id != 'coinbasepro')
                if (unsupportedExs.length > 0) {
                    console.log(`Warning! Unsupported exchanges: ${unsupportedExs.map((ex,idx) => ex.id).join(', ')}`)
                }
                
                // Resolve promises
                let bulkPxData = await Promise.all(bulkPxPromises);
                let singlePxDataList = await Promise.all(singlePxPromises.map(Promise.all.bind(Promise)));    // Need to resolve array of array of promises
                // Convert from array of arrays of quotes to an array of dicts of {symbol: quote}
                let singlePxData = singlePxDataList.map((exResList, i) => {
                    let exResDict = {};
                    exResList.forEach((quote: any)=> {exResDict[quote.symbol] = quote});
                    return exResDict;
                });
                // Concatenate the two data sources
                let allRawData = bulkPxData.concat(singlePxData);
                let tickersRet: any[] = [];
                for (let i = 0; i < allRawData.length; i++) {
                    tickersRet = Object.keys(allRawData[i]); // will typically be missing a bunch of keys
                    // Iterate through all price pairs for the same asset (XRP/USD, XRP/USDT, XRP/BTC...)
                    // and convert them to USD based and push them into an array. After we iterate through
                    // the entire array, we convert them to a single volume weighted average.
                    tickersRet.forEach(tickerSymbol => {
                        pxsEx[tickerSymbol] = pxsEx[tickerSymbol] || [];
                        pxsEx[tickerSymbol].push(
                            (allRawData[i][tickerSymbol].bid + allRawData[i][tickerSymbol].ask) / 2
                        );
                        volsEx[tickerSymbol] = volsEx[tickerSymbol] || [];
                        volsEx[tickerSymbol].push(
                            populateQuoteVolume(allRawData[i][tickerSymbol]).quoteVolume || 0
                        );
                    });
                };

                // get prices for alternative base currencies
                // Calculate weighted average
                // Could do this recursively (e.g. use BTC/USDT and BTC/USD to calculate BTC/USD rate), but for now keep it simple
                let baseAltsPxs = tickersAltsToBase.map((altTicker, idx) => 
                    math.dot(pxsEx[altTicker], volsEx[altTicker]) / math.sum(volsEx[altTicker])
                );

                let baseAltPxsMap = new Map(baseCurrencyAlts.map((alt, idx) => [alt, baseAltsPxs[idx]]));
                baseAltPxsMap.set(baseCurrency, 1);
                // Get to volume weighted price for each asset
                // TODO: alternative 1: can change to matrix version using math.js and (tickersBase.map((ticker) => pxsEx.get(ticker)))
                // TODO: add an exchange-level weighting factor, s.t. weight = volume * exchange_factor, to reflect exchange quality of volume
                // let pxsAll = {}
                // let pxsAll = new Map(basesCombined.map((base, idx) => [base, {}]));
                var pxsAll = {};
                basesCombined.forEach(base => pxsAll[base] = {});
                let prices = assets.map((asset, idx) => {
                    let pxsBase = [];
                    let volsBase = [];
                    // convert each set of quotes for each base to global base (USD)
                    for (let base of basesCombined) {
                        let ticker = `${asset}/${base}`;
                        if ((pxsEx[ticker] || []).length > 0) {
                            pxsBase.push(...math.dotMultiply(pxsEx[ticker] || [], baseAltPxsMap.get(base)));
                            volsBase.push(...(new Array((pxsEx[ticker] || []).length).fill(1)));
                            pxsAll[base][asset] = math.mean(pxsEx[ticker]);
                        } else if (asset==base) {
                            pxsAll[base][asset] = 1;
                        } else {        
                            pxsAll[base][asset] = NaN;
                        }
                    }
                    if (pxsBase.length == 0) {
                        // no prices for the asset on the given exchanges, return NaN
                        return NaN;
                    } else {
                        return math.dot(pxsBase, volsBase) / math.sum(volsBase);
                    }
                });

                var combinedExs = bulkTickerExs.concat(singleTickerExs)
                let quotesFlat = allRawData.map((exRets, i) => {
                    return Object.entries(exRets).map(([ticker, quote], j) => {
                        return {
                            epochID: loopEpoch,
                            asset: quote['symbol'].split('/')[0],
                            exchange: combinedExs[i].id,
                            timeToEpochEnd: timeToEpochEnd,
                            timestamp: quote['timestamp'],
                            base: quote['symbol'].split('/')[1], 
                            ticker: ticker,
                            priceBase: (quote['bid'] + quote['ask'])/2,
                            priceUSD : ((quote['bid'] + quote['ask'])/2) * baseAltPxsMap.get(quote['symbol'].split('/')[1]),
                            volumeBase: populateQuoteVolume(allRawData[i][ticker]).quoteVolume || 0,
                            volumeUSD:  (populateQuoteVolume(allRawData[i][ticker]).quoteVolume || 0) * baseAltPxsMap.get(quote['symbol'].split('/')[1]),
                            bid: quote['bid'],
                            ask: quote['ask'],
                            mid: (quote['average']),
                            baseToUSD: baseAltPxsMap.get(quote['symbol'].split('/')[1])

                        };
                    });
                }).reduce((partial_list, a) => [...partial_list, ...a], []);
                console.log(`\tGot ${quotesFlat.length} quotes\n`)

                Exchangetable.insert(quotesFlat, insertHandler)
            }

            catch(error){
                console.log(`CCXT API error:\n  ${error}`);
                process.exit(1);
            }
        }
    }
    
}


/*
    Main price provider server
*/

async function main() {
    shouldInitialize = true;
    // Express.js server for monitoring
    const express = require('express');
    const app = express();

    app.get('/', (req, res) => {
        console.log('PING.');
        const target = process.env.TARGET || 'Running';
        res.send(`FTSO: ${target}!`);
    });

    app.get('/test', function(request, response) {
        var id = request.query.id;
        var name = request.query.name;
        console.log('id:'+id);
        console.log('name:'+name);
        response.send('id')
      })
      

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log('Market Data Provider Listening on', port);
    });

    var decimals;
    var symbols: string[];
   
    // Times
    console.log(`\n\n\Initializing Market Data provider on mainnet`);
    console.log(`\tStart time: ${Date()}`); 
    console.log(`Time check:`);
    console.log(`\tChain time:  ${await getTime()}`);
    console.log(`\tSystem time: ${(new Date()).getTime() / 1000}`);


    // Hardcode params
    // TODO: change to pulling from DB
    firstEpochStartTime = 1631824801;
    submitPeriod = 180;
    revealPeriod = 90;
    decimals = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
    symbols = ['XRP', 'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH', 'DGB', 'BTC', 'ETH', 'FIL'];

    var initialEpoch = Math.floor(((await getTime()) - firstEpochStartTime) / submitPeriod);
    await getPrices(initialEpoch, symbols, decimals);    
}
   
main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});

