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

        <hr class="divider">

        <section>
            <b-field label="Deposit Collateral">
                <b-input value="" placeholder="Deposit DAI"></b-input>
            </b-field>
            <b-field label="Mint Synth">
                <b-input value="" :placeholder="'Mint ' + name"></b-input>
            </b-field>
            <b-progress type="is-success" :value="10"></b-progress>
            <b-button id="mint-button" type="is-primary">Mint {{name}}</b-button>
        </section>
    </div>
</template>

<script>
export default {
  name: 'Mint',
  props:['name', 'priceFeed', 'price', 'usdPrice', 'expirationTimestamp', 'creq', 'daiBalance', 'synthBalance'],
  methods:{
      timeFormat (timestamp) {
          return (new Date(timestamp)).toUTCString()
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
</style>
