<template>
  <div>
    <Positions @redeem="redeem" @redeemExpired="redeemExpired" @confirmWithdrawal="confirmWithdrawal" @cancelWithdrawal="cancelWithdrawal" @mint="mint" @withdraw="withdraw" :loading="this.$store.state.loading" :address="this.$store.state.address" :authed="this.$store.state.authed" :positions="positions" :synths="this.$store.state.synths"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Positions from '@/screens/Positions.vue'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

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
        position.price = synth.price
        position.liquidationThresh = synth.liquidationThresh
        position.creq = synth.creq
        position.collateralSymbol = synth.collateralSymbol
        position.isExpired = synth.isExpired
        const BigCollateral = BigNumber(position.collateral.toString())
        const BigAmount = BigNumber(position.amount.toString())
        position.cratio = BigCollateral.div(BigAmount.times(synth.price)).times(100).toFixed(4)
        position.pendingWithdrawal = position.withdrawalRequestAmount.gt(0)
        position.withdrawalReady = position.pendingWithdrawal && position.requestPassTimestamp.mul(1000).lt(Date.now())
        if(!position.pendingWithdrawal) {
          position.pending = "none"
        } else if(position.withdrawalReady) {
          position.pending = "Withdrawal: Ready"
        } else {
          const minutesLeft = position.requestPassTimestamp.mul(1000).sub(Date.now()).div(60000).toString() + "m"
          position.pending = `${ethers.utils.formatEther(position.withdrawalRequestAmount)} ${synth.collateralSymbol} (${minutesLeft})`
        }
        return position
      })      
    }
  },
  methods:{
    async mint({collateral, synth, synthName}) {
      const collateralContract = this.$store.state.synths[synthName].collateralContract
      const synthAddress = this.$store.state.synths[synthName].contract.address
      const weiCollateral = ethers.utils.parseUnits(collateral)
      const weiSynth = ethers.utils.parseUnits(synth)
      const allowance = await collateralContract.allowance(this.$store.state.address, synthAddress)
      const MAX_UINT256 = ethers.BigNumber.from(2).pow(256).sub(1)
      if(allowance.lt(weiCollateral)) {
        const approveTx = await collateralContract.approve(synthAddress, MAX_UINT256)
        await approveTx.wait()
      }
      const synthContract = this.$store.state.synths[synthName].contract
      const tx = await synthContract.create([weiCollateral], [weiSynth])
      this.$buefy.snackbar.open({
          message: 'Your minting transaction has been submitted',
          type: 'is-success',
          position: 'is-top',
          actionText: 'Check TX',
          onAction: () => {
            const prefix = this.$store.state.network === "Mainnet"? "": (this.$store.state.network.toLowerCase() + ".")
            const url = `https://${prefix}etherscan.io/tx/${tx.hash}`
            var win = window.open(url, '_blank');
            win.focus();
          }
      })
      await tx.wait(2)
      this.$store.dispatch('updatePositions')
      this.$store.dispatch('updateBalances')
    },
    async withdraw({collateral, synthName}) {
      const weiCollateral = ethers.utils.parseUnits(collateral)
      const synthContract = this.$store.state.synths[synthName].contract
      let tx, message;
      try {
        tx = await synthContract.withdraw([weiCollateral])
        message = 'A fast withdrawal has been submitted'
      } catch(e) {
        tx = await synthContract.requestWithdrawal([weiCollateral])
        message = 'A slow withdrawal has been submitted'
      }
      this.$buefy.snackbar.open({
          message,
          type: 'is-success',
          position: 'is-top',
          actionText: 'Check TX',
          onAction: () => {
            const prefix = this.$store.state.network === "Mainnet"? "": (this.$store.state.network.toLowerCase() + ".")
            const url = `https://${prefix}etherscan.io/tx/${tx.hash}`
            var win = window.open(url, '_blank');
            win.focus();
          }
      })
      await tx.wait(2)
      this.$store.dispatch('updatePositions')
      this.$store.dispatch('updateBalances')
    },
    async confirmWithdrawal(synthName) {
      const synthContract = this.$store.state.synths[synthName].contract
      let tx = await synthContract.withdrawPassedRequest()
      this.$buefy.snackbar.open({
          message: "A withdrawal confirmation has been submitted",
          type: 'is-success',
          position: 'is-top',
          actionText: 'Check TX', 
          onAction: () => {
            const prefix = this.$store.state.network === "Mainnet"? "": (this.$store.state.network.toLowerCase() + ".")
            const url = `https://${prefix}etherscan.io/tx/${tx.hash}`
            var win = window.open(url, '_blank');
            win.focus();
          }
      })
      await tx.wait(2)
      this.$store.dispatch('updatePositions')
      this.$store.dispatch('updateBalances')
    },
    async cancelWithdrawal(synthName) {
      const synthContract = this.$store.state.synths[synthName].contract
      let tx = await synthContract.cancelWithdrawal()
      this.$buefy.snackbar.open({
          message: "A withdrawal cancellation has been submitted",
          type: 'is-success',
          position: 'is-top',
          actionText: 'Check TX', 
          onAction: () => {
            const prefix = this.$store.state.network === "Mainnet"? "": (this.$store.state.network.toLowerCase() + ".")
            const url = `https://${prefix}etherscan.io/tx/${tx.hash}`
            var win = window.open(url, '_blank');
            win.focus();
          }
      })
      await tx.wait(2)
      this.$store.dispatch('updatePositions')
      this.$store.dispatch('updateBalances')
    },
    async redeemExpired(synthName) {
      const synthContract = this.$store.state.synths[synthName].contract
      const tokenContract = this.$store.state.synths[synthName].tokenContract
      const balance = await tokenContract.balanceOf(this.$store.state.address)
      const allowance = await tokenContract.allowance(this.$store.state.address, synthContract.address)
      if(balance.gt(allowance)) {
        const approveTx = await tokenContract.approve(synthContract.address, balance)
        await approveTx.wait()
      }
      let tx = await synthContract.settleExpired()
      this.$buefy.snackbar.open({
          message: "A redeem request has been submitted",
          type: 'is-success',
          position: 'is-top',
          actionText: 'Check TX', 
          onAction: () => {
            const prefix = this.$store.state.network === "Mainnet"? "": (this.$store.state.network.toLowerCase() + ".")
            const url = `https://${prefix}etherscan.io/tx/${tx.hash}`
            var win = window.open(url, '_blank');
            win.focus();
          }
      })
      await tx.wait(2)
      this.$store.dispatch('updatePositions')
      this.$store.dispatch('updateBalances')
    },
    async redeem({synthName, amount}) {
      amount = ethers.utils.parseEther(amount)
      const synthContract = this.$store.state.synths[synthName].contract
      const tokenContract = this.$store.state.synths[synthName].tokenContract
      const allowance = await tokenContract.allowance(this.$store.state.address, synthContract.address)
      if(allowance.lt(amount)) {
        const approveTx = await tokenContract.approve(synthContract.address, amount)
        await approveTx.wait()
      }
      let tx = await synthContract.redeem([amount])
      this.$buefy.snackbar.open({
          message: "A redeem request has been submitted",
          type: 'is-success',
          position: 'is-top',
          actionText: 'Check TX', 
          onAction: () => {
            const prefix = this.$store.state.network === "Mainnet"? "": (this.$store.state.network.toLowerCase() + ".")
            const url = `https://${prefix}etherscan.io/tx/${tx.hash}`
            var win = window.open(url, '_blank');
            win.focus();
          }
      })
      await tx.wait(2)
      this.$store.dispatch('updatePositions')
      this.$store.dispatch('updateBalances')
    }
  }
}
</script>
