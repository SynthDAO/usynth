import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authed:false,
    address:"",
    network:"",
    daiBalance:"",
    daiContract:undefined,
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
    init (state, {synths, daiBalance, daiContract}) {
      state.synths = synths
      state.daiBalance = daiBalance
      state.daiContract = daiContract
    },
    updateBalances (state, {daiBalance, synthBalances}) {
      state.daiBalance = daiBalance
      let synths = Object.assign({}, state.synths)
      for (let synth in synths) {
        synths[synth].synthBalance = synthBalances[synth]
      }
      state.synths = synths
    },
    updatePositions (state, positions) {
      state.positions = positions
    }
  },
  actions: {
    async updateBalances (context) {
      const address = context.state.address;
      const daiBalance = (await context.state.daiContract.balanceOf(address)).toString()
      let synthBalances = {}
      for (let synth in context.state.synths) {
        const tokenContract = context.state.synths[synth].tokenContract
        const synthBalance = (await tokenContract.balanceOf(address)).toString()
        synthBalances[synth] = synthBalance
      }
      context.commit('updateBalances', {daiBalance, synthBalances})
    },
    async updatePositions (context) {
      let positions = []
      for (let synth in context.state.synths) {
        let contractPositions = await context.state.synths[synth].contract.positions(context.state.address)
        for (let i = 0; i < contractPositions.tokensOutstanding.length; i++) {
          if(contractPositions.tokensOutstanding[i].gt(0)) {
            positions.push({
              name:synth,
              tokensOutstanding: contractPositions.tokensOutstanding[i],
              requestPassTimestamp:contractPositions.requestPassTimestamp,
              withdrawalRequestAmount:contractPositions.withdrawalRequestAmount[i],
              rawCollateral:contractPositions.rawCollateral[i],
              transferPositionRequestPassTimestamp:contractPositions.transferPositionRequestPassTimestamp
            })
          }
        }
      }
      context.commit('updatePositions', positions)
    }
  },
  modules: {
  }
})
