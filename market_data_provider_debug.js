
ccxt = require ('ccxt');
require('dotenv').config();
sleep = require('util').promisify(setTimeout);
axios = require('axios');
ethers  = require("ethers");
// Web3 = require('web3');
// { fromWei } = Web3.utils;
// EthTx = require("ethereumjs-tx");
math = require("mathjs");
nodemailer = require("nodemailer");
url = require('url');
BigQuery = require('@google-cloud/bigquery');
// // @ts-ignore
// import { time } from '@openzeppelin/test-helpers';  // TODO: get rid of this
// import { table } from 'console';
// import { exit } from 'process';
bigquery = new BigQuery();
dataset = bigquery.dataset('FTSO');
Exchangetable = dataset.table('ExchangeData');
orig = console.log
console.log = function log() {
    orig.apply(console, [`${process.pid} `, ...arguments])
}
useSystemTime = (process.env.USE_SYSTEM_TIME || 'FALSE') == 'TRUE' ? true : false;
exchangeSource = process.env.EXCHANGE_SOURCE || '';
exchanges = exchangeSource.replace(/\s/g,'').split(',');
firstEpochStartTime, submitPeriod, revealPeriod;  
baseCurrency = process.env.BASE_CURRENCY || 'USD';
baseCurrencyAltsRaw = process.env.BASE_CURRENCY_ALTS || '';   // enable multiple alternative bases
baseCurrencyAlts = []



firstEpochStartTime = 1631824801;
submitPeriod = 180;
revealPeriod = 90;
decimals = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
symbols = ['XRP', 'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH', 'DGB', 'BTC', 'ETH', 'FIL'];
assets = symbols;

// wakeUpTime = [180,
//                 120,
//                 60,
//                 30,
//                 24,
//                 18,
//                 12,
//                 6]
// URL0 = process.env.RPC_NODE_URL0;
// web3ProviderOptions = {
//     // Need a lower timeout than the default of 750 seconds in case it hangs
//     timeout: 60 * 1000, // milliseconds,
// };
// web3 = new Web3(
//     new Web3.providers.HttpProvider(URL0, web3ProviderOptions)
// );

if (baseCurrencyAltsRaw.length == 0) {
    baseCurrencyAlts = []; 
} else {
    baseCurrencyAlts = baseCurrencyAltsRaw.replace(/\s/g,'').split(',');
}
priceSubmitterAddr = '0x1000000000000000000000000000000000000003';
mailErrCount = 0;
// async function getTime(web3: any): Promise<number>{
//     if (useSystemTime) {
//         return (new Date()).getTime() / 1000;
//     } else {
//         blockNum = await web3.eth.getBlockNumber();
//         block = await web3.eth.getBlock(blockNum);
//         timestamp = block.timestamp;
//         return timestamp as number;
//     }
// }
async function getTime() {
    return (new Date()).getTime() / 1000;
}




pricesLast = {};    // Dictionary of arrays indexed by assets (in case we are ever calling for different sets of assets)
// TODO: have this and child functions return a validPrice flag (boolean)
// Decimals: number of decimal places in Asset USD price
// note that the actual USD price is the integer value divided by 10^Decimals
async function getPrices(epochId, assets, decimals) {
    assetsUid = assets.join(',');   // key on asset list as unique identifier
    nAssets = assets.length;
    if (nAssets == 0) {
        return [];
    }
    // if we haven't initialized last price, start it off with -1s
    if (!(assetsUid in pricesLast)) {
        pricesLast[assetsUid] = new Array(nAssets).fill(-1);
    }

    await getPricesCCXT(epochId,assets);
               
}


function populateQuoteVolume(tickerData) {
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

timeToSleep, idx = 0;
firstTime = true;
nxtWakeUp = 0;

basesCombined = [baseCurrency, ...baseCurrencyAlts];

//['XRP/USD`, 'LTC/USD' ...]
tickersBase = assets.map((sym) => `${sym}/${baseCurrency}`);
// [][] -> ['XRP/USDT`, `LTC/USDT` ...][`XRP/BTC`, `LTC/BTC` ...]
tickersBaseAlts = baseCurrencyAlts.map(baseCurrencyAlt => assets.map((sym) => `${sym}/${baseCurrencyAlt}`));
//[] -> [XRP/USDT`, `LTC/USDT`..., `XRP/BTC`, `LTC/BTC`...]
tickersBaseAltsFlat = tickersBaseAlts.reduce((partial_list, a) => [...partial_list, ...a], []);
// Note: Only Kraken, Coinbase, and FTX has USDT/USD pair: https://coinmarketcap.com/currencies/tether/markets/
//[] -> [`USDT/USD`, `USDT/BTC`]
tickersAltsToBase = baseCurrencyAlts.map((alt) => `${alt}/${baseCurrency}`);
// baseCurrencyAltToBaseCurrencyTicker = `${baseCurrencyAlt}/${baseCurrency}`;
//[] -> [`XRP/USD`, `LTC/USD`,... `XRP/USDT`, `LTC/USDT`..., `XRP/BTC`, `LTC/BTC`...]
tickersFull = [...new Set([...tickersBase, ...tickersBaseAltsFlat, ...tickersAltsToBase])];     // deduplication with Set
// Map [`XRP` -> `XRP/USD`]
tickersBaseToSymbolsMap = new Map(assets.map((sym, i) => [sym, tickersBase[i]]));       // doesn't include USD/USDT
// tickersBaseAltToSymbolsMap = new Map(assets.map((sym, i) => [sym, tickersBaseAltsFlat[i]]));

pxsEx = {};     // arrays of prices for each ticker
volsEx = {};    // arrays of volumes for each ticker (in base pair numeraire)
// formattedSingleRawData = {};
exchangesObjs = exchanges.map((ex) => new ccxt[ex]({}));
for (i = 0; i < exchangesObjs.length; i++) { await exchangesObjs[i].load_markets() }

timeToEpochEndList = [60, 45, 30, 25, 20, 15, 10, 5, 0];
workingEpoch = 0;
missCount = 0;
gracePeriod = 5;
  


bulkPxPromises = [];
singlePxPromises = [];

// Bulk fetch exchanges
// special logic for Bithumb
bulkFetchIdxs = exchangesObjs.map((ex, idx) => (ex.has[`fetchTickers`] || false) && ex.id != 'bithumb');
bulkTickerExs = exchangesObjs.filter((ex, i) => bulkFetchIdxs[i])
// bulkPxPromises = bulkTickerExs.map((ex, idx) => ex.fetchTickers(tickersFull));
bulkPxPromises = bulkTickerExs.map((ex, idx) => ex.fetchTickers(tickersFull.filter((ticker, idx) => ex.symbols.includes(ticker))));



singleTickerExs = exchangesObjs.filter((ex, i) => !bulkFetchIdxs[i] && ['coinbasepro', 'bithumb'].includes(ex.id))
for (singleTickerEx of singleTickerExs) {
    if (singleTickerEx.id == 'coinbasepro') {
        // need to filter out 'XRP' pairs
        singleTickerExSupportedTickers = tickersFull.filter((ticker, idx) => 
            ticker.slice(0,3) != 'XRP' && singleTickerEx.symbols.includes(ticker)
        )
    } else {
        // need to filter out 'XRP' pairs
        singleTickerExSupportedTickers = tickersFull.filter((ticker, idx) => 
            singleTickerEx.symbols.includes(ticker)
        )
    }
    // TODO: this may cause too many request issues, may need to loop individually over each ticker as we did previously
    // push rather than concat to have parallel structure as bulkPxPromises of a separate array for each exchange
    singlePxPromises.push(singleTickerExSupportedTickers.map((ticker, idx) => singleTickerEx.fetchTicker(ticker)))
}

// Note unsupported exchanges
unsupportedExs = exchangesObjs.filter((ex, i) => !bulkFetchIdxs[i] && ex.id != 'coinbasepro')
if (unsupportedExs.length > 0) {
    console.log(`Warning! Unsupported exchanges: ${unsupportedExs.map((ex,idx) => ex.id).join(', ')}`)
}

// Resolve promises
bulkPxData = await Promise.all(bulkPxPromises);
// bulkPxData.map((exd, idx)=> Object.keys(exd).length)
singlePxDataList = await Promise.all(singlePxPromises.map(Promise.all.bind(Promise)));    // Need to resolve array of array of promises
// Convert from array of arrays of quotes to an array of dicts of {symbol: quote}
singlePxData = singlePxDataList.map((exResList, i) => {
    exResDict = {};
    exResList.forEach((quote)=> {exResDict[quote.symbol] = quote});
    return exResDict;
});
// Concatenate the two data sources
allRawData = bulkPxData.concat(singlePxData);
tickersRet = [];
for (i = 0; i < allRawData.length; i++) {
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
baseAltsPxs = tickersAltsToBase.map((altTicker, idx) => 
    math.dot(pxsEx[altTicker], volsEx[altTicker]) / math.sum(volsEx[altTicker])
);

baseAltPxsMap = new Map(baseCurrencyAlts.map((alt, idx) => [alt, baseAltsPxs[idx]]));
baseAltPxsMap.set(baseCurrency, 1);
// Get to volume weighted price for each asset
// TODO: alternative 1: can change to matrix version using math.js and (tickersBase.map((ticker) => pxsEx.get(ticker)))
// TODO: add an exchange-level weighting factor, s.t. weight = volume * exchange_factor, to reflect exchange quality of volume
// pxsAll = {}
// pxsAll = new Map(basesCombined.map((base, idx) => [base, {}]));
pxsAll = {};
basesCombined.forEach(base => pxsAll[base] = {});
prices = assets.map((asset, idx) => {
    pxsBase = [];
    volsBase = [];
    // convert each set of quotes for each base to global base (USD)
    for (base of basesCombined) {
        ticker = `${asset}/${base}`;
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


// // Get time and current epoch params
// now = await getTime(web3);
// // now = (new Date()).getTime() / 1000; // susceptible to system clock drift
// currentEpochCheck = (Math.floor((now - firstEpochStartTime) / submitPeriod)); // don't add 1 here like above
// nextEpoch;
// // check for drift
// if (epochId < currentEpochCheck) {
//     epochId = currentEpochCheck;
    
// }
// nextEpoch = epochId + 1;
// next = nextEpoch * submitPeriod + firstEpochStartTime;
// timeToEpochEnd = Math.max(Math.floor(next - now), 0);  // don't wait negative time

combinedExs = bulkTickerExs.concat(singleTickerExs)
quotesFlat = allRawData.map((exRets, i) => {
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