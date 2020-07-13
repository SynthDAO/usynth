import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authed:false,
    address:"",
    network:"",
    daiBalance:"",
    wallet:{},
    synths:{}
  },
  mutations: {
    auth (state, {address, network, wallet, synths, daiBalance, daiContract}) {
      state.address = address
      state.network = network
      state.wallet = wallet
      state.synths = synths
      state.daiBalance = daiBalance
      state.daiContract = daiContract
      state.authed = true
    }
  },
  actions: {
  },
  modules: {
  }
})
