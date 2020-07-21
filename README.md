# uSynth.xyz
![uSynth Header@2x](https://user-images.githubusercontent.com/3210789/87946799-afcfed00-cacc-11ea-9328-4727e0133077.png)

https://usynth.xyz/

## Summary
uSynth is the web interface for interacting with UMA synthetic tokens. Create new synths, mint existing ones, manage positions and collateral, trade synths, or provide liquidity and earn interest.

## Features

### Positions
The positions page enables discovery of existing synths, and management of open positions.

The list of existing synths displayed is curated by SynthDAO.

Open positions show the user's current synth amount, collateral, collateral ratio and other important information.

From here the user can mint new synths or manage existing ones.

Users can also create a new type of synth, which they can then create a pool for and submit to the SynthDAO to be included in the curated list.

### Swap
The SynthDAO may create a new bonding curve AMM dex that enables users to swap between stablecoins and synth tokens.

The key to the uSynth interface is listing and highlighting UMA synth trading pairs, so users can better discover UMA tokens. The SynthDAO will curate the synths listed on the swap interface.

In the future we will consider including a price chart so users can more effectively trade synths.

Currently we are considering using Balancer procotol as it offers the most flexibility for providing liquidity.

### Pool
Pooling allows users to deposit their synths into a liquidity pool that enables swapping, and earn interest from the trading fees.

## SynthDAO
The DAO provides governance for the interface by curating the assets listed and building additional functionality.

### Liquidity Mining
The DAO reserves a portion of DAO tokens to be rewarded to users providing liquidity in the pool.

## Future features
Some features which could be developed by the DAO in the future include:
- Margin trading
- Gas token integration
- Referral program


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
