/*
    Configuration
*/
let sleep = require('util').promisify(setTimeout);
const axios = require('axios');
// Hardhat
const { ethers } = require('hardhat');
const util = require('util')
const hre = require("hardhat");
const URL0 = process.env.RPC_NODE_URL
const privKey = process.env.FTSO_PRIVATE_KEY 
const privateKey = new (Buffer.from as any)(privKey, "hex") ;
const URL1 = 'https://songbird.towolabs.com/rpc'
const { toWei } = web3.utils;
const { fromWei } = web3.utils;
var Web3 = require('web3');
const EthTx = require("ethereumjs-tx");
const { BN, bufferToHex, privateToAddress, toBuffer } = require("ethereumjs-util");
const math = require("mathjs");
const nodemailer = require("nodemailer");
// @ts-ignore
import { time, expectEvent } from '@openzeppelin/test-helpers';
import { toBN } from '../../test/utils/test-helpers';
import { 
    IFtsoRegistryInstance, 
    IVoterWhitelisterInstance,
    IPriceSubmitterInstance,
    IFtsoInstance,
} from "../../typechain-truffle";


/*
    Helper Functions
*/

// TODO(MCZ): improve to get more accurate time
// Average block time: https://songbird-explorer.flare.network/
// 2.6 secs as of 2021-10-10
// So this could be off by around 2.6 seconds (plus some extra consensus time sync error)
async function getTime(): Promise<number>{
    if (isTestnet) {
        await time.advanceBlock();
    }
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const timestamp = block.timestamp;
    return timestamp
}

export function submitPriceHash(price: number, random: number, address: string,): string {
    return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([ "uint256", "uint256", "address" ], [price.toString(), random.toString(), address]))
}

// // TODO: Implement this to read prices from interesting places
// function getPrice(epochId: number, asset: string): number{
//     return Math.floor(Math.random() * 200 + 10000);
// }

// TODO: abstract out API call to a different function to easily switch between APIs
// Decimals: number of decimal places in Asset USD price
// note that the actual USD price is the integer value divided by 10^Decimals
async function getPrices(epochId: number, assets: string[], decimals: number[]): Promise<number[]>{
    // return Math.floor(Math.random() * 200 + 10000);

    // Get prices
    var baseCurrency = 'USD';
    var ccApiKey = process.env.CC_API_KEY;
    var ccApiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${assets.join()}&tsyms=${baseCurrency}&api_key=${ccApiKey}`;
    // console.log(ccApiUrl);

    try {
        var pricesRaw = (await axios.get(ccApiUrl)).data;
        var prices = assets.map(sym => pricesRaw[sym][baseCurrency])
        var pricesAdj = prices.map((p,i) => Math.round(p * 10**decimals[i]))
        return pricesAdj;
    } catch(error){
        console.log(`Price API error:\n  ${error}`);
        return assets.map((sym, i) => 0);   // Return 0's, TOOD: update
    }
}

// TODO: Maybe change random generation
function getRandom(epochId: number, asset: string): number{
    // return Math.floor(Math.random() * 1000);
    return Math.floor(Math.random() * 1e10);
}


/*
    Setup
*/

const MockPriceSubmitter = artifacts.require("MockPriceSubmitter");
const MockFtsoRegistry = artifacts.require("MockFtsoRegistry");
const MockVoterWhitelister = artifacts.require("MockVoterWhitelister");
const MockFtso = artifacts.require("MockNpmFtso");

// Price submitter is at a fixed address, change this to the address reported by `yarn hh_node`.
var priceSubmitterAddr = '';
var isTestnet = false;
var priceProviderPrivateKey = '';
if (hre.network.name == 'songbird') {
    // special fixed address
    priceSubmitterAddr = '0x1000000000000000000000000000000000000003';
    // priceProviderPrivateKey = process.env.FTSO_PRIVATE_KEY ?? ''; 
    isTestnet = false;
}
else {
    // get from yarn hh_node
    // TODO(MCZ): upgrade to https://hardhat.org/plugins/hardhat-deploy.html
    priceSubmitterAddr = '0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F';
    // priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122"; 
    isTestnet = true;
}


// Email for notifications
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASSWORD, 
    },
});




function err_cb_submit_mute(err:any, ret:any) {
    if (err) {
        console.log("An error occurred", err)
        return
    }
}


function err_cb_reveal_mute(err:any, ret:any) {
    if (err) {
        console.log("An error occurred", err)
        return
    }
}
/*
    Main price provider server
*/

// TODO(MCZ): add output logging for better error diagnosis
async function main() {
    // Times
    console.log(`\n\n\nStarting FTSO provider on ${isTestnet ? 'testnet' : 'mainnet'}`);
    console.log(`\tStart time: ${Date()}`); 
    console.log(`Time check:`);
    console.log(`\tChain time:  ${await getTime()}`);
    console.log(`\tSystem time: ${(new Date()).getTime() / 1000}`);
    const priceSUbmitterAbi = require("./priceSubmitter.json");

    const web3 = new Web3(
        new Web3.providers.HttpProvider(URL0)
    );
    const web3_backup = new Web3(
        new Web3.providers.HttpProvider(URL1)
    );
    const priceSUbmitterContract = new web3.eth.Contract(JSON.parse(JSON.stringify(priceSUbmitterAbi)), priceSubmitterAddr);

    
    // Get Price Provider account based on the config
    // Just the first from autogenerated accounts
    // const priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
    // const priceProviderAccount = web3.eth.accounts.privateKeyToAccount(priceProviderPrivateKey);
    const accounts = await ethers.getSigners();
    const priceProviderAccount = accounts[0];

    // Get balance of addresses
    var sgbBalance = fromWei((await ethers.provider.getBalance(priceProviderAccount.address)).toString());
    console.log(`FTSO provider address: ${priceProviderAccount.address}`);
    console.log(`          SGB Balance: ${sgbBalance}`);

    // Initialize data
    const priceSubmitter: IPriceSubmitterInstance = await MockPriceSubmitter.at(priceSubmitterAddr);
    const ftsoRegistry: IFtsoRegistryInstance = await MockFtsoRegistry.at(await priceSubmitter.getFtsoRegistry());
    const voterWhitelister: IVoterWhitelisterInstance = await MockVoterWhitelister.at(await priceSubmitter.getVoterWhitelister());

    console.log(`Addresses:`)
    console.log(`\tpriceSubmitter:      ${priceSubmitter.address}`)     // 0x1000000000000000000000000000000000000003   
    console.log(`\tftsoRegistry:        ${ftsoRegistry.address}`)       // 0x6D222fb4544ba230d4b90BA1BfC0A01A94E6cB23
    console.log(`\tvoterWhitelister:    ${voterWhitelister.address}`)   // 0xa76906EfBA6dFAe155FfC4c0eb36cDF0A28ae24D

    // Get indices for specific symbols
    // const symbols = ["SGB", "XRP", "LTC", "XLM", "XDG", "ADA", "ALGO", "BCH", "DGB", "BTC"];
    // const symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];
    // Note: this can be replaced by a single call based on live contract
    const ftsoSupportedIndices = (await ftsoRegistry.getSupportedIndices()).map(idx => (idx.toNumber()));
    const symbols = await Promise.all(
        ftsoSupportedIndices.map(async idx => await ftsoRegistry.getFtsoSymbol(idx))
    );

    // Test: get prices for symbols
    // const prices = await getPrices(1, symbols);
    // console.log("Symbols: ", symbols);
    // console.log("Prices: ", prices);

    const ftsos = await Promise.all(
        symbols.map(async sym => await MockFtso.at(await ftsoRegistry.getFtsoBySymbol(sym)))
    ) as IFtsoInstance[];

    // Get addresses of the various FTSO contracts
    // const ftsoAddresses = await Promise.all(
    //     symbols.map(async sym => await ftsoRegistry.getFtsoBySymbol(sym))
    // );
    const ftsoAddresses = await ftsoRegistry.getAllFtsos();
    // Get number of decimals per asset
    // Should be 5 always but good to confirm
    // const decimals = await Promise.all(ftsoAddresses.map(async (addr, i) => (await (await MockFtso.at(addr)).ASSET_PRICE_USD_DECIMALS()).toNumber()));
    const decimals = await Promise.all(
        ftsos.map(async ftso => (await ftso.ASSET_PRICE_USD_DECIMALS()).toNumber())
    );

    // Get indices on which to submit
    // const ftsoIndices = await Promise.all(
    //     symbols.map(async sym => (await ftsoRegistry.getFtsoIndex(sym)).toNumber())
    // )
    const ftsoIndices = ftsoSupportedIndices;

    // Combine them for easier future use
    const currencyIndices = new Map(
        symbols.map((c, i) => [c, ftsoIndices[i]]) 
    );

    // Get whitelists and counts
    const ftsoWhitelists = await Promise.all(
        ftsoSupportedIndices.map(async idx => await voterWhitelister.getFtsoWhitelistedPriceProviders(idx))
    );
    const ftsoWhitelistsCounts = new Map( 
        symbols.map((c, i) => [c, ftsoWhitelists[i].length])
    );
    console.log(`FTSO Whitelist counts (before additional whitelisting):`);
    console.log(ftsoWhitelistsCounts);

    // Check to see if the account is not whitelisted for any FTSO
    // Saves on gas and time to not call whitelister contract if we're already whitelisted
    const includedInWhitelists = ftsoIndices.map(i => ftsoWhitelists[i].indexOf(priceProviderAccount.address) >= 0);
    const numWhitelistedFtsos = includedInWhitelists.filter(x => x).length;
    if (numWhitelistedFtsos < ftsoIndices.length) {
        console.log(`Need to whitelist...`)
        // Whitelist ourselves for EVERY ftso. This always works in mock case
        // since there is no vote power calculation, so everyone gets whitelisted.
        // In a real setting, this call can be quite expensive and can potentially fail
        // if the voter does not have enough power or provide enough gas for the transaction
        const tx = await voterWhitelister.requestFullVoterWhitelisting(priceProviderAccount.address);
        // Check the whitelist for any changes
        const whitelist = await priceSubmitter.voterWhitelistBitmap(priceProviderAccount.address);

        // Get whitelists and counts after getting whitelisted
        const ftsoWhitelistsPost = await Promise.all(
            ftsoSupportedIndices.map(async idx => await voterWhitelister.getFtsoWhitelistedPriceProviders(idx))
        );
        const ftsoWhitelistsCountsPost = new Map( 
            symbols.map((c, i) => [c, ftsoWhitelistsPost[i].length])
        );
        console.log(`FTSO Whitelist counts (after whitelisting):`);
        console.log(ftsoWhitelistsCountsPost);
        // TODO(MCZ): set desired fee percentage
        // https://songbird-explorer.flare.network/address/0xc5738334b972745067fFa666040fdeADc66Cb925/write-contract
        // Use setDataProviderFeePercentage(bps)
        // Then delegate to your FTSO provider address via 
        // https://songbird-explorer.flare.network/address/0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED/write-contract
    } else {
        console.log(`Already whitelisted!`)
    }

    // Get submission config
    // Assumes uniform across all FTSOs (was in original Flare code)
    const {
        0: firstEpochStartTimeBN,
        1: submitPeriodBN,
        2: revealPeriodBN,
    } = (await ftsos[0].getPriceEpochConfiguration());

    const [firstEpochStartTime, submitPeriod, revealPeriod] = 
        [firstEpochStartTimeBN, submitPeriodBN, revealPeriodBN].map(x => x.toNumber());

    console.log(`FTSO parameters:`);
    console.log(`\tfirstEpochStartTime: ${new Date(firstEpochStartTime * 1000)}`);
    console.log(`\tsubmitPeriod (secs): ${submitPeriod}`);
    console.log(`\trevealPeriod (secs): ${revealPeriod}`);
    
    // Sync time to start on next full transaction id
    // For a real setting, make sure that computer time is synced with a reliable time provider
    // Take blockchain time
    let now = await getTime();
    var startingEpoch = Math.floor((now - firstEpochStartTime) / submitPeriod) + 1; // add 1 since we are waiting for next epoch
    // const contractEpoch = (await ftsos[0].getCurrentEpochId()).toString()
    // console.log(`Calculated Epoch: ${startingEpoch}`);
    // console.log(`Contract Epoch:   ${contractEpoch}`);
    let next = startingEpoch * submitPeriod + firstEpochStartTime;  // works since startingEpoch is actually next epoch here
    let diff = Math.floor(next - now) + 1;
    console.log(`Waiting for ${diff} seconds until first start`); 
    await sleep(diff * 1000);
    let currentEpoch = startingEpoch;
    let nextEpoch = currentEpoch + 1;

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
    var submitBuffer = 15;              // Initial buffer for how many seconds before end of epoch we should start submission
    var submitTimes: Number[] = [];     // Record recent times to measure how much buffer we need
    var submitBufferStd = 3;            // How many stds (normal)
    // var submitBufferDecay = 0.999;      // Decay factor on each loop
    // var submitBufferIncrease = 1.1;     // Increase factor (multiple of std) for when we miss a submission window
    var submitBufferBase = 3;           // Base buffer rate.
    var submitBufferBurnIn = 2;        // Number of periods before adjusting submitBuffer
    while (true) {

        // Get time and current epoch params
        now = await getTime();
        // now = (new Date()).getTime() / 1000; // susceptible to system clock drift
        const currentEpochCheck = (Math.floor((now - firstEpochStartTime) / submitPeriod)); // don't add 1 here like above
        // check for drift
        if (currentEpoch < currentEpochCheck) {
            currentEpoch = currentEpochCheck;
            nextEpoch = currentEpoch + 1;
        }
        const start = currentEpoch * submitPeriod + firstEpochStartTime;
        next = nextEpoch * submitPeriod + firstEpochStartTime;
        const submitWaitTime = Math.max(Math.floor(next - now) - submitBuffer, 0);  // don't wait negative time

        console.log("\n\nEpoch ", currentEpoch); 
        console.log(`\tEpoch start time: ${new Date(start * 1000)}`);
        console.log(`\tCurrent time:     ${new Date(now * 1000)}`);
        console.log(`\tEpoch end time:   ${new Date(next * 1000)}`);
        console.log(`\tWaiting for ${submitWaitTime} seconds before getting price`); 
        await sleep(submitWaitTime * 1000);

        var startSubmitTime: Date = new Date();
        if (isTestnet) {
            // Force hardhat to mine a new block which will have an updated timestamp. if we don't hardhat timestamp will not update.
            time.advanceBlock();    
        }
        console.log(`Start submit for epoch ${currentEpoch}`);
        console.log(`\tStart getting prices:    ${Date()}`); 
        // Prepare prices and randoms
        const randoms = symbols.map(sym => getRandom(currentEpoch, sym)); 

        // const prices = symbols.map(sym => getPrice(currentEpoch, sym)); // Just a mock here, real price should not be random
        const prices = await getPrices(currentEpoch, symbols, decimals);

        console.log(`\tFinished getting prices: ${Date()}`); 

        const hashes = prices.map((p, i) => 
            submitPriceHash(p, randoms[i], priceProviderAccount.address)
        );
        console.log(`\tFinished getting hashes: ${Date()}`); 
        console.log("Prices:  ", prices);
        console.log("Randoms: ", randoms);
        // occasionally, the submission will happen too late.
        // Catch those errors and continue
        var submittedHash: boolean;
        
        try {

            const exchangeEncodeABI = priceSUbmitterContract.methods.submitPriceHashes(currentEpoch,ftsoIndices, hashes).encodeABI();
            var transactionNonce = await web3.eth.getTransactionCount(priceProviderAccount.address);
            var gasPrice = await web3.eth.getGasPrice();
            const transactionObject = {
                chainId: 19,
                nonce: web3.utils.toHex(transactionNonce),
                gasLimit: web3.utils.toHex(469532),
                gasPrice: web3.utils.toHex(gasPrice*1.2),
                value: 0,
                to: priceSubmitterAddr,
                from: priceProviderAccount.address,
                data: exchangeEncodeABI
            };
            
            //console.log(util.inspect(transactionObject, false, null, true /* enable colors */))
            let transaction = new EthTx(transactionObject);
            transaction.sign(privateKey); // sign a transaction
            const serializedEthTx = transaction.serialize().toString("hex"); // serialize the transaction
            console.log(`\tSubmitting price hashes: ${Date()}`)
            web3_backup.eth.sendSignedTransaction(`0x${serializedEthTx}`, err_cb_submit_mute); 
            console.log(`\tFirst Provider Finished submission:     ${Date()}`); 
            await web3.eth.sendSignedTransaction(`0x${serializedEthTx}`).on('transactionHash',(hash) => {
                console.log('\tsubmitPriceHashes txHash:', hash)
            })
            .on('receipt',(receipt) => {
            })
            .on('error', console.error);                

            console.log(`\tSecond Provider Finished submission:     ${Date()}`); 
                submittedHash = true;
        } catch (error) {
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
            let info = await transporter.sendMail({
                from: '"FTSO Monitor" <cv40067@gmail.com>',       // sender address
                to: "cv40067@gmail.com, mczochowski@gmail.com",                // list of receivers
                subject: `FTSO error for ${priceProviderAccount.address}`,                           // Subject line
                text: `Price hash submission error for ${priceProviderAccount.address}`,        // plain text body
                html: `Price hash submission error for <b>${priceProviderAccount.address}</b>`, // html body
            });
        }
        var endSubmitTime: Date = new Date();
        var submitTime = (endSubmitTime.getTime() - startSubmitTime.getTime()) / 1000;   // in seconds
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
            submitBuffer = submitBufferBase + submitMean + submitBufferStd*submitStd;
            if(submitBuffer < 15)
                submitBuffer = 15;
        }
        console.log(`   New:  ${submitBuffer}`);
        console.log(`   Mean: ${submitMean}`);
        console.log(`   Std:  ${submitStd}`);
        console.log(`   Last: ${submitTime}`);

        // advance to start of reveal period
        now = await getTime();
        next = nextEpoch * submitPeriod + firstEpochStartTime;
        diff = Math.max(Math.floor(next - now), 0);     // don't sleep for negative time
        console.log(`\nWaiting for ${diff} seconds until reveal`); 
        await sleep(diff * 1000);
        
        // Reveal prices
        console.log(`\n\tWoke at:                 ${Date()}`); 
        if (isTestnet) {
            time.advanceBlock();
        }
        // Only reveal if we successfully submitted
        if (submittedHash) {
            console.log(`\tSubmitting price reveal: ${Date()}`)
            try {
                
                const exchangeEncodeABI = priceSUbmitterContract.methods.revealPrices(currentEpoch, ftsoIndices, prices, randoms).encodeABI();
                var gasLimit = await priceSUbmitterContract.methods.revealPrices(currentEpoch, ftsoIndices, prices, randoms).estimateGas({from: priceProviderAccount.address});
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
                
                let transaction = new EthTx(transactionObject);
                transaction.sign(privateKey); // sign a transaction
                const serializedEthTx = transaction.serialize().toString("hex"); // serialize the transaction
                web3_backup.eth.sendSignedTransaction(`0x${serializedEthTx}`, err_cb_reveal_mute); 
                await web3.eth.sendSignedTransaction(`0x${serializedEthTx}`).on('transactionHash',(hash) => {
                    console.log('\trevealPrices txHash:', hash)
                })
                .on('receipt',(receipt) => {
                })
                .on('error', console.error);                

                console.log(`\tFinished reveal:         ${Date()}`); 
                console.log("Revealed prices for epoch ", currentEpoch);
            } catch (error) {
                console.log('Error submitting price reveals');
                console.log(error);
                errorCount += 1;

                // Send error message
                let info = await transporter.sendMail({
                    from: '"FTSO Monitor" <cv40067@gmail.com">',       // sender address
                    to: "cv40067@gmail.com, mczochowski@gmail.com",                // list of receivers
                    subject: `FTSO error for ${priceProviderAccount.address}`,                           // Subject line
                    text: `Price reveal submission error for ${priceProviderAccount.address}`,        // plain text body
                    html: `Price reveal submission error for <b>${priceProviderAccount.address}</b>`, // html body
                });
            }
        }
        
        // start loop again, the next price submission epoch has already started since we're in reveal phase
        // increment epoch
        currentEpoch = nextEpoch;
        nextEpoch = nextEpoch + 1

        // get remaining balance
        sgbBalance = fromWei((await ethers.provider.getBalance(priceProviderAccount.address)).toString());
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

