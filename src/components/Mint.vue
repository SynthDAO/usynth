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
                <strong>Current Price</strong>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item is-pulled-right">
                {{price}}
                <br>
                ${{usdPrice}} USD
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
                <strong>Collateral Requirement</strong>
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

        <hr class="divider">

        <section>
            <b-field label="Deposit Collateral">
                <b-input value="" placeholder="Deposit DAI"></b-input>
            </b-field>
            <div class="balance">
                <div class="is-pulled-left">
                    Balance: {{balanceFormat(daiBalance)}} DAI
                </div>
                <div class="is-pulled-right">
                    $0 USD
                </div>
            </div>
            <b-field label="Mint Synth">
                <b-input value="" :placeholder="'Mint ' + name"></b-input>
            </b-field>
            <div class="balance">
                <div class="is-pulled-left">
                    Balance: {{balanceFormat(synthBalance)}} {{name}}
                </div>
                <div class="is-pulled-right">
                    $0 USD
                </div>
            </div>
            <div id="cratio">Collateralization Ratio</div>
            <b-progress type="is-success" :value="10" show-value></b-progress>
            <b-button id="mint-button" type="is-primary">Mint {{name}}</b-button>
        </section>
    </div>
</template>

<script>
import { ethers } from 'ethers';
export default {
  name: 'Mint',
  props:['name', 'priceFeed', 'price', 'usdPrice', 'expirationTimestamp', 'creq', 'daiBalance', 'synthBalance', 'liquidationThresh'],
  methods:{
      timeFormat (timestamp) {
          return (new Date(timestamp)).toUTCString()
      },
      balanceFormat(baseUnit) {
          return ethers.utils.formatEther(baseUnit)
      }
  }
}
</script>

<style scoped>
.body {
    max-width:400px;
    margin:auto;

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
