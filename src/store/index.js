import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authed:false,
    address:"",
    network:"",
    wallet:{}
  },
  mutations: {
    auth (state, {address, network, wallet}) {
      state.address = address
      state.network = network
      state.wallet = wallet
      state.authed = true
    }
  },
  actions: {
  },
  modules: {
  }
})
