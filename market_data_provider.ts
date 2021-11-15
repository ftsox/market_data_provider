const ccxt = require ('ccxt');
require('dotenv').config();
let sleep = require('util').promisify(setTimeout);
const axios = require('axios');
const { ethers } = require("ethers");
var Web3 = require('web3');
const { fromWei } = Web3.utils;
const EthTx = require("ethereumjs-tx");
const math = require("mathjs");
const nodemailer = require("nodemailer");
var url = require('url');
const {BigQuery} = require('@google-cloud/bigquery');
// @ts-ignore
import { time } from '@openzeppelin/test-helpers';  // TODO: get rid of this
import { table } from 'console';
import { exit } from 'process';
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
let exchangesObjs = exchanges.map((ex) => new ccxt[ex]({}));
var exchangesMarkets = (async () => { await Promise.all(exchangesObjs.map((ex) => ex.load_markets())) }) ()
let URL0 = process.env.RPC_NODE_URL0;
const web3ProviderOptions = {
    // Need a lower timeout than the default of 750 seconds in case it hangs
    timeout: 60 * 1000, // milliseconds,
};
let web3 = new Web3(
    new Web3.providers.HttpProvider(URL0, web3ProviderOptions)
);

if (baseCurrencyAltsRaw.length == 0) {
    baseCurrencyAlts = []; 
} else {
    baseCurrencyAlts = baseCurrencyAltsRaw.replace(/\s/g,'').split(',');
}
let priceSubmitterAddr = '0x1000000000000000000000000000000000000003';
let mailErrCount = 0;
let shouldInitialize: boolean;
async function getTime(web3: any): Promise<number>{
    if (useSystemTime) {
        return (new Date()).getTime() / 1000;
    } else {
        const blockNum = await web3.eth.getBlockNumber();
        const block = await web3.eth.getBlock(blockNum);
        const timestamp = block.timestamp;
        return timestamp as number;
    }
}

var pricesLast = {};    // Dictionary of arrays indexed by assets (in case we are ever calling for different sets of assets)
// TODO: have this and child functions return a validPrice flag (boolean)
// Decimals: number of decimal places in Asset USD price
// note that the actual USD price is the integer value divided by 10^Decimals
async function getPrices(epochId: number, assets: string[], decimals: number[]){
    var assetsUid = assets.join(',');   // key on asset list as unique identifier
    var nAssets = assets.length;
    if (nAssets == 0) {
        return [];
    }
    // if we haven't initialized last price, start it off with -1s
    if (!(assetsUid in pricesLast)) {
        pricesLast[assetsUid] = new Array(nAssets).fill(-1);
    }

    await getPricesCCXT(epochId,assets);
               
}


function populateQuoteVolume(tickerData: any): any{
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
    while(true)
    {
    try {
      
        let curTime = (new Date()).getTime();
        let nxtTime = curTime + 3000;
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
                let singleTickerExSupportedTickers = tickersFull.filter((ticker, idx) => singleTickerEx.symbols.includes(ticker))
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


        // Get time and current epoch params
        let now = await getTime(web3);
        // now = (new Date()).getTime() / 1000; // susceptible to system clock drift
        const currentEpochCheck = (Math.floor((now - firstEpochStartTime) / submitPeriod)); // don't add 1 here like above
        var nextEpoch;
        // check for drift
        if (epochId < currentEpochCheck) {
            epochId = currentEpochCheck;
            
        }
        nextEpoch = epochId + 1;
        let next = nextEpoch * submitPeriod + firstEpochStartTime;
        const timeToEpochEnd = Math.max(Math.floor(next - now), 0);  // don't wait negative time

        var combinedExs = bulkTickerExs.concat(singleTickerExs)
        let quotesFlat = allRawData.map((exRets, i) => {
            return Object.entries(exRets).map(([ticker, quote], j) => {
                return {
                    epochID: epochId,
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

        Exchangetable.insert(quotesFlat, insertHandler)
        //console.log(quotesFlat);
        var timeToSleep =  nxtTime - (new Date()).getTime()
        console.log("sleeping for: " ,timeToSleep)
        await sleep(timeToSleep);
    }
    catch(error){
        console.log(`CCXT API error:\n  ${error}`);
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
      

    const port = process.env.PORT || 8081;
    app.listen(port, () => {
        console.log('Market Data Provider Listening on', port);
    });

    var decimals;
    var symbols: string[];

    var priceSubmitterAbi, MockFtsoRegistry, MockVoterWhitelister, MockFtso, priceSubmitterContract, ftsoRegistry, voterWhitelister, ftsoIndices, submitBufferMax;
    var priceHistory


   
    // Times
    console.log(`\n\n\Initializing Market Data provider on mainnet`);
    console.log(`\tStart time: ${Date()}`); 
    console.log(`Time check:`);
    console.log(`\tChain time:  ${await getTime(web3)}`);
    console.log(`\tSystem time: ${(new Date()).getTime() / 1000}`);

    priceSubmitterAbi = require("./priceSubmitter.json");
    MockFtsoRegistry = require("./MockFtsoRegistry.json");
    MockVoterWhitelister = require("./MockVoterWhitelister.json");
    MockFtso = require("./MockNpmFtso.json")
    priceSubmitterContract = new web3.eth.Contract(JSON.parse(JSON.stringify(priceSubmitterAbi)), priceSubmitterAddr);
    ftsoRegistry = new web3.eth.Contract(JSON.parse(JSON.stringify(MockFtsoRegistry)), await priceSubmitterContract.methods.getFtsoRegistry().call());
    voterWhitelister = new web3.eth.Contract(JSON.parse(JSON.stringify(MockVoterWhitelister)), await priceSubmitterContract.methods.getVoterWhitelister().call());  

    // Get indices for specific symbols
    // const symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];
    // Note: this can be replaced by a single call based on live contract

    const ftsoSupportedIndices_ = await ftsoRegistry.methods.getSupportedIndices().call();
    const ftsoSupportedIndices = ftsoSupportedIndices_.map(idx => (parseInt(idx)));
    symbols = await Promise.all(
        ftsoSupportedIndices.map(async idx => await ftsoRegistry.methods.getFtsoSymbol(idx).call())
    );

    const ftsos = await Promise.all(
        symbols.map(async sym =>  new web3.eth.Contract(JSON.parse(JSON.stringify(MockFtso)), await ftsoRegistry.methods.getFtsoBySymbol(sym).call()))
    );

    // Get addresses of the various FTSO contracts
    decimals = await Promise.all(
        ftsos.map(async ftso => parseInt((await ftso.methods.ASSET_PRICE_USD_DECIMALS().call())))
    );

    // Get indices on which to submit
    // const ftsoIndices = await Promise.all(
    //     symbols.map(async sym => (await ftsoRegistry.getFtsoIndex(sym)).toNumber())
    // )
    ftsoIndices = ftsoSupportedIndices;

    // Combine them for easier future use
    const currencyIndices = new Map(
        symbols.map((c, i) => [c, ftsoIndices[i]]) 
    );

    // Get submission config
    // Assumes uniform across all FTSOs (was in original Flare code)
    const {
        0: firstEpochStartTimeBN,
        1: submitPeriodBN,
        2: revealPeriodBN,
    } = (await ftsos[0].methods.getPriceEpochConfiguration().call());

    [firstEpochStartTime, submitPeriod, revealPeriod] = 
        [firstEpochStartTimeBN, submitPeriodBN, revealPeriodBN].map(x => parseInt(x));


    // Test: get prices for symbols
    var initialEpoch = Math.floor(((await getTime(web3)) - firstEpochStartTime) / submitPeriod);
    // var pxsProd = await getPrices(1, symbols, new Array(symbols.length).fill(5));
    await getPrices(initialEpoch, symbols, decimals);    

       

}
   
main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});

