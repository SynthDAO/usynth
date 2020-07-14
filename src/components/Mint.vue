<template>
    <div class="body">
        <div class="title has-text-centered">
        Mint {{name}}
        </div>
        <div class="level item">
            <div class="level-left">
                <div class="level-item">
                <strong>Price Feed</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                {{priceFeed}}
                </div>
            </div>
        </div>

        <div class="level item">
            <div class="level-left">
                <div class="level-item">
                <strong>Current Index</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                {{price}}
                </div>
            </div>
        </div>

        <div class="level item">
            <div class="level-left">
                <div class="level-item">
                <strong>Expiration</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                {{timeFormat(expirationTimestamp)}}
                </div>
            </div>
        </div>

        <div class="level item">
            <div class="level-left">
                <div class="level-item">
                <strong>Collateral</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                DAI
                </div>
            </div>
        </div>

        <div class="level item">
            <div class="level-left">
                <div class="level-item">
                <strong>Minimum Collateral</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                {{creq}}%
                </div>
            </div>
        </div>

        <div class="level item">
            <div class="level-left">
                <div class="level-item">
                <strong>Liquidation Threshold</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                {{liquidationThresh}}%
                </div>
            </div>
        </div>

        <div class="level item">
            <div class="level-left">
                <div class="level-item">
                <strong>Minimum Minted Tokens</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                {{balanceFormat(minSponsorTokens)}}
                </div>
            </div>
        </div>

        <hr class="divider">

        <section>
            <b-field label="Deposit Collateral">
                <b-input v-model="collateralAmount" placeholder="Deposit DAI"></b-input>
            </b-field>
            <div class="balance">
                <div class="is-pulled-left">
                    Balance: {{balanceFormat(daiBalance)}} DAI
                </div>
            </div>
            <b-field label="Mint Synth">
                <b-input v-model="synthAmount" :placeholder="'Mint ' + name"></b-input>
            </b-field>
            <div class="balance">
                <div class="is-pulled-left">
                    Balance: {{balanceFormat(synthBalance)}} {{name}}
                </div>
            </div>
            <div id="cratio">Collateralization Ratio</div>
            <b-progress :value="cratio" :type="progressColor" :max="Number(creq)" show-value format="percent"></b-progress>
            <b-message v-if="cratio < creq && cratio > 0" title="Insufficient Collateral" type="is-danger" :closable="false">
            Your collateral ratio is below the minimum collateral ({{creq}}%)
            </b-message>
            <b-button :disabled="disabled" @click="mint" id="mint-button" type="is-primary">Mint {{name}}</b-button>
        </section>
    </div>
</template>

<script>
import { ethers } from 'ethers';
export default {
  name: 'Mint',
  props:['name', 'priceFeed', 'price', 'expirationTimestamp', 'creq', 'daiBalance', 'synthBalance', 'liquidationThresh', 'minSponsorTokens'],
  data:()=>{
      return {
          collateralAmount:"",
          synthAmount:""
      }
  },
  methods:{
      timeFormat (timestamp) {
          return (new Date(timestamp*1000)).toUTCString()
      },
      balanceFormat(baseUnit) {
          return ethers.utils.formatEther(baseUnit)
      },
      mint() {
        this.$emit('mint', {
            collateral:this.collateralAmount,
            synth:this.synthAmount,
            synthName:this.name
        })
        this.$emit('close')
      }
  },
  computed: {
      progressColor () {
        if(this.cratio >= this.creq) {
            return 'is-success'
        } else {
            return "is-danger"
        }
      },
      cratio () {
          if(this.collateralAmount === "" || this.synthAmount === "") return 0
          if(isNaN(this.collateralAmount) || isNaN(this.synthAmount)) return 0
          return this.collateralAmount / (this.synthAmount * this.price) * 100 // TODO: Use big numbers
      },
      disabled () {
          if(this.cratio < this.creq) return true
          if(isNaN(this.collateralAmount) || isNaN(this.synthAmount)) return true
          if(this.synthAmount < parseInt(this.balanceFormat(this.minSponsorTokens))) return true
          if(this.collateralAmount > parseInt(this.balanceFormat(this.daiBalance))) return true
          if(this.synthAmount.length === 0 || this.collateralAmount.length === 0) return true
          if(this.synthAmount === 0 || this.collateralAmount === 0) return true
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
.item {
    margin-bottom:20px;
}
.divider {
    border-top: 1px solid #000;
    margin:40px 80px;
}
#mint-button {
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
