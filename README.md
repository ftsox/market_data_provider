# FTSO

Songbird/Flare FTSO server.

## Setup
First follow the `Getting Started` instructions in the [FTSO npm example package](https://www.npmjs.com/package/@flarenetwork/ftso_price_provider_kick_off_package) to get your local environment ready.

Then setup an `.env` file following `.env example` with the following:
- Songbird/Flare node (see https://gitlab.com/flarenetwork/node-config)
- CryptoCompare API key
and call `source .env` in your terminal.

To run on local hardhat testnet, open up two terminal windows. In the first, run
```
yarn hardhat node
```
In the second window, run
```
yarn hardhat compile 
yarn hardhat run ./deployment/scripts/deploy-mock-price-submitter.ts --network localhost
env CHAIN_CONFIG=scdev yarn hardhat run ./deployment/scripts/prod-price-provider.ts --network localhost
```

See `scratch/console_commands.js` for some examples

## Usage

TODO

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
