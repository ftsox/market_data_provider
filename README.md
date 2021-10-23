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
- [CoinMarketCap Key](https://coinmarketcap.com/api/pricing/)
- Your price provider private key
- Gmail access credentials ([instructions](https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637687407469912796-3308787284&rd=1))
and call `source .env` in your terminal.
- Email list for error messages

To run
```
cd src_prod
npm install
npm run build
node ./dist/prod-price-provider.js
```

Ensure .env is properly placed in the `src_prod` folder.

To get logging of run output, use:
```
node ./dist/prod-price-provider.js 2>&1 | tee -a run.log
tail -f run.log
```

To run the main process in the background, use `screen` ([Explanation](https://askubuntu.com/questions/8653/how-to-keep-processes-running-after-ending-ssh-session/8657#8657)).


See `scratch/console_commands.js` for some examples

## Production

### Docker

Build the image in project root directory: `docker build .` then push to docker hub: `docker push bbftso/ftsojs`. Note that the images need to be tagged before pushing: `docker tag image_hash bbftso/ftsojs`:

```
cd src_prod
docker build .
docker image ls
docker tag [image_hash] bbftso/ftsojs:[TAG]
docker push bbftso/ftsojs:[TAG]
```

###Deployment
Make sure docker-compose and docker are installed on the instance.

On a fresh Ubuntu 20.04 instance:
```
sudo apt-get update
sudo apt install docker
sudo apt install docker-compose
```

<!-- Clone the git repo
```
git clone https://github.com/mczochowski/ftso.git
cd ftso
``` -->

Make a new directory:
```
mkdir ftso
cd ftso
```

Copy over a `docker-compose.yml` file to the instance ([template](https://github.com/mczochowski/ftso/blob/master/docker-compose.yml)).

Setup the enviornment variable in the `docker-compose.yml` file similarly to the `.env` file *without quotes* (update docker-compose.yml to pull from `bbftso/ftsojs:[TAG]` using the tag set above or a standard tag), then run: 

```
sudo docker-compose pull
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
