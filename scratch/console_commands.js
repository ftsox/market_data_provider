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
fromWei((await ethers.provider.getBalance(accounts[0].address)).toString())
// (await ethers.provider.getBalance('0x46c283c599a5dC4CE614092eC31F354e89b4706F')).toString()
// fromWei((await ethers.provider.getBalance('0x46c283c599a5dC4CE614092eC31F354e89b4706F')).toString())


// Connect to priceSubmitter
MockPriceSubmitter = artifacts.require("MockPriceSubmitter");
MockFtsoRegistry = artifacts.require("MockFtsoRegistry");
MockVoterWhitelister = artifacts.require("MockVoterWhitelister");
MockFtso = artifacts.require("MockNpmFtso");
FtsoManager = artifacts.require("IFtsoManager");
FtsoRewardManager = artifacts.require("IFtsoRewardManager");

// priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
// priceProviderAccount = web3.eth.accounts.privateKeyToAccount(priceProviderPrivateKey);
// priceSubmitter = await MockPriceSubmitter.at("0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F");
priceSubmitter = await MockPriceSubmitter.at("0x1000000000000000000000000000000000000003");
ftsoRegistry = await MockFtsoRegistry.at(await priceSubmitter.getFtsoRegistry());
voterWhitelister = await MockVoterWhitelister.at(await priceSubmitter.getVoterWhitelister());
ftsoManager = await FtsoManager.at(await priceSubmitter.getFtsoManager());
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



//// Get data provider fee percentages
currentProviderFees = await Promise.all( ftsoWhitelists[0].map( async address => (await ftsoRewardManager.getDataProviderCurrentFeePercentage(address)).toNumber() ) );
console.log(`Number of rows: ${df.size / df.columns.length}`);
futureProviderFeesRaw = await Promise.all( ftsoWhitelists[0].map( async address => await ftsoRewardManager.getDataProviderScheduledFeePercentageChanges(address) ) );
futureProviderFees = []
for (let i=0; i < ftsoWhitelists[0].length; i++) {
    fpData = futureProviderFeesRaw[i]._feePercentageBIPS;
    nChangesPending = fpData.length;
    if (nChangesPending > 0) {
        // latest one should be the most recent update
        futureFee = fpData[nChangesPending-1].toNumber();
        futureProviderFees.push(futureFee);
    } else {
        futureProviderFees.push(currentProviderFees[i]);
    }
}
const dfd = require('danfojs-node');
df = new dfd.DataFrame({'Addresses': ftsoWhitelists[0]});
df.addColumn({'column': 'CurrentFee', 'values': currentProviderFees, inplace: true});
df.addColumn({'column': 'FutureFee', 'values': futureProviderFees, inplace: true});
df.addColumn({'column': 'FeeDiff', 'values': df['FutureFee'].sub(df['CurrentFee']), inplace: true});
console.log(df.to_csv('providers.csv'))
// df['FeeDiff'].mean()
// df['FeeDiff'].std()
// x = new dfd.Series(ftsoWhitelists[0])




// Get prices
baseCurrency = 'USD';
ccApiKey = process.env.CC_API_KEY;
ccApiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join()}&tsyms=${baseCurrency}&api_key=${ccApiKey}`;

// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
const axios = require('axios');
pricesRaw = (response = await axios.get(ccApiUrl)).data
prices = symbols.map(sym => pricesRaw[sym][baseCurrency])




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


//// Transaction submission scratch work
// now = await getTime();
// now = (new Date()).getTime() / 1000; 
async function getTime() {
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const timestamp = block.timestamp;
    return timestamp
}

priceProviderAccount = (await ethers.getSigners())[0];

now = await getTime();
startingEpoch = Math.floor((now - firstEpochStartTime) / submitPeriod) + 1; // add 1 since we are waiting for next epoch
next = startingEpoch * submitPeriod + firstEpochStartTime;  // works since startingEpoch is actually next epoch here
diff = Math.floor(next - now) + 1;
currentEpoch = startingEpoch;
nextEpoch = currentEpoch + 1;
submitBuffer = 0;  

// Get time and current epoch params
now = await getTime();
currentEpoch = Math.floor((now - firstEpochStartTime) / submitPeriod);
nextEpoch = currentEpoch + 1;
start = currentEpoch * submitPeriod + firstEpochStartTime;
next = nextEpoch * submitPeriod + firstEpochStartTime;

console.log("\n\nEpoch ", currentEpoch); 
console.log(`\tEpoch start time: ${new Date(start * 1000)}`);
console.log(`\tCurrent time:     ${new Date(now * 1000)}`);
console.log(`\tEpoch end time:   ${new Date(next * 1000)}`);

console.log(`Start submit for epoch ${currentEpoch}`);
console.log(`\tStart getting prices:    ${Date()}`); 

function submitPriceHash(price, random, address,) { return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([ "uint256", "uint256", "address" ], [price.toString(), random.toString(), address])) }
function getPrice(epochId, asset) { return Math.floor(Math.random() * 200 + 10000); }
function getRandom(epochId, asset) { return Math.floor(Math.random() * 1000); }
prices = symbols.map(sym => getPrice(currentEpoch, sym));
randoms = symbols.map(sym => getRandom(currentEpoch, sym)); 
hashes = prices.map((p, i) => 
    submitPriceHash(p, randoms[i], priceProviderAccount.address)
);

// To get an error, change currentEpoch to an earlier time
submission = await priceSubmitter.submitPriceHashes(currentEpoch, ftsoIndices, hashes, {from: priceProviderAccount.address} );
// expectEvent(submission, "PriceHashesSubmitted", { ftsos: ftsoAddresses, 
//     epochId: currentEpoch.toString(), hashes: hashes});

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


// Time getTime() command
nRuns = 100;
startTime = new Date();
for (let i = 0; i < nRuns; i++) { x = await getTime() };
endTime = new Date();
totalTime = (endTime-startTime)/1000;
avgTime = totalTime/nRuns;
console.log(`Average time per run: ${avgTime} seconds`)
// 1.33805 seconds