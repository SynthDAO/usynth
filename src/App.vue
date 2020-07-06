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
export default {
  components:{
    NavBar
  },
  methods:{
    async connect() {
      await window.ethereum.enable()
      const network = window.ethereum.networkVersion === '1'? 'Mainnet': window.ethereum.networkVersion === '42'? 'Kovan': undefined
      if(network) {
        window.undefinedethereum.autoRefreshOnNetworkChange = true;
        let wallet = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
        this.$store.commit('auth', {
          network,
          address:window.ethereum.selectedAddress,
          wallet
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
