<template>
    <div class="body">
        <div class="title has-text-centered">
        Withdraw Collateral from {{name}}
        </div>
        <section>
            <b-field label="Amount to Withdraw">
                <b-input v-model="collateralAmount" placeholder="DAI to withdraw"></b-input>
            </b-field>
            <div class="balance">
                <div class="is-pulled-left">
                    Current Collateral: {{balanceFormat(collateral)}} DAI
                </div>
            </div>
            <div id="cratio">Collateralization Ratio</div>
            <b-progress :value="newCratio" :type="progressColor" :max="Number(creq)" show-value></b-progress>
            <b-message v-if="progressColor === 'is-danger'" title="Insufficient Collateral" type="is-danger" :closable="false">
            Your collateral ratio is below the liquidation threshold ({{liquidationThresh}}%)
            </b-message>
            <b-message v-if="progressColor === 'is-warning'" title="Slow Withdrawal" type="is-warning" :closable="false">
            Your collateral ratio is below the global collateralization ratio ({{creq}}%). This may trigger a slow withdrawal request.
            </b-message>
            <b-message v-if="progressColor === 'is-success' && collateralAmount.length !== 0" title="Instant Withdrawal" type="is-success" :closable="false">
            Your collateral ratio is eligible for an instant withdrawal.
            </b-message>
            <b-button @click="withdraw" :disabled="disabled" id="withdraw-button" type="is-primary">Withdraw</b-button>
        </section>
    </div>
</template>

<script>
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js'
export default {
  name: 'Withdraw',
  props:['name', 'collateral', 'creq', 'cratio', 'amount', 'price', 'liquidationThresh'],
  data: () => {
      return {
          collateralAmount:""
      }
  },
  methods:{
    balanceFormat(baseUnit) {
        return ethers.utils.formatEther(baseUnit)
    },
    withdraw() {
        this.$emit('withdraw', {
            collateral:this.collateralAmount,
            synthName:this.name
        })
        this.$emit('close')
    }
  },
  computed: {
    newCratio () {
        if(this.collateralAmount === "") return Number(this.cratio)
        if(isNaN(this.collateralAmount)) return Number(this.cratio)
        let collateralAmount = BigNumber(this.collateralAmount).shiftedBy(18)
        let existingCollateral = BigNumber(this.collateral.toString())
        let existingAmount = BigNumber(this.amount.toString())
        let price = BigNumber(this.price)
        return existingCollateral.minus(collateralAmount).div(existingAmount.times(price)).times(100).toNumber()
    },
    progressColor () {
        if(this.newCratio >= this.creq) {
            return 'is-success'
        } else if(this.newCratio >= this.liquidationThresh) {
            return "is-warning"
        } else {
            return "is-danger"
        }
    },
    disabled () {
        if(this.newCratio < this.liquidationThresh) return true
        if(isNaN(this.collateralAmount)) return true
        if(this.collateralAmount > parseInt(this.balanceFormat(this.collateral))) return true
        if(this.collateralAmount.length === 0) return true
        if(this.collateralAmount === 0) return true
        return false
    }
  }
}
</script>

<style scoped>
.body {
    max-width:400px;
    margin:auto;
    padding-top:50px;
    padding-bottom:50px;
}

#withdraw-button {
    display:block;
    margin:auto;
}
.balance {
    display:block;
    height:30px;
    margin-bottom:30px;
}
#cratio {
    margin-bottom:10px;
    font-weight:bold;
}
</style>
