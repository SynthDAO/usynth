<template>
  <div>
    <Positions @mint="mint" :positions="positions" :synths="this.$store.state.synths" :daiBalance="this.$store.state.daiBalance"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Positions from '@/screens/Positions.vue'
import { ethers } from 'ethers'

export default {
  name: 'Home',
  components: {
    Positions
  },
  computed:{
    positions() {
      return this.$store.state.positions.map((position) => {
        position.amount = position.tokensOutstanding
        position.collateral = position.rawCollateral
        const synth = this.$store.state.synths[position.name]
        position.creq = synth.creq
        position.cratio = position.collateral.div(position.amount.mul(parseInt(synth.price))).mul(100).toString()
        position.pending = position.withdrawalRequestAmount.gt(0)? "Withdrawal: " + ethers.utils.formatEther(position.withdrawalRequestAmount) + " DAI": "none"
        return position
      })      
    }
  },
  methods:{
    async mint({collateral, synth, synthName}) {
      const daiContract = this.$store.state.daiContract
      const synthAddress = this.$store.state.synths[synthName].contract.address
      const weiCollateral = ethers.utils.parseUnits(collateral)
      const weiSynth = ethers.utils.parseUnits(synth)
      const allowance = await daiContract.allowance(this.$store.state.address, synthAddress)
      const MAX_UINT256 = ethers.BigNumber.from(2).pow(256).sub(1)
      if(allowance.lt(weiCollateral)) {
        const approveTx = await daiContract.approve(synthAddress, MAX_UINT256)
        await approveTx.wait()
      }
      const synthContract = this.$store.state.synths[synthName].contract
      const tx = await synthContract.create([weiCollateral], [weiSynth])
      this.$buefy.snackbar.open({
          message: 'Your transaction has been submitted',
          type: 'is-success',
          position: 'is-top',
          actionText: 'Check TX',
          indefinite: true,
          onAction: () => {
            const prefix = this.$store.state.network === "Mainnet"? "": (this.$store.state.network.toLowerCase() + ".")
            const url = `https://${prefix}etherscan.io/tx/${tx.hash}`
            var win = window.open(url, '_blank');
            win.focus();
          }
      })
      await tx.wait(3)
      this.$store.dispatch('updatePositions')
      this.$store.dispatch('updateBalances')
    }
  }
}
</script>
