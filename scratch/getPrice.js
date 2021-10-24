// CCXT
// https://github.com/ccxt/ccxt
// https://ccxt.readthedocs.io/en/latest/manual.html#price-tickers







// list of exchanges: https://ccxt.readthedocs.io/en/latest/manual.html#exchanges
baseCurrency = 'USDT';
symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];

exchanges = ['binance','ftx','huobi','kucoin','gateio'];
fetchTargets = [];
exchanges.forEach(element => {
    let single =  eval(`new ccxt.${element}`);
    fetchTargets.push(single);
});

 let bitfinex  = new ccxt.bitfinex ({ verbose: true })
// let huobipro  = new ccxt.huobipro ()
// let okcoinusd = new ccxt.okcoin ({
//     apiKey: 'YOUR_PUBLIC_API_KEY',
//     secret: 'YOUR_SECRET_PRIVATE_KEY',
// })

sym = symbols[0];
ticker = [sym, baseCurrency].join('/');

// Only Kraken, Coinbase, and FTX has USDT/USD pair: https://coinmarketcap.com/currencies/tether/markets/
// Use those for conversion, flag if it's a delta of more than 1%
baseCurrencyAlt = 'USDT';
baseCurrencyAltToBaseCurrencyTicker = `${baseCurrencyAlt}/${baseCurrency}`;

tickersBase = symbols.map((sym) => `${sym}/${baseCurrency}`);
tickersBase.push(baseCurrencyAltToBaseCurrencyTicker);
tickersBaseToSymbolsMap = new Map(symbols.map((sym, i) => [sym, tickersBase[i]])); // doesn't include USD/USDT
console.log(tickersBaseToSymbolsMap);
var pxsEx = {};
const tasks = [];
for (let i = 0; i < fetchTargets.length; i++) {
    tasks.push(fetchTargets[i].fetchTickers(tickersBase));
  }

const allRawData = Promise.all(tasks);
var tickersRet = {};
allRawData.then(pxsRawExArray => {
    pxsRawExArray.forEach(pxsRawEx => {
        console.log(pxsRawEx);
        tickersRet = Object.keys(pxsRawEx); // will typically be missing a bunch of keys
        console.log("tickerRet:", tickersRet);
        tickersRet.forEach(tickerSymbol => {pxsEx[tickerSymbol] = pxsEx[tickerSymbol] || []; 
        pxsEx[tickerSymbol].push((pxsRawEx[tickerSymbol].bid + pxsRawEx[tickerSymbol].ask)/2) });
    });
    console.log(pxsEx);
    var priceProd = new Map();
    Object.entries(pxsEx).map(([key, value]) => console.log(priceProd[key] =  calculateAverage(value)))
    
});
 
 
  //pxsExList = tickersBase.map((ticker) => pxsEx.get(ticker))    // will have lots of undefineds
// extract USDT/USD price
//baseCurrencyAltPx = pxsEx.get(baseCurrencyAltToBaseCurrencyTicker)
