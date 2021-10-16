import json
import requests
from ast import literal_eval
import smtplib
import os
import time
import pandas as pd
import numpy as np
from twilio.rest import Client

from dotenv import load_dotenv
load_dotenv()


import web3
w3 = web3.Web3(web3.Web3.HTTPProvider(os.getenv('RPC_NODE_URL')))
# WEB3_PROVIDER_URI
# w3.isConnected()
# w3.eth.block_number
# w3.eth.chain_id

# Test account
# priceProviderPrivateKey = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122";
# priceProviderAccount = w3.eth.account.privateKeyToAccount(priceProviderPrivateKey);
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
ftsoIndices = ftsoSupportedIndices

currencyIndices = {sym : idx for idx, sym in enumerate(symbols)}
















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
