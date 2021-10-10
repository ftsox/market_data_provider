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

fromWei(new BN('0x488169aacb245a00', 16));
new BN(parseInt("0x488169aacb245a00", 16))


/* 
    Contract interactions
*/

// Start console
// yarn hardhat console --network localhost
// yarn hardhat console --network songbird

// Get list of accounts
accounts = await ethers.getSigners();

// Get balance of addresses
(await ethers.provider.getBalance(accounts[0].address)).toString()
// (await ethers.provider.getBalance('0x46c283c599a5dC4CE614092eC31F354e89b4706F')).toString()
fromWei((await ethers.provider.getBalance('0x46c283c599a5dC4CE614092eC31F354e89b4706F')).toString())


// Connect to priceSubmitter
MockPriceSubmitter = artifacts.require("MockPriceSubmitter");
MockFtsoRegistry = artifacts.require("MockFtsoRegistry");
MockVoterWhitelister = artifacts.require("MockVoterWhitelister");
MockFtso = artifacts.require("MockNpmFtso");

// priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
// priceProviderAccount = web3.eth.accounts.privateKeyToAccount(priceProviderPrivateKey);
// priceSubmitter = await MockPriceSubmitter.at("0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F");
priceSubmitter = await MockPriceSubmitter.at("0x1000000000000000000000000000000000000003");
ftsoRegistry = await MockFtsoRegistry.at(await priceSubmitter.getFtsoRegistry());
voterWhitelister = await MockVoterWhitelister.at(await priceSubmitter.getVoterWhitelister());

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




// Get prices
baseCurrency = 'USD';
ccApiKey = process.env.CC_API_KEY;
ccApiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join()}&tsyms=${baseCurrency}&api_key=${ccApiKey}`;

// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
const axios = require('axios');
pricesRaw = (response = await axios.get(ccApiUrl)).data
prices = symbols.map(sym => pricesRaw[sym][baseCurrency])

