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
    synths:{},
    positions:[]
  },
  mutations: {
    auth (state, {address, network, wallet}) {
      state.address = address
      state.network = network
      state.wallet = wallet
      state.authed = true
    },
    init (state, {synths, daiBalance, daiContract, positions}) {
      state.synths = synths
      state.daiBalance = daiBalance
      state.daiContract = daiContract
      state.positions = positions
    }
  },
  actions: {
  },
  modules: {
  }
})
