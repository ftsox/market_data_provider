// Scratch

/* 
    SETUP
*/

// default deploy (hh_node) 
// yarn c 
// && yarn concurrently 
//     \"yarn hardhat node > nul\" 
//     \"wait-on 
//         http://127.0.0.1:8545 
//         && env CHAIN_CONFIG=scdev 
//         yarn --silent hardhat run ./deployment/scripts/deploy-mock-price-submitter.ts --network localhost\"

// Better deploy to localhost
// yarn hardhat compile 
// yarn hardhat node # separate window
// yarn hardhat run ./deployment/scripts/deploy-mock-price-submitter.ts --network localhost
// env CHAIN_CONFIG=scdev yarn hardhat run ./deployment/scripts/mock-price-provider.ts --network localhost
// yarn hardhat run ./deployment/scripts/prod-price-provider.ts --network localhost

/* 
    Logs (on node server)
*/

// listen to HTTP API
// tail -f \$HOME/flare/logs/songbird/node1/ C.http.log


/* 
    Test RPC calls
*/

// curl -X POST \
//      -H 'Content-Type: application/json' \
//      -d '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":19}' \
//      http://127.0.0.1:9650/ext/bc/C/rpc \
//      | jq .

// curl -X POST \
//      -H 'Content-Type: application/json' \
//      -d '{"jsonrpc":"2.0", "method":"eth_getBalance", "params":["0x46c283c599a5dC4CE614092eC31F354e89b4706F", "latest"],"id":19}' \
//      http://127.0.0.1:9650/ext/bc/C/rpc \
//      | jq .

// curl -X POST \
//      -H 'Content-Type: application/json' \
//      -d '{"jsonrpc":"2.0", "method":"eth_getBalance", "params":["0x46c283c599a5dC4CE614092eC31F354e89b4706F", "latest"],"id":19}' \
//      http://198.199.88.26:9650/ext/bc/C/rpc \
//      | jq .

// curl http://198.199.88.26:9650/ext/health


/* 
    Utils
*/

const { toWei } = web3.utils;
const { fromWei } = web3.utils;
const { BN, bufferToHex, privateToAddress, toBuffer } = require("ethereumjs-util")
const math = require("mathjs");

// fromWei(new BN('0x488169aacb245a00', 16));
// new BN(parseInt("0x488169aacb245a00", 16))


/* 
    Contract interactions
*/

// Start console
// yarn hardhat console --network localhost
// yarn hardhat console --network songbird


// Get list of accounts
accounts = await ethers.getSigners();

// Get balance of addresses
fromWei((await ethers.provider.getBalance(accounts[0].address)).toString())
// (await ethers.provider.getBalance('0x46c283c599a5dC4CE614092eC31F354e89b4706F')).toString()
// fromWei((await ethers.provider.getBalance('0x46c283c599a5dC4CE614092eC31F354e89b4706F')).toString())


// // Connect to priceSubmitter
// MockPriceSubmitter = artifacts.require("MockPriceSubmitter");
// MockFtsoRegistry = artifacts.require("MockFtsoRegistry");
// MockVoterWhitelister = artifacts.require("MockVoterWhitelister");
// MockFtso = artifacts.require("MockNpmFtso");
// FtsoManager = artifacts.require("IFtsoManager");
// FtsoRewardManager = artifacts.require("IFtsoRewardManager");

// // priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
// // priceProviderAccount = web3.eth.accounts.privateKeyToAccount(priceProviderPrivateKey);
// // priceSubmitter = await MockPriceSubmitter.at("0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F");
// priceSubmitter = await MockPriceSubmitter.at("0x1000000000000000000000000000000000000003");
// ftsoRegistry = await MockFtsoRegistry.at(await priceSubmitter.getFtsoRegistry());
// voterWhitelister = await MockVoterWhitelister.at(await priceSubmitter.getVoterWhitelister());
// ftsoManager = await FtsoManager.at(await priceSubmitter.getFtsoManager());


priceSubmitterAbi     = require("./src_prod/priceSubmitter.json");
MockFtsoRegistry      = require("./src_prod/MockFtsoRegistry.json");
MockVoterWhitelister  = require("./src_prod/MockVoterWhitelister.json");
MockFtso              = require("./src_prod/MockNpmFtso.json")
priceSubmitterContract = new web3.eth.Contract(JSON.parse(JSON.stringify(priceSubmitterAbi)), priceSubmitterAddr);
ftsoRegistry = new web3.eth.Contract(JSON.parse(JSON.stringify(MockFtsoRegistry)), await priceSubmitterContract.methods.getFtsoRegistry().call());
voterWhitelister = new web3.eth.Contract(JSON.parse(JSON.stringify(MockVoterWhitelister)), await priceSubmitterContract.methods.getVoterWhitelister().call());




// ftsoRewardManager = await FtsoRewardManager.at(await ftsoManager.rewardManager()); 
// ftsoManager interface doesn't include this function
// can grab ABI from the explorer (https://songbird-explorer.flare.network/address/0xbfA12e4E1411B62EdA8B035d71735667422A6A9e/contracts)
// and convert with this https://bia.is/tools/abi2solidity/
ftsoRewardManager = await FtsoRewardManager.at('0xc5738334b972745067fFa666040fdeADc66Cb925');

console.log(`Addresses:`)
console.log(`\tpriceSubmitter:      ${priceSubmitter.address}`)     // 0x1000000000000000000000000000000000000003   
console.log(`\tftsoRegistry:        ${ftsoRegistry.address}`)       // 0x6D222fb4544ba230d4b90BA1BfC0A01A94E6cB23
console.log(`\tvoterWhitelister:    ${voterWhitelister.address}`)   // 0xa76906EfBA6dFAe155FfC4c0eb36cDF0A28ae24D

// Get indices for specific symbols
ftsoSupportedIndices = (await ftsoRegistry.getSupportedIndices()).map(idx => (idx.toNumber()));

// symbols = ["SGB", "XRP", "LTC", "XLM", "XDG", "ADA", "ALGO", "BCH", "DGB", "BTC"];
// symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];
symbols = await Promise.all(ftsoSupportedIndices.map(async idx => await ftsoRegistry.getFtsoSymbol(idx)));
ftsos = await Promise.all(symbols.map(async sym => await MockFtso.at(await ftsoRegistry.getFtsoBySymbol(sym))));
// x = await MockFtso.at(await ftsoRegistry.getFtsoBySymbol(sym))

// ftsoAddresses = await Promise.all( symbols.map(async sym => await ftsoRegistry.getFtsoBySymbol(sym)) );
ftsoAddresses = await ftsoRegistry.getAllFtsos();  // more efficient
// [
//     '0xA1a9B8aB5BB798EeE536A23669AD744DCF8537a3',
//     '0x157D6316475765F13348DfA897C503Af0161B232',
//     '0xDC2cFeEe7Da8Be3eEF13B9e05BB4235063d0eCc1',
//     '0xBc696A456E351C8a5f170135868a3850eB29135A',
//     '0xCe7472A48754A2AFe34951c6F35f7BFE01bb8FeE',
//     '0x2Ce1d8653BbCa3F636A63E35136f4e015f0b4647',
//     '0x9dCda46Cb0589ec54384801905b2F79B65E93347',
//     '0xd47B92E53941b7f71AcA3cD6235C866c55b4f23a',
//     '0x20Fecb7b1Ff69C62BBA5Bb6aCD5a9743D11E246F',
//     '0x3C028fE13a87229D5D56a5b234eDC0199794684e',
//     '0x71c57de677222f5E9BB3a3134Eb27aEe8b50BD39'
//   ]

// Map(11) {
//     'XRP' => 0,
//     'LTC' => 1,
//     'XLM' => 2,
//     'DOGE' => 3,
//     'ADA' => 4,
//     'ALGO' => 5,
//     'BCH' => 6,
//     'DGB' => 7,
//     'BTC' => 8,
//     'ETH' => 9,
//     'FIL' => 10
//   }

// Get indices on which to submit
// Redundant with the above, unless we can't get prices for some
// ftsoIndices = await Promise.all( symbols.map(async sym => (await ftsoRegistry.getFtsoIndex(sym)).toNumber()) );
ftsoIndices = ftsoSupportedIndices;

// Combine them for easier future use
currencyIndices = new Map( symbols.map((c, i) => [c, ftsoIndices[i]]) );


// Get list of existing providers for an index
// xrpWhitelist = await voterWhitelister.getFtsoWhitelistedPriceProviders(currencyIndices.get('XRP'))
// xrpWhitelist.length
ftsoWhitelists = await Promise.all(ftsoSupportedIndices.map(async idx => await voterWhitelister.getFtsoWhitelistedPriceProviders(idx)));
ftsoWhitelistsCounts = new Map( symbols.map((c, i) => [c, ftsoWhitelists[i].length]) )

// //// Get data provider fee percentages
// currentProviderFees = await Promise.all( ftsoWhitelists[0].map( async address => (await ftsoRewardManager.getDataProviderCurrentFeePercentage(address)).toNumber() ) );
// console.log(`Number of rows: ${df.size / df.columns.length}`);
// futureProviderFeesRaw = await Promise.all( ftsoWhitelists[0].map( async address => await ftsoRewardManager.getDataProviderScheduledFeePercentageChanges(address) ) );
// futureProviderFees = []
// for (let i=0; i < ftsoWhitelists[0].length; i++) {
//     fpData = futureProviderFeesRaw[i]._feePercentageBIPS;
//     nChangesPending = fpData.length;
//     if (nChangesPending > 0) {
//         // latest one should be the most recent update
//         futureFee = fpData[nChangesPending-1].toNumber();
//         futureProviderFees.push(futureFee);
//     } else {
//         futureProviderFees.push(currentProviderFees[i]);
//     }
// }
// const dfd = require('danfojs-node');
// df = new dfd.DataFrame({'Addresses': ftsoWhitelists[0]});
// df.addColumn({'column': 'CurrentFee', 'values': currentProviderFees, inplace: true});
// df.addColumn({'column': 'FutureFee', 'values': futureProviderFees, inplace: true});
// df.addColumn({'column': 'FeeDiff', 'values': df['FutureFee'].sub(df['CurrentFee']), inplace: true});
// console.log(df.to_csv('providers.csv'))
// // df['FeeDiff'].mean()
// // df['FeeDiff'].std()
// // x = new dfd.Series(ftsoWhitelists[0])


// JS docs: https://github.com/miscavage/CoinGecko-API
// Coin list: https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
cgSymbolMapping = {
    'XRP': 'ripple',
    'LTC': 'litecoin',
    'XLM': 'stellar',
    'DOGE': 'dogecoin',
    'ADA': 'cardano',
    'ALGO': 'algorand',
    'BCH': 'bitcoin-cash',
    'DGB': 'digibyte',
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'FIL': 'filecoin',
};
cgNames = Object.values(cgSymbolMapping)
var revCgMap = {};
Object.keys(cgSymbolMapping).map( (sym, idx) => {
    revCgMap[cgSymbolMapping[sym]] = sym;
});

// // loop over each
// idx = 0;
// cgId = cgSymbolMapping[symbols[idx]];
// data = await CoinGeckoClient.coins.fetch(cgId, {});
// data.data.market_data.current_price['usd']
baseCurrencyLower = 'usd'
data = await CoinGeckoClient.simple.price({ ids: cgNames, vs_currencies: [baseCurrencyLower], });
symbols.map(sym => data.data[cgSymbolMapping[sym]][baseCurrencyLower]);
// Only gives 2 decimals for XRP



// CoinApi
// https://docs.coinapi.io/#md-docs
// List of asset symbols: https://www.coinapi.io/integration
// Detail on how market price is calculated: https://support.coinapi.io/hc/en-us/articles/360018953291-How-are-exchange-rates-calculated-


// async function getCoinApiPrice(sym) {
//     toCurr = 'USD';
//     // fromCurr = symbols[idx]
//     fromCurr = sym;
//     // var options = {
//     //     method: 'GET',
//     //     url: `https://coinapi.p.rapidapi.com/v1/exchangerate/${fromCurr}/${toCurr}`,
//     //     headers: {
//     //         'x-rapidapi-host': 'coinapi.p.rapidapi.com',
//     //         'x-rapidapi-key': process.env.COINAPI_KEY
//     //     }
//     // };

//     var options = {
//         method: 'GET',
//         url: `https://rest.coinapi.io/v1/exchangerate/${fromCurr}/${toCurr}`,
//         headers: {
//             'X-CoinAPI-Key': process.env.COINAPI_KEY
//         }
//     };    

//     data = await axios.request(options)
//     return data.data.rate
// }


// async function getCoinApiPriceAsync(sym) {
//     toCurr = 'USD';
//     fromCurr = sym;
//     var options = {
//         method: 'GET',
//         url: `https://rest.coinapi.io/v1/exchangerate/${fromCurr}/${toCurr}`,
//         headers: {
//             'X-CoinAPI-Key': process.env.COINAPI_KEY
//         }
//     };    

//     return axios.request(options)
// }


// startTime = new Date();
// for (sym of symbols) { console.log(`${sym}: ${await getCoinApiPrice(sym)}`);}
// endTime = new Date();
// totalTime = (endTime-startTime)/1000;
// console.log(`Total time to call each price API sequentially: ${totalTime} seconds`)


// toCurr = 'USD';
// // fromCurr = symbols[idx]
// fromCurr = sym;
// var options = {
//     method: 'GET',
//     url: `https://rest.coinapi.io/v1/exchangerate/${fromCurr}/${toCurr}`,
//     headers: {
//         'X-CoinAPI-Key': process.env.COINAPI_KEY
//     }
// };
// data = await axios.request(options)
// data.data.rate

startTime = new Date();
// too much data transferred
toCurr = 'USD'
options = {
  method: 'GET',
  url: `https://rest.coinapi.io/v1/exchangerate/${toCurr}?filter_asset_id=${symbols.join(";")};`,   // need trailing semicolon, invert doesn't work
  headers: {
    'X-CoinAPI-Key': process.env.COINAPI_KEY // use for testing
  }
};
data = await axios.request(options);
bulkRates = data.data.rates // returns in alphabetical order
idxMap = new Map( bulkRates.map((rateObj, i) => [rateObj.asset_id_quote, i]) )
// confirm length
assert(bulkRates.length == symbols.length)
// need to invert since invert flag doesn't work in API if we are also filtering by asset
prices = symbols.map( (sym, i) => 1/bulkRates[idxMap.get(sym)].rate)
endTime = new Date();
totalTime = (endTime-startTime)/1000;
console.log(`Total time to call all prices API: ${totalTime} seconds`)




// Zabo
// https://zabo.com/docs/#get-exchange-rates


// // CryptoCompare
// // // Get prices
// baseCurrency = 'USD';
// ccApiKey = process.env.CC_API_KEY;
// ccApiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join()}&tsyms=${baseCurrency}&api_key=${ccApiKey}`;

// // https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// const axios = require('axios');
// pricesRaw = (response = await axios.get(ccApiUrl)).data
// prices = symbols.map(sym => pricesRaw[sym][baseCurrency])




// CoinMarketCap
// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest
/* Example in Node.js ES6 using request-promise */

options = {
  method: 'GET',
  url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
  params: {
    'symbol': `${symbols.join(",")}`,
    'convert': `${baseCurrency}`
  },
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY
  },
};
response = await axios.request(options);
// idxMap = new Map( response.data.map((rateObj, i) => [rateObj.asset_id_quote, i]) )
prices = []
// for (sym of symbols) { prices.push(response.data.data[sym].quote[baseCurrency]['price']) }
symbols.map((sym, i) => response.data.data[sym].quote[baseCurrency]['price'])
// data.data.data['XRP'].quote['USD'].price



// CCXT
// https://github.com/ccxt/ccxt
// https://ccxt.readthedocs.io/en/latest/manual.html#price-tickers
const ccxt = require ('ccxt');

// list of exchanges: https://ccxt.readthedocs.io/en/latest/manual.html#exchanges
baseCurrency = 'USD';
symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];

exchanges = ['binance','ftx','huobi','kucoin','gateio'];
fetchTargets = [];
exchanges.forEach(element => {
    let single =  eval(`new ccxt.${element}`);
    fetchTargets.push(single);
});

// let bitfinex  = new ccxt.bitfinex ({ verbose: true })
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
var pxsEx = {};
tasks = [];
for (let i = 0; i < fetchTargets.length; i++) {
    tasks.push(fetchTargets[i].fetchTickers(tickersBase));
  }

allRawData = Promise.all(tasks);
tickersRet = {};
allRawData.then(pxsRawEx => {
    tickersRet = Object.keys(pxsRawEx); // will typically be missing a bunch of keys
    console.log(tickersRet);
    //tickersRet.forEach(tickerSymbol => {pxsEx[tickerSymbol] = pxsEx[tickerSymbol] || []; pxsEx[tickerSymbol].push((pxsRawEx[ticker].bid + pxsRawEx[ticker].ask)/2) });
});

pxsRawEx = await ftx.fetchTickers(tickersBase);
tickersRet = Object.keys(pxsRawEx); // will typically be missing a bunch of keys
pxsEx = new Map(tickersRet.map((ticker) => [ticker, (pxsRawEx[ticker].bid + pxsRawEx[ticker].ask)/2] ));
pxsExList = tickersBase.map((ticker) => pxsEx.get(ticker))    // will have lots of undefineds

 
  //pxsExList = tickersBase.map((ticker) => pxsEx.get(ticker))    // will have lots of undefineds
// extract USDT/USD price
baseCurrencyAltPx = pxsEx.get(baseCurrencyAltToBaseCurrencyTicker)


// pxsRawExList = symbols.map((sym) => )





// x = await binance.fetchTicker ('BTC/USD')
// x = await coinbase.fetchTicker(baseCurrencyAltToBaseCurrencyTicker);
// y = await kraken.fetchTicker  (baseCurrencyAltToBaseCurrencyTicker);
// z = await ftx.fetchTicker     (baseCurrencyAltToBaseCurrencyTicker);
// USD exchanges

// USDT exchanges

// const exchangeId = 'binance'
//     , exchangeClass = ccxt[exchangeId]
//     , exchange = new exchangeClass ({
//         'apiKey': 'YOUR_API_KEY',
//         'secret': 'YOUR_SECRET',
//     })

// console.log (kraken.id,    await kraken.loadMarkets ())
// console.log (bitfinex.id,  await bitfinex.loadMarkets  ())
// console.log (huobipro.id,  await huobipro.loadMarkets ())

// console.log (kraken.id,    await kraken.fetchOrderBook (kraken.symbols[0]))
// console.log (bitfinex.id,  await bitfinex.fetchTicker ('BTC/USD'))
// console.log (huobipro.id,  await huobipro.fetchTrades ('ETH/USDT'))

// console.log (okcoinusd.id, await okcoinusd.fetchBalance ())

// // sell 1 BTC/USD for market price, sell a bitcoin for dollars immediately
// console.log (okcoinusd.id, await okcoinusd.createMarketSellOrder ('BTC/USD', 1))

// // buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
// console.log (okcoinusd.id, await okcoinusd.createLimitBuyOrder ('BTC/USD', 1, 2500.00))

// // pass/redefine custom exchange-specific order params: type, amount, price or whatever
// // use a custom order type
// bitfinex.createLimitSellOrder ('BTC/USD', 1, 10, { 'type': 'trailing-stop' })










// Epoch periods

var {
    0: firstEpochStartTimeBN,
    1: submitPeriodBN,
    2: revealPeriodBN,
} = (await ftsos[0].getPriceEpochConfiguration());

var [firstEpochStartTime, submitPeriod, revealPeriod] = 
    [firstEpochStartTimeBN, submitPeriodBN, revealPeriodBN].map(x => x.toNumber());

console.log(`FTSO parameters:`);
console.log(`\tfirstEpochStartTime: ${new Date(firstEpochStartTime * 1000)}`);
console.log(`\tsubmitPeriod (secs): ${submitPeriod}`);
console.log(`\trevealPeriod (secs): ${revealPeriod}`);


// //// Transaction submission scratch work
// // now = await getTime();
// // now = (new Date()).getTime() / 1000; 
// async function getTime() {
//     const blockNum = await ethers.provider.getBlockNumber();
//     const block = await ethers.provider.getBlock(blockNum);
//     const timestamp = block.timestamp;
//     return timestamp
// }

// priceProviderAccount = (await ethers.getSigners())[0];

// now = await getTime();
// startingEpoch = Math.floor((now - firstEpochStartTime) / submitPeriod) + 1; // add 1 since we are waiting for next epoch
// next = startingEpoch * submitPeriod + firstEpochStartTime;  // works since startingEpoch is actually next epoch here
// diff = Math.floor(next - now) + 1;
// currentEpoch = startingEpoch;
// nextEpoch = currentEpoch + 1;
// submitBuffer = 0;  

// // Get time and current epoch params
// now = await getTime();
// currentEpoch = Math.floor((now - firstEpochStartTime) / submitPeriod);
// nextEpoch = currentEpoch + 1;
// start = currentEpoch * submitPeriod + firstEpochStartTime;
// next = nextEpoch * submitPeriod + firstEpochStartTime;

// console.log("\n\nEpoch ", currentEpoch); 
// console.log(`\tEpoch start time: ${new Date(start * 1000)}`);
// console.log(`\tCurrent time:     ${new Date(now * 1000)}`);
// console.log(`\tEpoch end time:   ${new Date(next * 1000)}`);

// console.log(`Start submit for epoch ${currentEpoch}`);
// console.log(`\tStart getting prices:    ${Date()}`); 

// function submitPriceHash(price, random, address,) { return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([ "uint256", "uint256", "address" ], [price.toString(), random.toString(), address])) }
// function getPrice(epochId, asset) { return Math.floor(Math.random() * 200 + 10000); }
// function getRandom(epochId, asset) { return Math.floor(Math.random() * 1000); }
// prices = symbols.map(sym => getPrice(currentEpoch, sym));
// randoms = symbols.map(sym => getRandom(currentEpoch, sym)); 
// hashes = prices.map((p, i) => 
//     submitPriceHash(p, randoms[i], priceProviderAccount.address)
// );

// // To get an error, change currentEpoch to an earlier time
// submission = await priceSubmitter.submitPriceHashes(currentEpoch, ftsoIndices, hashes, {from: priceProviderAccount.address} );
// // expectEvent(submission, "PriceHashesSubmitted", { ftsos: ftsoAddresses, 
// //     epochId: currentEpoch.toString(), hashes: hashes});

// // Throw an error
// // Change epoch number in submitPriceHashes as appropriate
// let err;
// async function testSubmit() {
//     try {
//       submission = await priceSubmitter.submitPriceHashes(0,ftsoIndices, hashes, {from: priceProviderAccount.address, gasLimit: 1000000 });
//     } catch (error) {
//       err = error;
//       error.message;
//     }
//   }
// await testSubmit()


// // Time getTime() command
// nRuns = 100;
// startTime = new Date();
// for (let i = 0; i < nRuns; i++) { x = await getTime() };
// endTime = new Date();
// totalTime = (endTime-startTime)/1000;
// avgTime = totalTime/nRuns;
// console.log(`Average time per run: ${avgTime} seconds`)
// // 1.33805 seconds


// Listen for PriceFinalized event
// https://docs.ethers.io/v5/api/providers/provider/#Provider--events

// PriceFinalized event
// https://songbird-explorer.flare.network/tx/0x1a7890f59d2dcf8ff2885bf48fd2cc934fcb9ab1233ab34291e6c78f324e2e20/internal-transactions
// https://songbird-explorer.flare.network/address/0xA1a9B8aB5BB798EeE536A23669AD744DCF8537a3/logs
// PriceFinalized(uint256 indexed epochId, uint256 price, bool rewardedFtso, uint256 lowRewardPrice, uint256 highRewardPrice, uint8 finalizationType, uint256 timestamp)
priceProviderAccount = (await ethers.getSigners())[0];



// ftso0 = ftsos[0];
// filter = {
//     address: ftso0.address,
//     topics: [
//         // the name of the event, parnetheses containing the data type of each event, no spaces
//         // utils.id("Transfer(address,address,uint256)")
//         // ethers.utils.id("PriceFinalized(uint256 indexed epochId, uint256 price, bool rewardedFtso, uint256 lowRewardPrice, uint256 highRewardPrice, uint8 finalizationType, uint256 timestamp)")
//         ethers.utils.id("PriceFinalized(uint256,uint256,bool,uint256,uint256,uint8,uint256)"),  // '0xfe8865c1fe85bbf124b9e0f16cccfeeb6f330454fd79475a31261c8fa250bc30'
//     ]
// }
// ethers.provider.on(filter, (log, event) => {
//     console.log(log);
//     console.log(event);
// })

// ftso0.contract.events.PriceRevealed()
// eventFilter = ftso0.filters.ContractEvent()


// // Web3.js
// // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#contract-events
// // Listen to ongoing events
// ftso0.contract.events.PriceRevealed().on('data', function(event){
//     console.log(event); // same results as the optional callback above
// })


// // Historical events
// // priceResults = await ftso0.contract.getPastEvents('PriceFinalized', {fromBlock: 783700, toBlock: 'latest'});
// // can also get bulk from PriceSubmitter
// priceResults = await ftso0.contract.getPastEvents('PriceFinalized', {filter: {epochId: [14101, 14100]}, fromBlock: 783000, toBlock: 'latest'});


// // event PriceRevealed(
// //     address indexed voter, uint256 indexed epochId, uint256 price, uint256 random, uint256 timestamp,
// //     uint256 votePowerNat, uint256 votePowerAsset
// // );
// // myPrices = await ftso0.contract.getPastEvents('PriceRevealed', {fromBlock: 783700, toBlock: 'latest'});
// myPrices = await ftso0.contract.getPastEvents('PriceRevealed', { filter: {voter: priceProviderAccount.address, epochId: [14101, 14100]}, fromBlock: 783000, toBlock: 'latest' })


// // for (let i=0; i<priceResults.length; i++) {
// //     console.log(`\nEpoch: ${priceResults[i].returnValues.epochId}`);
// //     console.log(`Median price:  ${priceResults[i].returnValues.price}`);
// //     console.log(`Lower bound:   ${priceResults[i].returnValues.lowRewardPrice}`);
// //     console.log(`Upper bound:   ${priceResults[i].returnValues.highRewardPrice}`);
// //     console.log(`My price:      ${myPrices[i].returnValues.price}`);
// // }


// Get current reward
currentPriceEpoch = (await ftsoManager.getCurrentPriceEpochData())._priceEpochId.toNumber();
currentRewardEpoch = (await ftsoManager.getCurrentRewardEpoch()).toNumber();
var {
    0: _dataProviders,
    1: _rewardAmounts,
    2: _claimed,
    3: __claimable
} = await ftsoRewardManager.getStateOfRewards(priceProviderAccount.address, currentRewardEpoch);
bnAddReducer = (previousValue, currentValue) => previousValue.add(currentValue);
pendingRewards = _rewardAmounts.reduce(bnAddReducer)
console.log(`Pending rewards for provider ${priceProviderAccount.address} as of reward epoch ${currentRewardEpoch}: ${fromWei(pendingRewards)}`);



// Get prices from all nodes
const dfd = require('danfojs-node');

rewardHitRates = [];

// for (idx of ftsoIndices) {
// Use XRP FTSO as base list
// baseIdx = 0;
idx = 0;
console.log(`Starting asset ${idx}`);
baseIdx = idx;
ftsoProviders = ftsoWhitelists[baseIdx];
baseFtso = ftsos[baseIdx];

// Estimate average block time (in seconds) over past N blocks
blockDelta = 10000;
lastBlock = await ethers.provider.getBlock('latest');
prevBlock = await ethers.provider.getBlock(lastBlock.number - blockDelta);
avgBlockTime = (lastBlock.timestamp - prevBlock.timestamp)/blockDelta;      // in seconds

// Lookback period to get start epoch
lookbackPriceEpochs = 1000;
blocksPerPriceEpoch = submitPeriod / avgBlockTime;
lockbackBlocks = Math.round(lookbackPriceEpochs * blocksPerPriceEpoch);

// toBlock = await ethers.provider.getBlockNumber();
toBlock = lastBlock.number; // saves a RPC call
fromBlock = toBlock - lockbackBlocks;

finalPrices = await baseFtso.contract.getPastEvents('PriceFinalized', {filter: {}, fromBlock: fromBlock, toBlock: toBlock});
finalPricesResults = finalPrices.map(fp => JSON.parse(JSON.stringify(fp.returnValues)));
// // Takes too long
// epochRange = Array.from({length: lookbackPriceEpochs}, (v, i) => currentPriceEpoch - i);
// finalPrices2 = await baseFtso.contract.getPastEvents('PriceFinalized', {filter: {epochId: epochRange}, fromBlock: 0, toBlock: toBlock});
combDf = new dfd.DataFrame(finalPricesResults);
// Drop repeat columns
combDf.drop({ columns: ['0', '1', '2', '3', '4', '5', '6',], inplace: true });
// convert numeric columns from string
numericCols = ['epochId', 'price', 'lowRewardPrice', 'highRewardPrice', 'finalizationType', 'timestamp'];
for (col of numericCols) {
    // console.log(col)
    combDf.astype({column: col, dtype: 'int32', inplace: true})
}
// Set index
combDf.set_index({ column: "epochId", inplace: true });
// console.log(df.to_csv('providers.csv'));
// combDf.head().print();

// Get prices for a provider
// Todo: change to batch across all assets using PriceSubmitter contract PriceRevealed event
providerAddress = priceProviderAccount.address;
providerPrices = await baseFtso.contract.getPastEvents('PriceRevealed', { filter: {voter: providerAddress}, fromBlock: fromBlock, toBlock: toBlock});
providerPricesResults = providerPrices.map(fp => JSON.parse(JSON.stringify(fp.returnValues)));
// providerPrices = await baseFtso.contract.getPastEvents('PriceRevealed', {fromBlock: fromBlock, toBlock: toBlock});

// Data munging
provDf  = new dfd.DataFrame(providerPricesResults);
// Drop repeat columns
provDf.drop({ columns: ['0', '1', '2', '3', '4', '5', '6',], inplace: true });
// convert numeric columns from string
numericCols = ['epochId', 'price', 'random', 'timestamp', 'votePowerNat', 'votePowerAsset'];
for (col of numericCols) {
    provDf.astype({column: col, dtype: 'int32', inplace: true})
}
// set index
provDf.set_index({ column: "epochId", inplace: true });

// Merge with combined dataframe
// provDfMerge = new dfd.DataFrame({ 'epochId': provDf.epochId.values, providerAddress: provDf.price.values });
// provDfMerge = new dfd.DataFrame({ 'epochId': provDf.epochId.values, 'price': provDf.price.values });
provDfMerge = provDf.loc({columns: ['epochId', 'price'] });
provDfMerge.rename({ mapper: {'price': providerAddress}, inplace: true });
// combDf.addColumn({'column': providerAddress, 'values': provDf.price, inplace: true});
// provDf.shape

mergeDf = dfd.merge({ 'left': combDf, 'right': provDfMerge, 'on': ['epochId'], 'how': 'left' });

function inBetweenPrice(row) {    
    return row.reduce( (low, high, price) =>  price >= low && price <= high );
}

// inBand = merge_df.loc(
//         { columns: ['lowRewardPrice', 'highRewardPrice', providerAddress] }
//     ).apply(
//         (row) => row.reduce(
//             (low, high, price) => { return (price >= low & price <= high) }
//         ), 
//         {axis: 0}
//     );

bandsDf = mergeDf.loc({ columns: ['lowRewardPrice', 'highRewardPrice', providerAddress] })
// inBand = bandsDf.apply(inBetweenPrice, {axis: 0} );

// do it manually because danfo apply is terrible
let low, high, price;
inBandArr = Array(bandsDf.shape[0])
for (i=0; i<bandsDf.shape[0]; i++) {
    row = bandsDf['$data'][i];
    [low, high, price] = row;
    if (Number.isNaN(price)) {
        inBandArr[i] = NaN;
    } else {
        inBandArr[i] = price >= low && price <= high;
    }
}
mergeDf.addColumn({'column': providerAddress+'-Reward', 'values': inBandArr, inplace: true});
hitRate = mergeDf[providerAddress+'-Reward'].sum()/mergeDf[providerAddress].dropna().shape[0]

console.log(`Reward hit rate for ${symbols[baseIdx]} between epochs ${mergeDf['epochId'].min()} and ${mergeDf['epochId'].max()}: ${(hitRate * 100).toFixed(3)}%`)
rewardHitRates.push(hitRate)


// currencyHitRates = new Map( symbols.map((c, i) => [c, rewardHitRates[i]]));
// console.log(currencyHitRates);
// avgHitRate = math.mean(rewardHitRates);
// console.log(`Average hit rate across all assets: ${(avgHitRate * 100).toFixed(3)}%`)


//////////////////////////////////////////////
// Current CCXT
////////


ccxt = require ('ccxt');
math = require("mathjs");


// list of exchanges: https://ccxt.readthedocs.io/en/latest/manual.html#exchanges
baseCurrency = 'USD';
symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];
assets = symbols
exchanges = ['coinbasepro', 'binance','ftx','huobi','kucoin','gateio'];


// let   fetchTargets: any[] =  [];
// exchanges.forEach(element => {
//     // let single = eval(`new ccxt.${element}`);
//     let exchange = new ccxt[element]({});
//     fetchTargets.push(exchange);
// });
if(exchanges.length == 0)
{
    console.error("CCXT chosen but no exchange source, exiting")
    process.exit(1);
}
string = "";
exchanges.forEach(function(element){
    string += element + " ";
});
console.log("Ex Src: ", string);
exchangesObjs = exchanges.map((ex) => new ccxt[ex]({}));
exchangesMarkets = await Promise.all(exchangesObjs.map((ex) => ex.load_markets()))

// let sym = assets[0];
// let ticker = [sym, baseCurrency].join('/');

baseCurrency = 'USD';
// baseCurrencyAlts = ['USDT', 'BTC'];   // enable multiple alternative bases
baseCurrencyAlts = [];   // enable multiple alternative bases
basesCombined = [baseCurrency, ...baseCurrencyAlts];
// baseCurrencyAlts = ['USDT',];   // enable multiple alternative bases
// Only Kraken, Coinbase, and FTX has USDT/USD pair: https://coinmarketcap.com/currencies/tether/markets/
// Use those for conversion, flag if it's a delta of more than x% (TODO)
//['XRP/USD`, 'LTC/USD' ...]
tickersBase = assets.map((sym) => `${sym}/${baseCurrency}`);
// [][] -> ['XRP/USDT`, `LTC/USDT` ...][`XRP/BTC`, `LTC/BTC` ...]
tickersBaseAlts = baseCurrencyAlts.map(baseCurrencyAlt => assets.map((sym) => `${sym}/${baseCurrencyAlt}`));
//[] -> [XRP/USDT`, `LTC/USDT`..., `XRP/BTC`, `LTC/BTC`...]
tickersBaseAltsFlat = tickersBaseAlts.reduce((partial_list, a) => [...partial_list, ...a], []);
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
formattedSingleRawData = {};


allRawData = [];
pxPromises = [];
singlePxPromises = [];
// Get async Promise API call objects
bulkFetchIdxs = exchangesObjs.map((ex, idx) => ex.has[`fetchTickers`] || false);
// Bulk fetch exchanges
bulkTickerExs = exchangesObjs.filter((ex, i) => bulkFetchIdxs[i])
bulkPxPromises = bulkTickerExs.map((ex, idx) => ex.fetchTickers(tickersFull));

// individual ticker exchanges
// only do for Coinbase
// TODO: add more single ticker exchanges, like Kraken
singleTickerExs = exchangesObjs.filter((ex, i) => !bulkFetchIdxs[i] && ex.id == 'coinbasepro')
usdTickers = tickersFull.filter((ticker, idx) => ticker.split('/')[1] == 'USD')
for (singleTickerEx of singleTickerExs) {
    if (singleTickerEx.id == 'coinbasepro') {
    // if (singleTickerExs.length > 0) {
        singleTickerExSupportedTickers = tickersFull.filter((ticker, idx) => singleTickerEx.symbols.includes(ticker))
        // TODO: this may cause too many request issues, may need to loop individually over each ticker as we did previously
        // singlePxPromises = singlePxPromises.concat(singleTickerExSupportedTickers.map((ticker, idx) => singleTickerEx.fetchTicker(ticker)))
        // push rather than concat to have parallel structure as bulkPxPromises
        singlePxPromises.push(singleTickerExSupportedTickers.map((ticker, idx) => singleTickerEx.fetchTicker(ticker)))
    }
}

// Note unsupported exchanges
unsupportedExs = exchangesObjs.filter((ex, i) => !bulkFetchIdxs[i] && ex.id != 'coinbasepro')
if (unsupportedExs.length > 0) {
    console.log(`Warning! Unsupported exchanges: ${unsupportedExs.map((ex,idx) => ex.id).join(', ')}`)
}

// Resolve promises
bulkPxData = await Promise.all(bulkPxPromises);
// Assumes only one singlePxDataEx exchange - otherwise will commingle all the singlePxDataEx return prices
// singlePxDataList = await Promise.all(singlePxPromises);
// singlePxData = {}
// singlePxDataList.forEach((quote)=> {singlePxData[quote.symbol] = quote})
// allRawData = bulkPxData.concat(singlePxData)
singlePxDataList = await Promise.all(singlePxPromises.map(Promise.all.bind(Promise)));    // Need to resolve array of array of promises
singlePxData = singlePxDataList.map((exResList, i) => {
    let exResDict = {};
    exResList.forEach((quote)=> {exResDict[quote.symbol] = quote});
    return exResDict;
});
allRawData = bulkPxData.concat(singlePxData);



// for (i = 0; i < exchangesObjs.length; i++) {
//     if (exchangesObjs[i].has[`fetchTickers`])
//         pxPromises.push(exchangesObjs[i].fetchTickers(tickersFull));
//     else if (exchangesObjs[i].id.toLowerCase() == `coinbasepro`)
//     {
//         for (j = 0; j < tickersFull.length; j++)
//         {
//             try
//             {
//                 if(tickersFull[j] != "USD/USDT" && tickersFull[j] != "USDT/USD")
//                     formattedSingleRawData[tickersFull[j]] = await exchangesObjs[i].fetchTicker(tickersFull[j].replace("USDT", "USD"));   
//                 else
//                     formattedSingleRawData[tickersFull[j]] = await exchangesObjs[i].fetchTicker(tickersFull[j]);   
//             }
//             catch(err){
//                 if (err instanceof Error) {
//                     if(err.name!='BadSymbol')
//                         console.log(err); //ignore BadSymbol
//                     }
//             }

//         }
//         allRawData.push(formattedSingleRawData);
        
//     }
    
//     else
//         console.error("Unhandled exchange: ", exchangesObjs[i].name);
// }
// // Get async Promise API call objects
// //pxPromises = exchangesObjs.map((ex, idx) => ex.fetchTickers(tickersFull));

// // Resolve those Promises concurrently
// // This takes by far the longest time in this function, roughly 2 to 2.5 seconds

// tempData = await Promise.all(pxPromises);
// tempData.map(x => allRawData.push(x));

// // Sort the raw data into various tickers


function populateQuoteVolume(tickerData) {
    if(tickerData.quoteVolume == null) {
        tickerData.quoteVolume = tickerData.baseVolume * ((tickerData.bid + tickerData.ask) / 2);
    }
    return tickerData;
}


tickersRet = [];
for (i = 0; i < allRawData.length; i++) {
    //console.log(allRawData[i]);
    tickersRet = Object.keys(allRawData[i]); // will typically be missing a bunch of keys
    //console.log("tickerRet:", tickersRet);
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
prices = assets.map((asset, idx) => {
    pxsBase = [];
    volsBase = [];
    // convert each set of quotes for each base to global base (USD)
    for (base of basesCombined) {
        ticker = `${asset}/${base}`;
        // pxsBase = [...pxsBase, ...((math.dotMultiply(pxsEx[ticker], baseAltPxsMap.get(base))) || []) ];
        pxsBase.push (...math.dotMultiply(pxsEx[ticker] || [], baseAltPxsMap.get(base)));
        if (volumeWeight) {
            volsBase.push(...math.dotMultiply(volsEx[ticker] || [], baseAltPxsMap.get(base)));
        } else {
            volsBase.push(...(new Array((pxsEx[ticker] || []).length).fill(1)));
        }
    }
    if (pxsBase.length == 0) {
        // no prices for the asset on the given exchanges, return NaN
        return NaN
    } else {
        return math.dot(pxsBase, volsBase) / math.sum(volsBase);
    }
});





prices = [];
// realvolumeWeight = volumeWeight;
loopVolumeWeight = volumeWeight;
for(j = 0; j < assets.length; j++) {
    pxsBase = [];
    volsBase = [];
    // convert each set of quotes for each base to global base (USD)
    for (base of basesCombined) {
        loopVolumeWeight = volumeWeight;
        ticker = `${assets[j]}/${base}`;
        // pxsBase = [...pxsBase, ...((math.dotMultiply(pxsEx[ticker], baseAltPxsMap.get(base))) || []) ];
        if (pxsEx[ticker] == null) {
            //speical handling for tickers goes here
            if (assets[j] == 'DGB') {
                asset_array = []
                asset_array.push(assets[j]);
                temp =  await getPricesCryptoCompare(asset_array);
                pxsBase.push(temp[0]);
                volsBase.push(...(new Array(1).fill(1)));       
                continue;
            }
            //add more speical pair handling
            else
            {
                console.log(ticker, "has no price nor special handling, defaulting to cryptocompare (bad)");
                asset_array = []
                asset_array.push(assets[j]);
                temp =  await getPricesCryptoCompare(asset_array);
                pxsBase.push(temp[0]);
                volsBase.push(...(new Array(1).fill(1)));    
                continue;           
            }
        }
        else if ((volsEx[ticker] == null && loopvolumeWeight) || 
            (pxsEx[ticker].length != volsEx[ticker].length))
        {
            //if we reach here that means we have price but no volume.
            console.log(ticker, "has no volume or lengths dont match");
            loopVolumeWeight = false;
        }
        pxsBase.push (...math.dotMultiply(pxsEx[ticker], baseAltPxsMap.get(base)));
        if (loopVolumeWeight) {
            volsBase.push(...math.dotMultiply(volsEx[ticker] , baseAltPxsMap.get(base)));
        } else {
            volsBase.push(...(new Array((pxsEx[ticker] ).length).fill(1)));
        }
    }
    prices.push( math.dot(pxsBase, volsBase) / math.sum(volsBase));
}



// TODO: alternative 2: allRawData.map()
quotesFlat = allRawData.map((exRets, i) => {
    return Object.entries(exRets).map(([ticker, quote], j) => {
        return {
            'exchangeId': exchangesObjs[i].id,  // Needs to be mapped to the above
            'ticker': ticker,
            'asset': quote['symbol'].split('/')[0],
            'base': quote['symbol'].split('/')[1], 
            'bid': quote['bid'],
            'ask': quote['ask'],
            'mid': (quote['bid'] + quote['ask'])/2,
            'volume': quote['quoteVolume'],
        };
    });
}).reduce((partial_list, a) => [...partial_list, ...a], []);



populateQuoteVolume(quote)['quoteVolume']









////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// SUBMISSION LOOP
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////



errorCount = 0;
// sleep until submitBuffer seconds before the end of the epoch to maximize chance of being in interquartile range
// Need a bit of buffer to let the other function calls return
// Should be based on when others submit their prices to make sure we're as close as possible to them
// submitBuffer = submitBufferBase + mean(submitTimes) + submitBufferStd*std(submitTimes)
// submitBuffer = submitBufferMin;              // Initial buffer for how many seconds before end of epoch we should start submission
submitBufferMin = 18;           // Minimum buffer
submitTimes = [];     // Record recent times to measure how much buffer we need
submitBufferStd = 3;            // How many stds (normal)
// var submitBufferDecay = 0.999;      // Decay factor on each loop
// var submitBufferIncrease = 1.1;     // Increase factor (multiple of std) for when we miss a submission window
submitBufferBase = 3;           // Base buffer rate.
submitBufferBurnIn = 5;        // Number of periods before adjusting submitBuffer
now = await getTime(web3);
currentEpoch = 0;
nextEpoch = currentEpoch;
diff = 0;

// Get time and current epoch params
now = await getTime(web3);
// now = (new Date()).getTime() / 1000; // susceptible to system clock drift
currentEpochCheck = (Math.floor((now - firstEpochStartTime) / submitPeriod)); // don't add 1 here like above
// check for drift
// if (currentEpoch < currentEpochCheck) {
currentEpoch = currentEpochCheck;
nextEpoch = currentEpoch + 1;
// }
start = currentEpoch * submitPeriod + firstEpochStartTime;
next = nextEpoch * submitPeriod + firstEpochStartTime;
submitWaitTime = Math.max(Math.floor(next - now) - submitBuffer, 0);  // don't wait negative time

console.log("\n\nEpoch ", currentEpoch); 
console.log(`\tEpoch start time: ${new Date(start * 1000)}`);
console.log(`\tCurrent time:     ${new Date(now * 1000)}`);
console.log(`\tEpoch end time:   ${new Date(next * 1000)}`);
console.log(`\tWaiting for ${submitWaitTime} seconds before getting price`); 
// await sleep(submitWaitTime * 1000);

startSubmitTime = new Date();
if (isTestnet) {
    // Force hardhat to mine a new block which will have an updated timestamp. if we don't hardhat timestamp will not update.
    time.advanceBlock();    
}
console.log(`Start submit for epoch ${currentEpoch}`);
console.log(`\tStart getting prices:    ${Date()}`); 
// Prepare prices and randoms
// Random generation for hashing of prices to submit in commit phase
function getRandom(epochId, asset) {
    return Math.floor(Math.random() * 1e10);
}

function submitPriceHash(price, random, address, web3) {
    return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([ "uint256", "uint256", "address" ], [price.toString(), random.toString(), address]))
}

URL0, URL1, privKey, priceSubmitterAddr;
if (isTestnet) {
    URL0 = 'http://127.0.0.1:9650/ext/bc/C/rpc';
    URL1 = 'https://songbird.towolabs.com/rpc';     // could be anything
    // Price submitter is at a fixed address, change this to the address reported by `yarn hh_node`.
    priceSubmitterAddr = '0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F';
    // Just the first from autogenerated accounts
    priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
    privKey = priceProviderPrivateKey.slice(2); // get rid of the 0x since it's added back in below    
} else {
    URL0 = process.env.RPC_NODE_URL;
    // URL1 = 'https://songbird.towolabs.com/rpc';
    URL1 = 'http://165.227.253.96:9650/ext/bc/C/rpc';
    priceSubmitterAddr = '0x1000000000000000000000000000000000000003';
    privKey = process.env.FTSO_PRIVATE_KEY ?? '';
}
priceProviderAccount = web3.eth.accounts.privateKeyToAccount(`0x${privKey}`);
randoms = symbols.map(sym => getRandom(currentEpoch, sym)); 

prices = symbols.map(sym => 10); // Just a mock here, real price should not be random
// prices = await getPrices(currentEpoch, symbols, decimals, priceSource);

console.log(`\tFinished getting prices: ${Date()}`); 

hashes = prices.map((p, i) => 
    submitPriceHash(p, randoms[i], priceProviderAccount.address, web3)
);
console.log(`\tFinished getting hashes: ${Date()}`); 
console.log("Prices:  ", prices);
console.log("Randoms: ", randoms);
// occasionally, the submission will happen too late.
// Catch those errors and continue



submission = await priceSubmitterContract.methods.submitPriceHashes(currentEpoch, ftsoIndices, hashes).send({from: priceProviderAccount.address});
console.log(`\tFinished submission:     ${Date()}`); 

exchangeEncodeABI = priceSubmitterContract.methods.submitPriceHashes(currentEpoch,ftsoIndices, hashes).encodeABI();
transactionNonce = await web3.eth.getTransactionCount(priceProviderAccount.address); // hack fix
gasPrice = await web3.eth.getGasPrice();
transactionObject = {
    chainId: 19,                                    // TODO: parameterize
    nonce: web3.utils.toHex(transactionNonce),
    gasLimit: web3.utils.toHex(469532),
    gasPrice: web3.utils.toHex(gasPrice*1.2),
    value: 0,
    to: priceSubmitterAddr,
    from: priceProviderAccount.address,
    data: exchangeEncodeABI
};
result = [];
signedTx = await web3.eth.accounts.signTransaction(transactionObject, `0x${privKey}`);
// raw transaction string may be available in .raw or 
// .rawTransaction depending on which signTransaction
// function was called
console.log(`\tPID ${process.pid} Submitting price hashes:       ${Date()}`)
// tx = web3_backup.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
console.log(`\tPID ${process.pid} First Provider timestamp:      ${Date()}`); 

tx = await web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction)

result.push(tx);
// if (web3._provider.host != web3_backup._provider.host) {
//     result.push(web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction));
//     console.log(`\tPID ${process.pid} Second Provider timestamp:     ${Date()}`); 
// }
tx.once('transactionHash',  async hash => {
    console.log("SubmitPriceHash txHash: ", hash);
})


await Promise.all(result);

submittedHash = true;