<template>
  <div class="container" id="app">
    <NavBar
    :authed="$store.state.authed"
    :address="$store.state.address"
    :network="$store.state.network"
    @connect="connect"/>
    <router-view/>
  </div>
</template>

<script>
import NavBar from "./components/NavBar"
import {ethers} from 'ethers'
import config from './config.json'
import daiAbi from './abi/DAI.json'
import empAbi from './abi/EMP.json'
import BigNumber from "bignumber.js"
import { getPairPrice } from './api/price'
export default {
  components:{
    NavBar
  },
  methods:{
    until(conditionFunction) {

      const poll = resolve => {
        if(conditionFunction()) resolve();
        else setTimeout(() => poll(resolve), 100);
      }

      return new Promise(poll);
    },
    async connect() {
      await window.ethereum.enable()
      const network = window.ethereum.networkVersion === '1'? 'Mainnet': window.ethereum.networkVersion === '42'? 'Kovan': undefined
      if(network) {
        window.ethereum.autoRefreshOnNetworkChange = true;
        let wallet = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
        await this.until(() => typeof window.ethereum.selectedAddress === 'string')
        let address = window.ethereum.selectedAddress
        this.$store.commit('auth', {address, network, wallet})
        let synths = {}
        for (let synth in config[network.toLowerCase()].synths) {
          let contract = new ethers.Contract(config[network.toLowerCase()].synths[synth].address, empAbi, wallet)
          let pool = config[network.toLowerCase()].synths[synth].pool
          let synthAddress = await contract.tokenCurrency()
          let tokenContract = new ethers.Contract(synthAddress, daiAbi, wallet) // DAI abi includes the necessary ERC20 interface
          let collateralAddress = await contract.collateralCurrency()
          let collateralContract = new ethers.Contract(collateralAddress, daiAbi, wallet)
          let collateralSymbol = await collateralContract.symbol()
          let synthBalance = (await tokenContract.balanceOf(address)).toString()
          let symbol = await tokenContract.symbol()
          let cumulativeFeeMultiplier = (await contract.cumulativeFeeMultiplier()).toString()
          let rawTotalPositionCollateral = (await contract.rawTotalPositionCollateral()).toString()
          let totalTokensOutstanding = (await contract.totalTokensOutstanding()).toString()
          let minSponsorTokens = (await contract.minSponsorTokens()).toString()
          let GCR = BigNumber(cumulativeFeeMultiplier).shiftedBy(-18).times(rawTotalPositionCollateral).div(totalTokensOutstanding).toFixed()
          let price = await getPairPrice(synth.replace('/', '-').toLowerCase(), config[network.toLowerCase()].synths[synth].invertedPrice)
          let creq = BigNumber(GCR).div(price).times(100).toFixed(4)
          let expirationTimestamp = (await contract.expirationTimestamp()).toNumber()
          let isExpired = (expirationTimestamp * 1000) > Date.now()
          let priceFeed = ethers.utils.parseBytes32String(await contract.priceIdentifier())
          let liquidationThresh = BigNumber((await contract.collateralRequirement()).toString()).shiftedBy(-16).toFixed()
          synths[synth] = {
            contract,
            tokenContract,
            synthBalance,
            minSponsorTokens,
            GCR,
            creq,
            price,
            priceFeed,
            liquidationThresh,
            expirationTimestamp,
            pool,
            symbol,
            collateralContract,
            collateralSymbol,
            isExpired
          }
        }
        this.$store.commit('init', synths)
        await this.$store.dispatch('updatePositions')
        await this.$store.dispatch('updateBalances')
        this.watchBalances()
      } else {
        this.$buefy.dialog.alert({
            title: 'Invalid Network',
            message: 'Please switch to either Mainnet or Kovan',
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fa',
            ariaRole: 'alertdialog',
            ariaModal: true
        })
      }
    },
    watchBalances () {
      setInterval(async () => {
        this.$store.dispatch('updateBalances')
      }, 5000) // 5 seconds
    }
  }
}
</script>

<style lang="scss">
@import "./styles.scss";
#app {
  padding-bottom:50px;
}
</style>
