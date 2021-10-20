# FTSO

Songbird/Flare FTSO server.

## Development
<!-- First follow the `Getting Started` instructions in the [FTSO npm example package](https://www.npmjs.com/package/@flarenetwork/ftso_price_provider_kick_off_package) to get your local environment ready. -->
Clone this repository.

Install dependencies (if not already present):
- [Node](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
npm install --global yarn
```

Switch to the repo folder (`cd ftso`) and run `yarn`.

Then setup an `.env` file following `.env example` with the following:
- Songbird/Flare node (see https://gitlab.com/flarenetwork/node-config)
- CryptoCompare API key
- [CoinAPI Key](https://www.coinapi.io/Pricing)
- Gmail access credentials ([instructions](https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637687407469912796-3308787284&rd=1))
and call `source .env` in your terminal.

To run on local hardhat testnet, open up two terminal windows. In the first, run
```
yarn hardhat node
```
In the second window, run
```
yarn hardhat compile 
yarn hardhat run ./deployment/scripts/deploy-mock-price-submitter.ts --network localhost
env CHAIN_CONFIG=scdev yarn hardhat run ./deployment/scripts/prod-price-provider.ts --network localhostv
```
or to run on mainnet:
```
yarn hardhat run ./deployment/scripts/prod-price-provider.ts --network songbird
```

To get logging of run output, use:
```
yarn hardhat run ./deployment/scripts/prod-price-provider.ts --network songbird 2>&1 | tee -a run.log
tail -f run.log
```

To run the main process in the background, use `screen` ([Explanation](https://askubuntu.com/questions/8653/how-to-keep-processes-running-after-ending-ssh-session/8657#8657)).


See `scratch/console_commands.js` for some examples

## Production

### Docker

Build the image in project root directory: `docker build .` then push to docker hub: `docker push  bbftso/ftsojs`. Note that the images need to be tagged before pushing: `docker tag image_hash bbftso/ftsojs`.

###Deployment
Make sure docker-compose and docker are installed on the instance.

On a fresh Ubuntu 20.04 instance:
```
sudo apt-get update
sudo apt install docker
sudo apt install docker-compose
```

Clone the git repo
```
git clone https://github.com/mczochowski/ftso.git
cd ftso
```

Setup the enviornment variable in the `docker-compose.yml` file similarly to the `.env` file *without quotes*, then run: 

```
sudo docker-compose up -d
```

To see the `docker-compose` logs, run:
```
sudo docker-compose logs
```

The monitoring process should check the status every minute, logs are written to `./logs/run.log`


## Improvements

TODO

## Reference

### FTSO
- [Hardhat](https://hardhat.org/tutorial/)
- [Flare Network Price Provider | Kick-off package](https://www.npmjs.com/package/@flarenetwork/ftso_price_provider_kick_off_package)
- [Flare Smart Contracts](https://gitlab.com/flarenetwork/flare-smart-contracts) (source of the npm package)

### Network node
- [Node repo](https://gitlab.com/flarenetwork/flare)
- [Node setup](https://gitlab.com/flarenetwork/node-config)
