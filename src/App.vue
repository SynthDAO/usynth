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
import { getPairPrice } from './api/cryptowatch'
export default {
  components:{
    NavBar
  },
  methods:{
    async connect() {
      await window.ethereum.enable()
      const network = window.ethereum.networkVersion === '1'? 'Mainnet': window.ethereum.networkVersion === '42'? 'Kovan': undefined
      if(network) {
        window.ethereum.autoRefreshOnNetworkChange = true;
        let wallet = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
        let address = window.ethereum.selectedAddress
        let daiContract = new ethers.Contract(config[network.toLowerCase()].daiAddress, daiAbi, wallet)
        let daiBalance = (await daiContract.balanceOf(window.ethereum.selectedAddress)).toString()
        let synths = {}
        for (let synth in config[network.toLowerCase()].synths) {
          let contract = new ethers.Contract(config[network.toLowerCase()].synths[synth], empAbi, wallet)
          let synthAddress = await contract.tokenCurrency()
          let tokenContract = new ethers.Contract(synthAddress, daiAbi, wallet) // DAI abi includes the necessary ERC20 interface
          let synthBalance = (await tokenContract.balanceOf(address)).toString()
          let cumulativeFeeMultiplier = (await contract.cumulativeFeeMultiplier()).toString()
          let rawTotalPositionCollateral = (await contract.rawTotalPositionCollateral()).toString()
          let totalTokensOutstanding = (await contract.totalTokensOutstanding()).toString()
          let minSponsorTokens = (await contract.minSponsorTokens()).toString()
          let GCR = BigNumber(cumulativeFeeMultiplier).shiftedBy(-18).times(rawTotalPositionCollateral).div(totalTokensOutstanding).toFixed()
          let price = await getPairPrice(synth.replace('/', '-').toLowerCase())
          let creq = BigNumber(GCR).div(price).times(100).toFixed(4)
          let expirationTimestamp = (await contract.expirationTimestamp()).toNumber()
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
            expirationTimestamp
          }
        }
        this.$store.commit('auth', {
          daiContract,
          daiBalance,
          network,
          address,
          wallet,
          synths
        })
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
    }
  }
}
</script>

<style lang="scss">
@import "./styles.scss";
</style>
