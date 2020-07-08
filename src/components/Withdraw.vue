<template>
    <div class="body">
        <div class="title has-text-centered">
        Withdraw Collateral from {{name}}
        </div>
        <section>
            <b-field label="Amount to Withdraw">
                <b-input value="" placeholder="DAI to withdraw"></b-input>
            </b-field>
            <div class="balance">
                <div class="is-pulled-left">
                    Current Collateral: {{balanceFormat(currentCollateral)}} DAI
                </div>
            </div>
            <div id="cratio">Collateralization Ratio</div>
            <b-progress :value="cratio" :type="progressColor" :max="creq" show-value></b-progress>
            <b-message v-if="progressColor === 'is-danger'" title="Insufficient Collateral" type="is-danger" :closable="false">
            Your collateral ratio is below the liquidation threshold ({{liquidationThresh}}%)
            </b-message>
            <b-message v-if="progressColor === 'is-warning'" title="Insufficient Collateral" type="is-warning" :closable="false">
            Your collateral ratio is below the collateral requirement ({{creq}}%)
            </b-message>
            <b-button id="withdraw-button" type="is-primary">Withdraw</b-button>
        </section>
    </div>
</template>

<script>
import { ethers } from 'ethers';
export default {
  name: 'Withdraw',
  props:['name', 'currentCollateral', 'cratio', 'creq', 'liquidationThresh'],
  methods:{
      balanceFormat(baseUnit) {
          return ethers.utils.formatEther(baseUnit)
      }
  },
  computed: {
      progressColor () {
          if(this.cratio >= this.creq) {
              return 'is-success'
          } else if(this.cratio >= this.liquidationThresh) {
              return "is-warning"
          } else {
              return "is-danger"
          }
      }
  }
}
</script>

<style scoped>
.body {
    max-width:400px;
    margin:auto;

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
