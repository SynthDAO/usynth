<template>
  <div>
    <Positions @mint="mint" :synths="this.$store.state.synths" :daiBalance="this.$store.state.daiBalance"/>
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
  methods:{
    async mint({collateral, synth, synthName}) {
      const daiContract = this.$store.state.daiContract
      const synthAddress = this.$store.state.synths[synthName].contract.address
      const weiCollateral = ethers.utils.parseUnits(collateral)
      const weiSynth = ethers.utils.parseUnits(synth)
      const allowance = await daiContract.allowance(this.$store.state.address, synthAddress)
      const MAX_UINT256 = ethers.BigNumber.from(2).pow(256).sub(1)
      if(allowance.lt(weiCollateral)) {
        await daiContract.approve(synthAddress, MAX_UINT256)
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
    }
  }
}
</script>
