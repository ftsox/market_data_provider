"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPriceHash = void 0;
/*
    Configuration
*/
require('dotenv').config();
let sleep = require('util').promisify(setTimeout);
const axios = require('axios');
const URL0 = process.env.RPC_NODE_URL;
const privKey = process.env.FTSO_PRIVATE_KEY;
const { ethers } = require("ethers");
const URL1 = 'https://songbird.towolabs.com/rpc';
var Web3 = require('web3');
const { fromWei } = Web3.utils;
const EthTx = require("ethereumjs-tx");
const math = require("mathjs");
const nodemailer = require("nodemailer");
// @ts-ignore
const test_helpers_1 = require("@openzeppelin/test-helpers");
var isTestnet = false;
/*
    Helper Functions
*/
// TODO(MCZ): improve to get more accurate time
// Average block time: https://songbird-explorer.flare.network/
// 2.6 secs as of 2021-10-10
// So this could be off by around 2.6 seconds (plus some extra consensus time sync error)
async function getTime(web3) {
    if (isTestnet) {
        await test_helpers_1.time.advanceBlock();
    }
    const blockNum = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNum);
    const timestamp = block.timestamp;
    return timestamp;
}
function submitPriceHash(price, random, address, web3) {
    return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256", "address"], [price.toString(), random.toString(), address]));
}
exports.submitPriceHash = submitPriceHash;
// Decimals: number of decimal places in Asset USD price
// note that the actual USD price is the integer value divided by 10^Decimals
var baseCurrency = 'USD';
var baseCurrencyLower = baseCurrency.toLowerCase();
var priceSource = process.env.PRICE_SOURCE || '';
// var pricesLast = [];
var pricesLast = {}; // Dictionary of arrays indexed by assets (in case we are ever calling for different sets of assets)
// TODO: have this and child functions return a validPrice flag (boolean)
async function getPrices(epochId, assets, decimals, priceSource) {
    var assetsUid = assets.join(','); // key on asset list as unique identifier
    var nAssets = assets.length;
    if (nAssets == 0) {
        return [];
    }
    // if we haven't initialized last price, start it off with -1s
    // if (pricesLast[assetsUid].length == 0 && nAssets > 0) {
    if (!(assetsUid in pricesLast)) {
        pricesLast[assetsUid] = new Array(nAssets).fill(-1);
    }
    // Get prices
    try {
        //// Could get multiple prices simultaneously using await Promise.all(...)
        //// Ref: https://dev.to/raviojha/javascript-making-multiple-api-calls-the-right-way-2b29
        let prices;
        switch (priceSource) {
            case 'CRYPTOCOMPARE':
                prices = await getPricesCryptoCompare(assets);
                break;
            case 'COINAPI':
                prices = await getPricesCoinApi(assets);
                break;
            case 'CMC':
                prices = await getPricesCMC(assets);
                break;
            case 'COINGECKO':
                prices = await getPricesCoinGecko(assets); // no API key needed
                break;
            case 'ERROR':
                // Error case for testing
                prices = new Array(nAssets).fill(-1);
                break;
            default:
                prices = await getPricesCoinGecko(assets); // no API key needed
                break;
        }
        // var validPrice = prices.reduce((partial_sum, a) => partial_sum + a,0) > 0;
        var validPrice = prices[0] > 0;
        var pricesAdj = prices.map((p, i) => Math.round(p * 10 ** decimals[i]));
        // Check if price source function returned array of -1, signalling an error
        if (!validPrice) {
            // If invalid, return last valid pricing
            pricesAdj = pricesLast[assetsUid];
        }
        else {
            // store last prices
            pricesLast[assetsUid] = pricesAdj;
        }
        return pricesAdj;
    }
    catch (error) {
        console.log(`Get prices error:\n  ${error}`);
        // return assets.map((sym, i) => -1);   // Return 0's, TOOD: update - maybe return last prices?
        // If invalid, return last valid pricing
        return pricesLast[assetsUid];
    }
}
// CryptoCompare price API
// **Issue**: poor decimal precision
async function getPricesCryptoCompare(assets) {
    // Get prices
    var ccApiKey = process.env.CC_API_KEY;
    var ccApiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${assets.join()}&tsyms=${baseCurrency}&api_key=${ccApiKey}`;
    try {
        var pricesRaw = (await axios.get(ccApiUrl)).data;
        var prices = assets.map(sym => pricesRaw[sym][baseCurrency]);
        return prices;
    }
    catch (error) {
        console.log(`CryptoCompare API error:\n  ${error}`);
        return assets.map((sym, i) => -1);
    }
}
// CoinAPI price API
// https://docs.coinapi.io/#md-docs
// List of asset symbols: https://www.coinapi.io/integration
// Detail on how market price is calculated: https://support.coinapi.io/hc/en-us/articles/360018953291-How-are-exchange-rates-calculated-
// TODO: need to switch to websockets for live data per https://docs.coinapi.io/#md-rest-api
// **issue** updates on a > 2 min frequency from empirical testing
async function getPricesCoinApi(assets) {
    // Get prices
    const coinApiKey = process.env.COINAPI_KEY;
    const coinApiUrl = `https://rest.coinapi.io/v1/exchangerate/${baseCurrency}?filter_asset_id=${assets.join(";")};`; // need trailing semicolon, invert doesn't work
    const requestOptions = {
        method: 'GET',
        url: coinApiUrl,
        headers: {
            'X-CoinAPI-Key': coinApiKey
        }
    };
    try {
        var response = await axios.request(requestOptions);
        var bulkRates = response.data.rates; // returns in alphabetical order
        // Can do this once at beginning outside of this function since this won't change unless another asset is added halfway, in which case we need to restart anyway...
        var idxMap = new Map(bulkRates.map((rateObj, i) => [rateObj.asset_id_quote, i]));
        // confirm lengths to ensure we got all symbols
        if (bulkRates.length != assets.length) {
            throw 'CoinApi is TRASH!';
        }
        // need to invert since invert flag doesn't work in API if we are also filtering by asset
        var prices = assets.map((sym, i) => { var _a; return 1 / bulkRates[(_a = idxMap.get(sym)) !== null && _a !== void 0 ? _a : -1].rate; }); // janky hack to get typescript to not complain about return type
        return prices;
    }
    catch (error) {
        console.log(`CoinAPI API error:\n  ${error}`);
        return assets.map((sym, i) => -1);
    }
}
// CoinMarketCap price API
// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesLatest
// Has a 60 second cache per the above, so not a very good option
async function getPricesCMC(assets) {
    // Get prices
    const cmcKey = process.env.CMC_PRO_API_KEY;
    const cmcUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`;
    const requestOptions = {
        method: 'GET',
        url: cmcUrl,
        params: {
            'symbol': `${assets.join(",")}`,
            'convert': `${baseCurrency}`
        },
        headers: {
            'X-CMC_PRO_API_KEY': cmcKey
        },
    };
    try {
        var response = await axios.request(requestOptions);
        var prices = assets.map((sym, i) => response.data.data[sym].quote[baseCurrency]['price']);
        return prices;
    }
    catch (error) {
        console.log(`CoinMarketCap API error:\n  ${error}`);
        return assets.map((sym, i) => -1);
    }
}
// CoinGecko price API
// JS docs: https://github.com/miscavage/CoinGecko-API
// API docs: https://www.coingecko.com/en/api/documentation
// **Issue**: poor decimal precision
// Also has a very bad update frequency of 1 to 10 minutes per https://www.coingecko.com/en/faq
// NOTE: Needs to be updated per coin list: https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit
const cgSymbolMapping = {
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
const cgNames = Object.values(cgSymbolMapping);
async function getPricesCoinGecko(assets) {
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price`;
    const requestOptions = {
        method: 'GET',
        url: coinGeckoUrl,
        params: {
            'ids': `${cgNames.join(",")}`,
            'vs_currencies': baseCurrencyLower,
        },
        headers: {},
    };
    try {
        //// Option 1: CoinGecko js client
        // const CoinGecko = require('coingecko-api');
        // const CoinGeckoClient = new CoinGecko();
        // var response = await CoinGeckoClient.simple.price({ ids: cgNames, vs_currencies: [baseCurrencyLower], });
        //// Option 2: CoinGecko API
        var response = await axios.request(requestOptions);
        var prices = assets.map(sym => response.data[cgSymbolMapping[sym]][baseCurrencyLower]); // assumes that cgSymbolMapping is complete
        return prices;
    }
    catch (error) {
        console.log(`CoinGecko API error:\n  ${error}`);
        return assets.map((sym, i) => -1);
    }
}
// Random generation for hashing of prices to submit in commit phase
function getRandom(epochId, asset) {
    return Math.floor(Math.random() * 1e10);
}
/*
    Setup
*/
// Price submitter is at a fixed address, change this to the address reported by `yarn hh_node`.
var priceSubmitterAddr = '';
var isTestnet = false;
var priceProviderPrivateKey = '';
// special fixed address
priceSubmitterAddr = '0x1000000000000000000000000000000000000003';
// priceProviderPrivateKey = process.env.FTSO_PRIVATE_KEY ?? ''; 
isTestnet = false;
// Email for notifications
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});
/*
    Main price provider server
*/
// TODO(MCZ): add output logging for better error diagnosis
async function main() {
    const web3 = new Web3(new Web3.providers.HttpProvider(URL0));
    const web3_backup = new Web3(new Web3.providers.HttpProvider(URL1));
    // Times
    console.log(`\n\n\nStarting FTSO provider on ${isTestnet ? 'testnet' : 'mainnet'}`);
    console.log(`\tStart time: ${Date()}`);
    console.log(`Time check:`);
    console.log(`\tChain time:  ${await getTime(web3)}`);
    console.log(`\tSystem time: ${(new Date()).getTime() / 1000}`);
    const priceSubmitterAbi = require("./priceSubmitter.json");
    const MockFtsoRegistry = require("./MockFtsoRegistry.json");
    const MockVoterWhitelister = require("./MockVoterWhitelister.json");
    const MockFtso = require("./MockNpmFtso.json");
    const priceSubmitterContract = new web3.eth.Contract(JSON.parse(JSON.stringify(priceSubmitterAbi)), priceSubmitterAddr);
    const ftsoRegistry = new web3.eth.Contract(JSON.parse(JSON.stringify(MockFtsoRegistry)), await priceSubmitterContract.methods.getFtsoRegistry().call());
    const voterWhitelister = new web3.eth.Contract(JSON.parse(JSON.stringify(MockVoterWhitelister)), await priceSubmitterContract.methods.getVoterWhitelister().call());
    // Get Price Provider account based on the config
    // Just the first from autogenerated accounts
    // const priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
    // const priceProviderAccount = web3.eth.accounts.privateKeyToAccount(priceProviderPrivateKey);
    const priceProviderAccount = web3.eth.accounts.privateKeyToAccount(`0x${privKey}`);
    // Get balance of addresses
    var sgbBalance = fromWei((await web3.eth.getBalance(priceProviderAccount.address)).toString());
    console.log(`FTSO provider address: ${priceProviderAccount.address}`);
    console.log(`          SGB Balance: ${sgbBalance}`);
    console.log(`Addresses:`);
    console.log(`\tpriceSubmitter:      ${priceSubmitterContract.options.address}`); // 0x1000000000000000000000000000000000000003   
    console.log(`\tftsoRegistry:        ${ftsoRegistry.options.address}`); // 0x6D222fb4544ba230d4b90BA1BfC0A01A94E6cB23
    console.log(`\tvoterWhitelister:    ${voterWhitelister.options.address}`); // 0xa76906EfBA6dFAe155FfC4c0eb36cDF0A28ae24D
    // Get indices for specific symbols
    // const symbols = ["SGB", "XRP", "LTC", "XLM", "XDG", "ADA", "ALGO", "BCH", "DGB", "BTC"];
    // const symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];
    // Note: this can be replaced by a single call based on live contract
    const ftsoSupportedIndices_ = await ftsoRegistry.methods.getSupportedIndices().call();
    const ftsoSupportedIndices = ftsoSupportedIndices_.map(idx => (parseInt(idx)));
    const symbols = await Promise.all(ftsoSupportedIndices.map(async (idx) => await ftsoRegistry.methods.getFtsoSymbol(idx).call()));
    // console.log(`Testing pricing`);
    // console.log(`Start: pricesLast\n${JSON.stringify(pricesLast)}`);
    // // priceSource='CRYPTOCOMPARE'
    // priceSource='COINAPI'
    // console.log(`Getting prices from ${priceSource}`);
    // var pxsTest = await getPrices(1, symbols, new Array(symbols.length).fill(5), priceSource);
    // console.log(`\t${pxsTest}`);
    // console.log(`After: pricesLast\n${JSON.stringify(pricesLast)}`);
    // console.log(`Getting prices from ERROR source`);
    // var pxsTest = await getPrices(1, symbols, new Array(symbols.length).fill(5), 'ERROR');
    // console.log(`\t${pxsTest}`);
    // console.log(`After: pricesLast\n${JSON.stringify(pricesLast)}`);
    // await sleep(5 * 1000);
    // console.log(`Getting prices from ${priceSource}`);
    // var pxsTest = await getPrices(1, symbols, new Array(symbols.length).fill(5), priceSource);
    // console.log(`\t${pxsTest}`);
    // console.log(`After: pricesLast\n${JSON.stringify(pricesLast)}`);    
    // // var pxsProd = await getPrices(initialEpoch, symbols, decimals, priceSource);
    // // test update frequency
    // for (let i = 0; i < 36; i++){
    //     var pxsTest = await getPrices(1, symbols, new Array(symbols.length).fill(5), priceSource);
    //     console.log(`Loop ${i}:\t${pxsTest}`);
    // }
    // return;
    const ftsos = await Promise.all(symbols.map(async (sym) => new web3.eth.Contract(JSON.parse(JSON.stringify(MockFtso)), await ftsoRegistry.methods.getFtsoBySymbol(sym).call())));
    // Get addresses of the various FTSO contracts
    const decimals = await Promise.all(ftsos.map(async (ftso) => parseInt((await ftso.methods.ASSET_PRICE_USD_DECIMALS().call()))));
    // Get indices on which to submit
    // const ftsoIndices = await Promise.all(
    //     symbols.map(async sym => (await ftsoRegistry.getFtsoIndex(sym)).toNumber())
    // )
    const ftsoIndices = ftsoSupportedIndices;
    // Combine them for easier future use
    const currencyIndices = new Map(symbols.map((c, i) => [c, ftsoIndices[i]]));
    // Get whitelists and counts
    const ftsoWhitelists = await Promise.all(ftsoSupportedIndices.map(async (idx) => await voterWhitelister.methods.getFtsoWhitelistedPriceProviders(idx).call()));
    const ftsoWhitelistsCounts = new Map(symbols.map((c, i) => [c, ftsoWhitelists[i].length]));
    console.log(`FTSO Whitelist counts (before additional whitelisting):`);
    console.log(ftsoWhitelistsCounts);
    // Check to see if the account is not whitelisted for any FTSO
    // Saves on gas and time to not call whitelister contract if we're already whitelisted
    const includedInWhitelists = ftsoIndices.map(i => ftsoWhitelists[i].indexOf(priceProviderAccount.address) >= 0);
    const numWhitelistedFtsos = includedInWhitelists.filter(x => x).length;
    if (numWhitelistedFtsos < ftsoIndices.length) {
        console.log(`Need to whitelist...`);
        // Whitelist ourselves for EVERY ftso. This always works in mock case
        // since there is no vote power calculation, so everyone gets whitelisted.
        // In a real setting, this call can be quite expensive and can potentially fail
        // if the voter does not have enough power or provide enough gas for the transaction
        const tx = voterWhitelister.methods.requestFullVoterWhitelisting(priceProviderAccount.address).encodeABI();
        var transactionNonce = await web3.eth.getTransactionCount(priceProviderAccount.address);
        var gasPrice = await web3.eth.getGasPrice();
        const transactionObject = {
            chainId: 19,
            nonce: web3.utils.toHex(transactionNonce),
            gasLimit: web3.utils.toHex(2000000),
            gasPrice: web3.utils.toHex(gasPrice * 1.2),
            value: 0,
            to: voterWhitelister.options.address,
            from: priceProviderAccount.address,
            data: tx
        };
        const signedTx = await web3.eth.accounts.signTransaction(transactionObject, `0x${privKey}`);
        console.log(`\tWhitelisting: ${Date()}`);
        const result = await web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        // Check the whitelist for any changes
        const whitelist = await priceSubmitterContract.methods.voterWhitelistBitmap(priceProviderAccount.address).call();
        // Get whitelists and counts after getting whitelisted
        const ftsoWhitelistsPost = await Promise.all(ftsoSupportedIndices.map(async (idx) => await voterWhitelister.methods.getFtsoWhitelistedPriceProviders(idx).call()));
        const ftsoWhitelistsCountsPost = new Map(symbols.map((c, i) => [c, ftsoWhitelistsPost[i].length]));
        console.log(`FTSO Whitelist counts (after whitelisting):`);
        console.log(ftsoWhitelistsCountsPost);
        // TODO(MCZ): set desired fee percentage
        // https://songbird-explorer.flare.network/address/0xc5738334b972745067fFa666040fdeADc66Cb925/write-contract
        // Use setDataProviderFeePercentage(bps)
        // Then delegate to your FTSO provider address via 
        // https://songbird-explorer.flare.network/address/0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED/write-contract
    }
    else {
        console.log(`Already whitelisted!`);
    }
    // Get submission config
    // Assumes uniform across all FTSOs (was in original Flare code)
    const { 0: firstEpochStartTimeBN, 1: submitPeriodBN, 2: revealPeriodBN, } = (await ftsos[0].methods.getPriceEpochConfiguration().call());
    const [firstEpochStartTime, submitPeriod, revealPeriod] = [firstEpochStartTimeBN, submitPeriodBN, revealPeriodBN].map(x => parseInt(x));
    console.log(`FTSO parameters:`);
    console.log(`\tfirstEpochStartTime: ${new Date(firstEpochStartTime * 1000)}`);
    console.log(`\tsubmitPeriod (secs): ${submitPeriod}`);
    console.log(`\trevealPeriod (secs): ${revealPeriod}`);
    const checkPrices = true;
    if (checkPrices) {
        // Test: get prices for symbols
        var initialEpoch = Math.floor(((await getTime(web3)) - firstEpochStartTime) / submitPeriod);
        // var pxsProd = await getPrices(1, symbols, new Array(symbols.length).fill(5));
        var pxsProd = await getPrices(initialEpoch, symbols, decimals, priceSource);
        var pxsCC = await getPricesCryptoCompare(symbols);
        var pxsCApi = await getPricesCoinApi(symbols);
        var pxsCMC = await getPricesCMC(symbols);
        var pxsCG = await getPricesCoinGecko(symbols);
        for (var i in ftsoSupportedIndices) {
            console.log(`${symbols[i]}:`);
            console.log(`\tCryptoCompare: ${pxsCC[i]}`);
            console.log(`\tCoinAPI:       ${pxsCApi[i]}`);
            console.log(`\tCoinMarketCap: ${pxsCMC[i]}`);
            console.log(`\tCoinGecko:     ${pxsCG[i]}`);
            console.log(`\tProduction Px: ${pxsProd[i]}`);
        }
        console.log(`Price Source: ${priceSource}`);
    }
    // We submitPriceHashes with the current EpochID, 
    // then once current Epoch is passed, within 90 seconds, we call revealPrices with EpochID 
    // (the same Epoch as submitPriceHashes and it should be currentEpoch - 1)
    // Since we only get rewarded if we're in the middle 50%, we need to make sure we submit at a good time
    // Based on txs from providers (see list https://flaremetrics.io/ftso/providers), most submit within last 15 seconds of an epoch
    // Reference functions in FtsoEpoch library:
    //      _epochSubmitStartTime
    //      _epochSubmitEndTime
    //      _epochRevealEndTime;
    var errorCount = 0;
    // sleep until submitBuffer seconds before the end of the epoch to maximize chance of being in interquartile range
    // Need a bit of buffer to let the other function calls return
    // Should be based on when others submit their prices to make sure we're as close as possible to them
    // submitBuffer = submitBufferBase + mean(submitTimes) + submitBufferStd*std(submitTimes)
    var submitBuffer = 15; // Initial buffer for how many seconds before end of epoch we should start submission
    var submitTimes = []; // Record recent times to measure how much buffer we need
    var submitBufferStd = 3; // How many stds (normal)
    // var submitBufferDecay = 0.999;      // Decay factor on each loop
    // var submitBufferIncrease = 1.1;     // Increase factor (multiple of std) for when we miss a submission window
    var submitBufferBase = 3; // Base buffer rate.
    var submitBufferBurnIn = 2; // Number of periods before adjusting submitBuffer
    let now = await getTime(web3);
    let currentEpoch = 0;
    let nextEpoch = currentEpoch;
    let diff = 0;
    while (true) {
        // Get time and current epoch params
        now = await getTime(web3);
        // now = (new Date()).getTime() / 1000; // susceptible to system clock drift
        const currentEpochCheck = (Math.floor((now - firstEpochStartTime) / submitPeriod)); // don't add 1 here like above
        // check for drift
        if (currentEpoch < currentEpochCheck) {
            currentEpoch = currentEpochCheck;
            nextEpoch = currentEpoch + 1;
        }
        const start = currentEpoch * submitPeriod + firstEpochStartTime;
        let next = nextEpoch * submitPeriod + firstEpochStartTime;
        const submitWaitTime = Math.max(Math.floor(next - now) - submitBuffer, 0); // don't wait negative time
        console.log("\n\nEpoch ", currentEpoch);
        console.log(`\tEpoch start time: ${new Date(start * 1000)}`);
        console.log(`\tCurrent time:     ${new Date(now * 1000)}`);
        console.log(`\tEpoch end time:   ${new Date(next * 1000)}`);
        console.log(`\tWaiting for ${submitWaitTime} seconds before getting price`);
        await sleep(submitWaitTime * 1000);
        var startSubmitTime = new Date();
        if (isTestnet) {
            // Force hardhat to mine a new block which will have an updated timestamp. if we don't hardhat timestamp will not update.
            test_helpers_1.time.advanceBlock();
        }
        console.log(`Start submit for epoch ${currentEpoch}`);
        console.log(`\tStart getting prices:    ${Date()}`);
        // Prepare prices and randoms
        const randoms = symbols.map(sym => getRandom(currentEpoch, sym));
        // const prices = symbols.map(sym => getPrice(currentEpoch, sym)); // Just a mock here, real price should not be random
        const prices = await getPrices(currentEpoch, symbols, decimals, priceSource);
        console.log(`\tFinished getting prices: ${Date()}`);
        const hashes = prices.map((p, i) => submitPriceHash(p, randoms[i], priceProviderAccount.address, web3));
        console.log(`\tFinished getting hashes: ${Date()}`);
        console.log("Prices:  ", prices);
        console.log("Randoms: ", randoms);
        // occasionally, the submission will happen too late.
        // Catch those errors and continue
        var submittedHash;
        try {
            const exchangeEncodeABI = priceSubmitterContract.methods.submitPriceHashes(currentEpoch, ftsoIndices, hashes).encodeABI();
            var transactionNonce = await web3.eth.getTransactionCount(priceProviderAccount.address);
            var gasPrice = await web3.eth.getGasPrice();
            const transactionObject = {
                chainId: 19,
                nonce: web3.utils.toHex(transactionNonce),
                gasLimit: web3.utils.toHex(469532),
                gasPrice: web3.utils.toHex(gasPrice * 1.2),
                value: 0,
                to: priceSubmitterAddr,
                from: priceProviderAccount.address,
                data: exchangeEncodeABI
            };
            const signPromise = web3.eth.accounts.signTransaction(transactionObject, `0x${privKey}`);
            signPromise.then((signedTx) => {
                // raw transaction string may be available in .raw or 
                // .rawTransaction depending on which signTransaction
                // function was called
                console.log(`\tSubmitting price hashes:       ${Date()}`);
                const tx = web3_backup.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                console.log(`\tFirst Provider timestamp:      ${Date()}`);
                const result = [];
                result.push(web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction));
                console.log(`\tSecond Provider timestamp:     ${Date()}`);
                tx.once('transactionHash', async (hash) => {
                    console.log("SubmitPriceHash txHash: ", hash);
                });
                Promise.all(result).then((values) => {
                });
            });
            submittedHash = true;
        }
        catch (error) {
            // TODO(MCZ): add notifications
            submittedHash = false;
            console.log(`\tError submitting price hashes::     ${Date()}`);
            console.log(error);
            errorCount += 1;
            // if this is due to late submission, then we need to increase our buffer
            // TODO(MCZ): change to analyzing the timestamp of the failed transaction - not easy to do with Hardhat errors
            // Sometimes this will be submitted in time but not confirmed in time, in which case we get a tx id
            // Otherwise, just an error saying:
            //      Uncaught Error: Returned error: execution reverted: Wrong epoch id
            // Ref: https://gitlab.com/flarenetwork/flare-smart-contracts/-/blob/master/contracts/ftso/implementation/Ftso.sol#L634
            // const errorTime = await getTime();  // need to use blockchain time, or else the below condition may not fire
            // if (errorTime >= next) {
            //     submitBuffer = Math.min(submitBuffer + 1, submitPeriod);    // cap buffer at submitPeriod
            //     console.log(`Increasing submit buffer to ${submitBuffer} seconds`);
            // }
            // TODO(MCZ): also account for other network/provider issues, e.g. RPC node goes down
            // Can use Towo as backup node
            // https://hardhat.org/plugins/hardhat-change-network.html
            // Send error message
            // send mail with defined transport object
            try {
                let info = await transporter.sendMail({
                    from: '"FTSO Monitor" <cv40067@gmail.com>',
                    to: "cv40067@gmail.com, mczochowski@gmail.com",
                    subject: `FTSO error for ${priceProviderAccount.address}`,
                    text: `Price hash submission error for ${priceProviderAccount.address}`,
                    html: `Price hash submission error for <b>${priceProviderAccount.address}</b>`, // html body
                });
            }
            catch (error) {
                console.log(`\tError Sending mail:     ${Date()}`);
                console.log(error);
            }
        }
        var endSubmitTime = new Date();
        var submitTime = (endSubmitTime.getTime() - startSubmitTime.getTime()) / 1000; // in seconds
        var nSubmitTimes = submitTimes.push(submitTime);
        // only store latest 1000 times
        if (nSubmitTimes > 1000) {
            submitTimes.shift();
        }
        // modify submit buffer based on recent observed times
        var submitMean = math.mean(submitTimes);
        var submitStd = math.std(submitTimes);
        console.log(`\nSubmit Buffer update:`);
        console.log(`   Prev: ${submitBuffer}`);
        // require a minimum sample size for updates
        if (nSubmitTimes > submitBufferBurnIn) {
            // new submitBuffer in seconds
            submitBuffer = submitBufferBase + submitMean + submitBufferStd * submitStd;
            if (submitBuffer < 15)
                submitBuffer = 15;
        }
        console.log(`   New:  ${submitBuffer}`);
        console.log(`   Mean: ${submitMean}`);
        console.log(`   Std:  ${submitStd}`);
        console.log(`   Last: ${submitTime}`);
        // advance to start of reveal period
        now = await getTime(web3);
        next = nextEpoch * submitPeriod + firstEpochStartTime;
        diff = Math.max(Math.floor(next - now), 0); // don't sleep for negative time
        console.log(`\nWaiting for ${diff} seconds until reveal`);
        await sleep(diff * 1000);
        // Reveal prices
        console.log(`\n\tWoke at:                 ${Date()}`);
        if (isTestnet) {
            test_helpers_1.time.advanceBlock();
        }
        // Only reveal if we successfully submitted
        if (submittedHash) {
            console.log(`\tSubmitting price reveal: ${Date()}`);
            try {
                const exchangeEncodeABI = priceSubmitterContract.methods.revealPrices(currentEpoch, ftsoIndices, prices, randoms).encodeABI();
                var gasLimit = await priceSubmitterContract.methods.revealPrices(currentEpoch, ftsoIndices, prices, randoms).estimateGas({ from: priceProviderAccount.address });
                var transactionNonce = await web3.eth.getTransactionCount(priceProviderAccount.address);
                var gasPrice = await web3.eth.getGasPrice();
                const transactionObject = {
                    chainId: 19,
                    nonce: web3.utils.toHex(transactionNonce),
                    gasLimit: web3.utils.toHex(gasLimit),
                    gasPrice: web3.utils.toHex(gasPrice),
                    value: 0,
                    to: priceSubmitterAddr,
                    from: priceProviderAccount.address,
                    data: exchangeEncodeABI
                };
                const signPromise = web3.eth.accounts.signTransaction(transactionObject, `0x${privKey}`);
                signPromise.then((signedTx) => {
                    // raw transaction string may be available in .raw or 
                    // .rawTransaction depending on which signTransaction
                    // function was called
                    const tx = web3_backup.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                    const result = [];
                    result.push(web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction));
                    tx.once('transactionHash', async (hash) => {
                        console.log("txHash: ", hash);
                    });
                    Promise.all(result).then((values) => {
                    });
                });
                console.log(`\tFinished reveal:         ${Date()}`);
                console.log("Revealed prices for epoch ", currentEpoch);
            }
            catch (error) {
                console.log('Error submitting price reveals');
                console.log(error);
                errorCount += 1;
                try { // Send error message
                    let info = await transporter.sendMail({
                        from: `"FTSO Monitor" <${process.env.GMAIL_USER}@gmail.com>`,
                        to: `${process.env.ERROR_MAIL_LIST}`,
                        subject: `FTSO error for ${priceProviderAccount.address}`,
                        text: `Price reveal submission error for ${priceProviderAccount.address}`,
                        html: `Price reveal submission error for <b>${priceProviderAccount.address}</b>`, // html body
                    });
                }
                catch (error) {
                    console.log(`\tError Sending mail:     ${Date()}`);
                    console.log(error);
                }
            }
        }
        // start loop again, the next price submission epoch has already started since we're in reveal phase
        // increment epoch
        currentEpoch = nextEpoch;
        nextEpoch = nextEpoch + 1;
        // get remaining balance
        sgbBalance = fromWei((await web3.eth.getBalance(priceProviderAccount.address)).toString());
        console.log(`SGB remaining: ${sgbBalance}`);
        console.log(`Total errors now ${errorCount}`);
    }
}
main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=prod-price-provider.js.map