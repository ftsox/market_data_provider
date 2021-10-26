import json
import requests
from ast import literal_eval
import smtplib
import os
import time
import numpy as np
import pandas as pd
import datetime as dt
import itertools
import matplotlib.pyplot as plt
import seaborn as sns

from twilio.rest import Client
from dotenv import load_dotenv
load_dotenv()
# load_dotenv('./scr_prod/.env')    // TODO: point to src_prod file


import web3
w3 = web3.Web3(web3.Web3.HTTPProvider(os.getenv('RPC_NODE_URL')))
# WEB3_PROVIDER_URI
# w3.isConnected()
# w3.eth.block_number
# w3.eth.chain_id


'''Web3.py helper functions'''
# Convert from number to Wei base
def toWei(val):
    return val * web3.constants.WEI_PER_ETHER

# Convert from Wei base to number
def fromWei(val):
    return val / web3.constants.WEI_PER_ETHER

# Decode return values from contract calls
# Rich return tuples not available until web3.py v6 per https://github.com/ethereum/web3.py/pull/1353
# Source: https://github.com/ethereum/web3.py/issues/1267
def decodeWeb3Call(value, abi):
    """Decode tuple as dict."""
    # falls back to abi if there is no "outputs" key
    abi = abi.get("outputs", abi)

    # # list of values
    # if isinstance(value, list):
    #     return [decodeWeb3Call(x, y) for x, y in zip(value, abi)]
    # list of values
    if isinstance(value, list):
        if isinstance(abi, list):
            return [decodeWeb3Call(x, y) for x, y in zip(value, abi)]

    # complex value
    if 'components' in abi:
        inner = {}
        for x, y in zip(value, abi["components"]):
            inner.update(decodeWeb3Call(x, y))
        result = {abi["name"]: inner}

        return result.get("", result)

    # basic value
    return {abi["name"]: value}


# Call a function and return a dictionary with mapped output values
# Otherwise, contract.caller().Func() and contract.functions.Func().call() return an unlabeled list
def contract_call(func, *args, **kwargs):
    # call the function
    raw_output = func.call(*args, **kwargs)
    # map output with abi
    decoded_output = decodeWeb3Call(raw_output, func.abi)
    # convert list of dicts to dict
    return {k: v for d in decoded_output for k, v in d.items()}
    # note: can also use object-like notation rather than dict-like with namespace or namedtuple
    # https://stackoverflow.com/questions/43921240/pythonic-way-to-convert-a-dictionary-into-namedtuple-or-another-hashable-dict-li
    # https://stackoverflow.com/questions/18090672/convert-dictionary-entries-into-variables-python
    # from types import SimpleNamespace as sn
    # x = sn(**currentStateOfRewards)   # need to make iterated


'''Data Analysis'''


# Test account
# priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
# priceProviderAccount = w3.eth.account.privateKeyToAccount(priceProviderPrivateKey);
priceProviderAddress = '0x153aD30381b11DCE62f349c97a54c2a58956B992'
# print('Account: {}'.format(priceProviderAccount.address))
# print(f'Account: {priceProviderAccount.address}')

rootDir = './artifacts/contracts'
def import_contract_abi(rel_path):
    with open(rootDir + rel_path) as f:
        contract_info = json.load(f)
    return contract_info["abi"]

MockPriceSubmitter      = import_contract_abi('/ftso/priceProviderMockContracts/PriceProviderMockContracts.sol/MockPriceSubmitter.json')
MockFtsoRegistry        = import_contract_abi('/ftso/priceProviderMockContracts/PriceProviderMockContracts.sol/MockFtsoRegistry.json')
MockVoterWhitelister    = import_contract_abi('/ftso/priceProviderMockContracts/PriceProviderMockContracts.sol/MockVoterWhitelister.json')
MockFtso                = import_contract_abi('/ftso/priceProviderMockContracts/PriceProviderMockFtso.sol/MockNpmFtso.json')
FtsoManager             = import_contract_abi('/userInterfaces/IFtsoManager.sol/IFtsoManager.json')
FtsoRewardManager       = import_contract_abi('/userInterfaces/IFtsoRewardManager.sol/IFtsoRewardManager.json')

priceSubmitter      = w3.eth.contract(address = '0x1000000000000000000000000000000000000003',  abi = MockPriceSubmitter)
ftsoRegistry        = w3.eth.contract(address = priceSubmitter.caller().getFtsoRegistry(),     abi = MockFtsoRegistry)
voterWhitelister    = w3.eth.contract(address = priceSubmitter.caller().getVoterWhitelister(), abi = MockVoterWhitelister)
ftsoManager         = w3.eth.contract(address = priceSubmitter.caller().getFtsoManager(),      abi = FtsoManager)
ftsoRewardManager   = w3.eth.contract(address = '0xc5738334b972745067fFa666040fdeADc66Cb925',  abi = FtsoRewardManager)
# priceSubmitter.functions.getFtsoRegistry().call()
# priceSubmitter.caller().getFtsoRegistry()


print('Addresses:')
print('\tpriceSubmitter:   {}'.format(priceSubmitter.address))     # 0x1000000000000000000000000000000000000003   
print('\tftsoRegistry:     {}'.format(ftsoRegistry.address))       # 0x6D222fb4544ba230d4b90BA1BfC0A01A94E6cB23
print('\tvoterWhitelister: {}'.format(voterWhitelister.address))   # 0xa76906EfBA6dFAe155FfC4c0eb36cDF0A28ae24D


ftsoSupportedIndices = ftsoRegistry.caller().getSupportedIndices()
nAssets = len(ftsoSupportedIndices)
# symbols = ['XRP',  'LTC', 'XLM', 'DOGE', 'ADA', 'ALGO', 'BCH',  'DGB', 'BTC', 'ETH',  'FIL'];
symbols = [ftsoRegistry.caller().getFtsoSymbol(idx) for idx in ftsoSupportedIndices]
ftsos = [
        w3.eth.contract(
            address = ftsoRegistry.caller().getFtsoBySymbol(sym), 
            abi = MockFtso,
        )
        for sym in symbols
    ] 

ftsoAddresses = ftsoRegistry.caller().getAllFtsos()
ftsoToAddressMap = dict(zip(symbols, ftsoAddresses))
addressToFtsoMap = dict(zip(ftsoAddresses, symbols))
currencyIndices = {sym : idx for idx, sym in enumerate(symbols)}



# Get list of existing providers for an index
ftsoWhitelists = [voterWhitelister.caller().getFtsoWhitelistedPriceProviders(idx) for idx in ftsoSupportedIndices] 
ftsoWhitelistsCounts = {sym : len(ftsoWhitelists[idx]) for idx, sym in enumerate(symbols)}


# Price epoch period information

(firstEpochStartTime, submitPeriod, revealPeriod) = ftsos[0].caller().getPriceEpochConfiguration()

print(f'FTSO parameters:')
print(f'\tfirstEpochStartTime: {dt.datetime.fromtimestamp(firstEpochStartTime, tz=dt.timezone.utc).isoformat()}')
print(f'\tsubmitPeriod (secs): {submitPeriod}')
print(f'\trevealPeriod (secs): {revealPeriod}')


# priceProviderAddress
currentPriceEpoch = contract_call(ftsoManager.functions.getCurrentPriceEpochData())['_priceEpochId']
currentRewardEpoch = ftsoManager.caller().getCurrentRewardEpoch()
currentStateOfRewards = contract_call(ftsoRewardManager.functions.getStateOfRewards(priceProviderAddress, currentRewardEpoch))
pendingRewards = np.sum(currentStateOfRewards['_rewardAmounts'])
print(f'Pending rewards for provider {priceProviderAddress} as of reward epoch {currentRewardEpoch}: {fromWei(pendingRewards):.4f}')


# Get prices from all nodes
# Estimate average block time (in seconds) over past N blocks
blockDelta = 10000
lastBlock = w3.eth.get_block('latest')
prevBlock = w3.eth.get_block(lastBlock.number - blockDelta)
avgBlockTime = (lastBlock.timestamp - prevBlock.timestamp)/blockDelta      # in seconds

# Lookback period to get start epoch
# lookbackPriceEpochs = 1000
lookbackPriceEpochs = 160
blocksPerPriceEpoch = submitPeriod / avgBlockTime
lockbackBlocks = round(lookbackPriceEpochs * blocksPerPriceEpoch)

toBlock = lastBlock.number
fromBlock = toBlock - lockbackBlocks

rewardHitRates = []
finalPxDfs = []
individualAnalysis = False
for idx in ftsoSupportedIndices:
    # idx = 0
    print(f'Starting asset {idx}')
    baseIdx = idx
    ftsoProviders = ftsoWhitelists[baseIdx]
    baseFtso = ftsos[baseIdx]


    # Get event logs with filters
    # https://web3py.readthedocs.io/en/stable/filters.html
    # Can also get all events in bulk without a filter
    # Example: get all of the `barred` logs for the contract
    # logs = foo_contract.events.barred.getLogs()

    # finalized prices with reward ranges
    finalPrices = baseFtso.events.PriceFinalized.createFilter(
            toBlock=toBlock, 
            fromBlock=fromBlock, 
            argument_filters={},
        ).get_all_entries()
    finalPricesResults = [event['args'].__dict__ for event in finalPrices]
    finalPxDf = pd.DataFrame(finalPricesResults)
    finalPxDf['time'] = pd.to_datetime(finalPxDf['timestamp'], unit='s')
    finalPxDf.set_index('epochId', inplace=True)

    finalPxDfs.append(finalPxDf)

    if individualAnalysis:
        combDf = finalPxDf.copy()
        # submitted prices for the particular provider
        # Can also grab in bulk from the PriceSubmitter contract
        providerAddress = priceProviderAddress
        # provDfs=[]
        # for pidx, providerAddress in enumerate(ftsoProviders):
        #     print(f'{pidx}.:\t Fetching price data for provider {providerAddress}')
        providerPrices = baseFtso.events.PriceRevealed.createFilter(
                toBlock=toBlock, 
                fromBlock=fromBlock, 
                argument_filters={'voter': providerAddress},
            ).get_all_entries()
        providerPricesResults = [event['args'].__dict__ for event in providerPrices]
        provDf = pd.DataFrame(providerPricesResults)
        provDf.set_index('epochId', inplace=True)
        provDf[providerAddress+'-price'] = provDf['price']  # merge on this to avoid namespace conflicts
        # provDfs.append(provDf)

        # Merge with combined dataframe
        combDf = combDf.join(provDf[providerAddress+'-price'], how='left')
        # combDf.plot(y=['price', 'lowRewardPrice', 'highRewardPrice', providerAddress+'-price']);plt.show()

        # number of missed price periods
        # will typically be at least 1 (the latest)
        # num_missed = combDf[providerAddress+'-price'].isna().sum()
        combDf[providerAddress+'-reward'] = (
            (combDf[providerAddress+'-price'] >= combDf['lowRewardPrice']) 
            & (combDf[providerAddress+'-price'] <= combDf['highRewardPrice'])
        )

        hitRate = combDf[providerAddress+'-reward'].sum() / len(combDf)
        rewardHitRates += [hitRate]


finalPxDfsComb = pd.concat(finalPxDfs, axis=1, keys=symbols)
pxEpochs = finalPxDfsComb.index.to_series()
startPxEpoch = pxEpochs.min()
endPxEpoch = pxEpochs.max()

if individualAnalysis:
    currencyHitRates = pd.DataFrame(zip(symbols, rewardHitRates), columns=['Asset', 'HitRate'])
    print(currencyHitRates)
    print(f'Average hit rate across all assets: {currencyHitRates["HitRate"].mean() * 100:.4f}%')




'''  ~~~ V2 - get full provider price data from PriceSubmitter rather than 1 by 1 ~~~  '''
baseIdx = 0
ftsoProviders = ftsoWhitelists[baseIdx]
provDfs = []
provSubmitDfs = []
for pidx, providerAddress in enumerate(ftsoProviders):
    print(f'{pidx}.:\t Fetching price data for provider {providerAddress} at {dt.datetime.now().isoformat()}')
    loopStartTime = dt.datetime.now()

    # get price reveal events from PriceSubmitter
    print(f'\t\tGetting price reveal data')
    providerPrices = priceSubmitter.events.PricesRevealed.createFilter(
            toBlock=toBlock, 
            fromBlock=fromBlock, 
            argument_filters={'voter': providerAddress},
        ).get_all_entries()

    # extract multilevel data
    providerPricesResultsRaw = [event['args'].__dict__ for event in providerPrices]
    providerPricesResults = (
    [   
        {
            **dict(zip([addressToFtsoMap[addr] for addr in x['ftsos']], x['prices'])), 
            **{'epochId': x['epochId'], 'timestamp': x['timestamp']},
        }
        for x in providerPricesResultsRaw
    ])

    provDf = pd.DataFrame(providerPricesResults)
    # if the provider hasn't been active then there will be no rows and set_index() will fail
    if len(provDf) > 0:
        # provDf.set_index('epochId', inplace=True)
        # sometimes there are duplicate epoch entries where people reveal prices piecemeal,
        # so use any numeric aggregating function to eliminate duplicates and nans
        provDf = provDf.groupby('epochId').first()
    else:
        # create a df with nans
        provDf = pd.DataFrame(index=pxEpochs, columns=symbols+['timestamp'])

    # store result
    provDfs.append(provDf)

    ######## Price Hash ######
    print(f'\t\tGetting price hash submit data')
    # get price hash submit events from PriceSubmitter
    providerPriceHashes = priceSubmitter.events.PriceHashesSubmitted.createFilter(
            toBlock=toBlock, 
            fromBlock=fromBlock, 
            argument_filters={'submitter': providerAddress},
        ).get_all_entries()

    # extract multilevel data
    providerPriceHashesResultsRaw = [event['args'].__dict__ for event in providerPriceHashes]
    providerPriceHashesResults = (
        [
            {'epochId': x['epochId'], 'timestamp': x['timestamp']} 
            for x in providerPriceHashesResultsRaw
        ]
    )

    provSubmitDf = pd.DataFrame(providerPriceHashesResults)
    # if the provider hasn't been active then there will be no rows and set_index() will fail
    if len(provSubmitDf) > 0:
        # Drop epochs where there were multiple submissions
        # provSubmitDf.duplicated('epochId').sum()
        provSubmitDf.drop_duplicates(subset=['epochId'], keep='last', inplace=True)
        provSubmitDf.set_index('epochId', inplace=True)
    else:
        # create a df with nans
        provSubmitDf = pd.DataFrame(index=pxEpochs, columns=['timestamp'])

    # store result
    provSubmitDfs.append(provSubmitDf)

    ### timing loop
    loopEndTime = dt.datetime.now()
    print(f'\t\tLoop time: {loopEndTime - loopStartTime}')


# # TODO: can maybe do this faster by getting all events 
# # **actually** appears to be way slower
# # https://web3py.readthedocs.io/en/stable/filters.html#event-log-filters
# # topics: 
# # PriceHashesSubmitted
# # [0] 0x90c022ade239639b1f8c4ebb8a76df5e03a7129df46cf9bcdae3c1450ea35434    - use this one
# # [1] 0x00000000000000000000000033ddae234e403789954cd792e1febdbe2466adc2
# # [2] 0x0000000000000000000000000000000000000000000000000000000000003a95
# # PricesRevealed
# # [0] 0xa32444a31df2f9a116229eec3193d223a6bad89f7670ff17b8e5c7014a377da1    - use this one
# # [1] 0x00000000000000000000000062d6116d6a139f2d402e8d8e30baaf5790542801
# # [2] 0x0000000000000000000000000000000000000000000000000000000000003a94
# # iterate over time 10000 blocks at a time
# priceHashesResults = []
# midBlock = fromBlock
# while midBlock < toBlock:
#     midBlock = min(toBlock, midBlock + 1000)
#     allPriceHashesChunk = priceSubmitter.events.PriceHashesSubmitted.createFilter(
#             toBlock=toBlock, 
#             fromBlock=fromBlock, 
#             argument_filters={},
#         ).get_all_entries()
#     providerPriceHashesResultsRaw = [event['args'].__dict__ for event in providerPriceHashes]

### Deal with data issues
# emptyProvIdxs = [i for i, df in enumerate(provDfs) if len(df)==0]     # should be none
# duplicateSubmitsIdxs = [i for i, df in enumerate(provSubmitDfs) if not df.index.is_unique]
# provSubmitDfsOrig = provSubmitDfs.copy()
# for idx in duplicateSubmitsIdxs: 
#     provSubmitDfs[idx] = provSubmitDfs[idx][~provSubmitDfs[idx].index.duplicated(keep='first')]

# Count of valid prices
nPriceEpochs = len(finalPxDfsComb)
# combine dfs
provDfsComb = pd.concat(provDfs, axis=1, keys=ftsoProviders)
submitTsDf = pd.concat(provSubmitDfs, axis=1, keys=ftsoProviders)
submitTsDf = submitTsDf.swaplevel(axis=1).sort_index(axis=1, level=0)['timestamp']


# Get uptime percentage based on how frequently prices are successfully submitted across all assets
# doesn't include missing assets that some providers aren't quoting
priceCounts = (~provDfsComb.isna()).sum(axis=0).unstack(level=1).drop('timestamp', axis=1)
uptimePct = priceCounts.sum(axis=1) / (nPriceEpochs * nAssets)


# restructure to merge with finalized price data
provDfsCombByAsset = provDfsComb.swaplevel(axis=1).sort_index(axis=1, level=0)
# reindex to fill in missing assets that some providers aren't quoting
# could do this earlier on provDfsComb
provDfsCombByAsset = provDfsCombByAsset.reindex(pd.MultiIndex.from_product(provDfsCombByAsset.columns.levels), axis=1)

# combine with final price data
pxDataComb = pd.concat([finalPxDfsComb, provDfsCombByAsset], axis=1)
# pxDataComb = pxDataComb.reindex(pd.MultiIndex.from_product(pxDataComb.columns.levels), axis=1)
# pxDataComb.columns.get_level_values(0).unique()

# asset = 'XRP'
hitDfs = [
      (pxDataComb[asset][ftsoProviders].ge(pxDataComb[asset]['lowRewardPrice'],  axis=0)) 
    & (pxDataComb[asset][ftsoProviders].le(pxDataComb[asset]['highRewardPrice'], axis=0))
    for asset in symbols
]
hitDfComb = pd.concat(hitDfs, axis=1, keys=symbols)


### Overall Hit Rates
provSummaryDf = hitDfComb.sum(axis=0).swaplevel(1,0).unstack(level=1) / nPriceEpochs
provSummaryDf['Mean'] = provSummaryDf.mean(axis=1)
provSummaryDf['Uptime'] = uptimePct

## Submission time analysis
# currently the timestamps of the *reveal*, not the original price hash submit
pxDataComb.drop('timestamp', axis=1, inplace=True)
submitTsDf['epochStart'] = submitTsDf.index.to_series() * submitPeriod + firstEpochStartTime
submitTsDf['epochEnd'] = (submitTsDf.index.to_series() + 1) * submitPeriod + firstEpochStartTime
submitBuffers = -(submitTsDf[ftsoProviders].sub(submitTsDf['epochEnd'], axis=0))
provSummaryDf['MeanSubmitBuffer'] = submitBuffers.mean(axis=0)
provSummaryDf['SubmitBufferStd'] = submitBuffers.std(axis=0)

# Get list of providers by hit rate
provSummaryDf.index.name = 'Provider'
print('Providers by Mean Reward Hit Rate')
print(provSummaryDf.sort_values(by='Mean', ascending=False).reset_index()[['Provider', 'Mean', 'Uptime', 'MeanSubmitBuffer', 'SubmitBufferStd']])


### Rolling avg hit rates
hitRateByEpoch = hitDfComb.groupby(level=[1],axis=1).sum()/nAssets
# plot rolling average
rollingHitRates = hitRateByEpoch.rolling(100, min_periods=10, axis=0).mean()
# rollingHitRates.plot();plt.show()
providersOfInterest = provSummaryDf.sort_values(by='Mean', ascending=False).iloc[:5].index.to_list() + [
    '0x153aD30381b11DCE62f349c97a54c2a58956B992',
    '0xe60784D1c661a8D8eE19b442999bB71279F0A91f',
    '0x4fE889F450EcA4decd8a65B6B6eC5b7Db8EaB12E',
    '0xE76Bc13136338f27363425FcbCB36967B0540176',
]
fig, ax = plt.subplots(figsize=(12, 6))
fig.subplots_adjust(left=0.1, right=0.55)
sns.lineplot(data=rollingHitRates[providersOfInterest])
ax.set_title('Rolling Average Hit Rate (100 Epoch Window)')
plt.legend(bbox_to_anchor=(1.05, 1), loc=2, borderaxespad=0.)
plt.show()

# Just XRP
hitDfComb['XRP'][priceProviderAddress].rolling(50, min_periods=10, axis=0).mean()

# dt.datetime.fromtimestamp(submitTsDf.loc[16150].epochEnd, tz=dt.timezone.utc).isoformat()

### Plotting
# https://seaborn.pydata.org/tutorial/color_palettes.html
# fig1 = plt.figure(figsize=(5.5,4),dpi=300)
# fig = plt.gcf()
fig, ax = plt.subplots(figsize=(10, 6))
ax = sns.heatmap(
    provSummaryDf[symbols + ['Mean','Uptime']].sort_values(by='Mean', ascending=False), 
    annot=True, 
    fmt='.1%', 
    xticklabels = 1,
    yticklabels = 1,
    cmap='vlag_r',
    # figsize=(7, 5),
    annot_kws={'fontsize': 5},
    cbar=False,
    # square=True,
    )
ax.set_title(f'Price Provider Reward Hit Rates between Epochs {startPxEpoch} to {endPxEpoch}')
# plt.yticks(rotation=30, fontsize=5) 
plt.yticks(fontsize=5) 
# ax.set_xlabel("Assets", fontsize = 20)
# ax.set_ylabel("Provider", fontsize = 1)
ax.xaxis.tick_top() # x axis on top
ax.xaxis.set_label_position('top')
plt.xticks(rotation=90, fontsize=8)
# ax.tick_params(length=0)
# ax.figure.tight_layout()
# ax.figure.subplots_adjust(left = 0.8)
# plt.autoscale()
# plt.tight_layout()
# fig.set_size_inches([4,4])

# l, b, w, h = ax.get_position().bounds
# ax.set_position([l+0.12*w, b + 0.1*h, w, h*0.8])
# fig.subplots_adjust(left=0.2, top=0.9)
fig.subplots_adjust(left=0.22, top=0.85, bottom=0.18)

# CB = fig.colorbar()
# ll, bb, ww, hh = CB.ax.get_position().bounds
# ax.set_position([ll+0.25*w, bb, ww, hh])

plt.show()



# # RPC setup
# # https://docs.flare.network/en/tutorials/wallets/how-to-access-flare-network-with-metamask
# url = 'https://songbird.towolabs.com/rpc'
# id = 19         # network ID for Songbird
# decimals = 18   # number of decimals for base token

# # Call Ethereum-style RPC
# def call_rpc(method, params, id):
#     payload = json.dumps({"method": method, "params": params, "id": id})
#     headers = {'content-type': "application/json", 'cache-control': "no-cache"}
#     try:
#         response = requests.request("POST", url, data=payload, headers=headers)
#         return json.loads(response.text)
#     except requests.exceptions.RequestException as e:
#         print(e)
#     except:
#         print('No response from node, check to confirm it is operational')


# def get_address_balance(addr):
#     # for address in addresses:
#     # RPC call
#     # reference: https://eth.wiki/json-rpc/API
#     # Songbird and Flare replicate Ethereum APIs
#     method = 'eth_getBalance'
#     params = [addr, 'latest']

#     # call RPC function
#     rpc_ret = call_rpc(method, params, id)
#     balance = literal_eval(rpc_ret['result']) / 10**decimals

#     return balance


# # SMTP Setup
# # store passwords in secret .env file in this directory
# # Note: need to use an application specific password
# # info: https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637687407469912796-3308787284&rd=1
# gmail_user = os.getenv('GMAIL_USER')
# gmail_password = os.getenv('GMAIL_PASSWORD')
# # recipients = ['mczochowski@gmail.com', 'carlhua@gmail.com', 'trigger@applet.ifttt.com']     # can add more recipients
# # recipients = ['mczochowski@gmail.com', 'trigger@applet.ifttt.com']
# # recipients = ['mczochowski@gmail.com',]
# recipients = ['mczochowski@gmail.com', 'carlhua@gmail.com',]


# # Twilio setup
# # Reference: https://www.twilio.com/docs/voice/tutorials/how-to-make-outbound-phone-calls-python
# #            https://www.twilio.com/docs/libraries/python

# # Your Account SID from twilio.com/console
# # account_sid = os.environ['TWILIO_ACCOUNT_SID']
# account_sid = os.environ['TWILIO_ACCOUNT_SID']
# # Your Auth Token from twilio.com/console
# auth_token  = os.environ['TWILIO_AUTH_TOKEN']
# # Your Twilio phone number from twilio.com/console
# twilio_num  = os.environ['TWILIO_NUMBER']
# # The number you're sending messages to
# to_num      = os.environ['TO_NUMBER']
# # Twilio client
# twilio_client = Client(account_sid, auth_token)

# ### Addresses
# # test_address = '0x9ea927596474F2943e7b44DD5A5001155F8E41b2'
# mcz_address     = '0x46c283c599a5dC4CE614092eC31F354e89b4706F'
# carl_address    = '0xC55c5C5CF8e455E9b5c74e93D6e8CE1DC3e37fF6'
# sending_address = '0x780B144e034341a970c2e4F93f2f6Cd82E8DFadc'
# addresses = [mcz_address, carl_address, sending_address]
# n_addresses = len(addresses)

# df = pd.DataFrame({'Address': addresses})
# df['Balance'] = [get_address_balance(x) for x in addresses]
# df['BalancePrev'] = df['Balance']
# # df['BalancePrev'] = 0
# df['BalanceDiff'] = 0

# i = 0

# print('Listenting for balances on addresses:\n    ' + '\n    '.join(addresses))

# # continue running until stopped
# while True:
#     print('Loop {}'.format(i))

#     df['Balance'] = [get_address_balance(x) for x in addresses]
#     df['BalanceDiff'] = df['Balance'] - df['BalancePrev']

#     # calculate balance change
#     # balance_change = balance - balance_prev
    
#     # if there was a balance change, send alert email
#     # if balance_change != 0:
#     if sum(df['BalanceDiff'] != 0) > 0:
#         change_df = df[df['BalanceDiff'] != 0]

#         print('    Balance changed...')

#         # email properties
#         sent_from = gmail_user
#         to = ','.join(recipients)
#         subject = '~~~ Alert for change in balance ~~~'
#         timestamp = time.strftime("%H:%M:%S", time.localtime())
#         email_text = \
#         '''
# Balance change detected as of {timestamp}:

# {data}
#         '''.format(
#                 timestamp=timestamp, 
#                 data=change_df.to_string()
#             )
#         message = 'To: {}\r\nSubject: {}\r\n{}'.format(to, subject, email_text)

#         # email send request
#         try:
#             server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
#             server.ehlo()
#             server.login(gmail_user, gmail_password)
#             server.sendmail(sent_from, to, message)
#             server.close()

#             print ('    Email sent!')
#         except Exception as e:
#             print(e)
#             print ('    Something went wrong with SMTP...')

#         # Call phone via Twilio
#         try:
#             ## Call
#             call = twilio_client.calls.create(
#                                     twiml='<Response><Say>Songbird account activity alert!</Say></Response>',
#                                     to=to_num,
#                                     from_=twilio_num
#                                 )
#             print(call.sid)

#             ## Text
#             # message = twilio_client.messages.create(
#             #     to=to_num, 
#             #     from_=twilio_num,
#             #     body="Hello from Python!")

#             # print(message.sid)

#         except Exception as e:
#             print(e)
#             print ('    Something went wrong with Twilio...')

#     # udpate balances
#     # balance_prev = balance
#     df['BalancePrev'] = df['Balance']
#     i += 1

#     # sleep for 10 sec
#     time.sleep(10)
