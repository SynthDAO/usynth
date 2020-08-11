import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authed:false,
    loading:false,
    address:"",
    network:"",
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
      state.loading = true
    },
    init (state, synths) {
      state.synths = synths
      state.loading = false
    },
    updateBalances (state, synthBalances) {
      let synths = Object.assign({}, state.synths)
      for (let synth in synths) {
        synths[synth].synthBalance = synthBalances[synth].synthBalance
        synths[synth].collateralBalance = synthBalances[synth].collateralBalance
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
      let synthBalances = {}
      for (let synth in context.state.synths) {
        const {tokenContract, collateralContract} = context.state.synths[synth]
        const synthBalance = (await tokenContract.balanceOf(address)).toString()
        const collateralBalance = (await collateralContract.balanceOf(address)).toString()
        synthBalances[synth] = {synthBalance, collateralBalance}
      }
      context.commit('updateBalances', synthBalances)
    },
    async updatePositions (context) {
      let positions = []
      for (let synth in context.state.synths) {
        if(!context.state.synths[synth].isExpired) {
          let contractPositions = await context.state.synths[synth].contract.positions(context.state.address)
          for (let i = 0; i < contractPositions.tokensOutstanding.length; i++) {
            if(contractPositions.tokensOutstanding[i].gt(0)) {
              positions.push({
                name:synth,
                symbol: context.state.synths[synth].symbol,
                tokensOutstanding: contractPositions.tokensOutstanding[i],
                requestPassTimestamp:contractPositions.requestPassTimestamp,
                withdrawalRequestAmount:contractPositions.withdrawalRequestAmount[i],
                rawCollateral:contractPositions.rawCollateral[i],
                transferPositionRequestPassTimestamp:contractPositions.transferPositionRequestPassTimestamp
              })
            }
          }
        }
      }
      context.commit('updatePositions', positions)
    }
  },
  modules: {
  }
})
