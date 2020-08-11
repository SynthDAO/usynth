<template>
    <div class="body">
        <div class="title has-text-centered">
        Redeem {{symbol}}
        </div>
        <section>
            <b-field label="Amount to Redeem">
                <b-field>
                    <b-input v-model="tokenAmount" :placeholder="symbol" expanded></b-input>
                    <p class="control">
                        <b-button @click="max" class="button">MAX</b-button>
                    </p>
                </b-field>
            </b-field>
            <div class="balance">
                <div class="is-pulled-left">
                    Current Position: {{balanceFormat(tokensOutstanding)}} {{symbol}}
                </div>
            </div>
            <div class="level item">
                <div class="level-left">
                    <div class="level-item">
                    <strong>Current Collateral</strong>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item is-pulled-right">
                    {{balanceFormat(collateral)}} {{collateralSymbol}}
                    </div>
                </div>
            </div>
            <div class="level item">
                <div class="level-left">
                    <div class="level-item">
                    <strong>Collateral ratio</strong>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item is-pulled-right">
                    {{cratio}}%
                    </div>
                </div>
            </div>
            <div class="level item">
                <div class="level-left">
                    <div class="level-item">
                    <strong>Collateral Redeeming</strong>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item is-pulled-right">
                    {{balanceFormat(collateralRedeeming)}} {{collateralSymbol}}
                    </div>
                </div>
            </div>
            <b-button @click="redeem" :disabled="disabled" id="redeem-button" type="is-primary">Redeem</b-button>
        </section>
    </div>
</template>

<script>
import { ethers } from 'ethers';
export default {
  name: 'Redeem',
  props:['name', 'symbol', 'collateral', 'amount', 'collateralSymbol', 'cratio', 'tokensOutstanding'],
  data: () => {
      return {
          tokenAmount:""
      }
  },
  methods:{
    balanceFormat(baseUnit) {
        return ethers.utils.formatEther(baseUnit)
    },
    redeem() {
        this.$emit('redeem', {
            amount:this.tokenAmount,
            synthName:this.name
        })
        this.$emit('close')
    },
    max () {
        this.tokenAmount = this.balanceFormat(this.tokensOutstanding)
    }
  },
  computed: {
    collateralRedeeming () {
        if(this.disabled) return "0"
        return this.collateral.div(this.tokensOutstanding.div(ethers.utils.parseEther(this.tokenAmount)))
    },
    disabled () {
        if(isNaN(this.tokenAmount)) return true
        if(this.tokenAmount > parseInt(this.balanceFormat(this.tokensOutstanding))) return true
        if(this.tokenAmount.length === 0) return true
        if(this.tokenAmount == 0) return true
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

#redeem-button {
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
