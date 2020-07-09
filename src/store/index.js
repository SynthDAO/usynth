import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authed:false,
    address:"",
    network:"",
    wallet:{},
    synths:[]
  },
  mutations: {
    auth (state, {address, network, wallet, synths}) {
      state.address = address
      state.network = network
      state.wallet = wallet
      state.synths = synths
      state.authed = true
    }
  },
  actions: {
  },
  modules: {
  }
})
