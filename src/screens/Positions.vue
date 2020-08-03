<template>
  <div class="has-text-centered">
    <div class="title">
      Synths
    </div>
    <div v-if="!authed" class="subtitle">
      Connect your wallet to see available Synths.
    </div>
    <b-table v-if="synthsArray.length > 0" :data="synthsArray">
      <template slot-scope="s">
        <b-table-column field="symbol" label="Name">
            {{ s.row.symbol }}
        </b-table-column>
        <b-table-column field="price" label="Index Price">
            {{ s.row.price }}
        </b-table-column>
        <b-table-column field="balance" label="Balance">
            {{ balanceFormat(s.row.synthBalance) }}
        </b-table-column>
        <b-table-column field="saferatio" label="GCR">
            {{ s.row.creq }}%
        </b-table-column>
        <b-table-column field="creq" label="C. Req.">
            {{ s.row.liquidationThresh }}%
        </b-table-column>
        <b-table-column field="action" label="Action">
          <b-dropdown aria-role="list">
            <button slot="trigger" slot-scope="{ active }">
                <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
            </button>
            <b-dropdown-item @click="showMintModal(s.row.name)" aria-role="listitem">Mint</b-dropdown-item>
            <b-dropdown-item @click="goToPool(s.row.name)" aria-role="listitem">Trade</b-dropdown-item>
            <b-dropdown-item v-if="s.row.isExpired" @click="$emit('redeemExpired', s.row.name)" aria-role="listitem">Redeem Expired</b-dropdown-item>
          </b-dropdown>
        </b-table-column>
      </template>
    </b-table>
    <div class="title">
      My Positions
    </div>
    <div v-if="!authed" class="subtitle">
      Connect your wallet to mint tokens and see your positions.
    </div>
    <div v-if="authed && (!positions || positions.length === 0)" class="subtitle">
      You have no open positions. Try minting a synth!
    </div>
    <b-table v-else :data="positions">
      <template slot-scope="props">
        <b-table-column field="name" label="Name">
            {{ props.row.symbol }}
        </b-table-column>
        <b-table-column field="price" label="Index Price">
            {{ props.row.price }}
        </b-table-column>
        <b-table-column field="amount" label="Amount">
            {{ balanceFormat(props.row.amount) }}
        </b-table-column>
        <b-table-column field="collateral" label="Collateral (Ratio)">
            {{ balanceFormat(props.row.collateral) }} {{props.row.collateralSymbol}} ({{ props.row.cratio }}%)
        </b-table-column>
        <b-table-column field="saferatio" label="Safe Ratio">
            {{ props.row.creq }}%
        </b-table-column>
        <b-table-column field="creq" label="C. Req.">
            {{ props.row.liquidationThresh }}%
        </b-table-column>
        <b-table-column field="pending" label="Pending">
            {{ props.row.pending }}
        </b-table-column>
        <b-table-column field="action" label="Action">
            <b-dropdown aria-role="list">
              <button slot="trigger" slot-scope="{ active }">
                  <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
              </button>
              <b-dropdown-item @click="showMintModal(props.row.name)" aria-role="listitem">Mint</b-dropdown-item>
              <b-dropdown-item @click="showWithdrawModal(props.index)" aria-role="listitem">Withdraw</b-dropdown-item>
              <b-dropdown-item @click="goToPool(props.row.name)" aria-role="listitem">Trade</b-dropdown-item>
              <b-dropdown-item v-if="props.row.withdrawalReady" @click="$emit('confirmWithdrawal', props.row.name)" aria-role="listitem">Complete Withdrawal</b-dropdown-item>
              <b-dropdown-item v-if="props.row.pendingWithdrawal" @click="$emit('cancelWithdrawal', props.row.name)" aria-role="listitem">Cancel Withdrawal</b-dropdown-item>
          </b-dropdown>
        </b-table-column>
      </template>
    </b-table>
    <b-dropdown aria-role="list">
        <button :disabled="Object.keys(synths).length === 0" class="button is-primary" size="is-medium" slot="trigger">
            Mint a Synth
        </button>
        <b-dropdown-item v-for="(synth, key) in synths" :key="key" @click='showMintModal(key)' aria-role="listitem">{{synth.symbol}}</b-dropdown-item>
    </b-dropdown>
    <footer class="footer">
      <p><a href="https://github.com/SynthDAO/usynth">Github</a> | <a href="https://discord.gg/CfX6rdS">Discord</a> | <a href="https://docs.umaproject.org/synthetic-tokens/explainer/">UMA Synths</a></p>
      <p><em><small>Disclaimer: this frontend is in beta and has not been audited. Smart contracts by UMA Protocol. Use at your own risk.</small></em></p>
  </footer>
  </div>
</template>

<script>
import Mint from '../components/Mint';
import Withdraw from '../components/Withdraw';
import { ethers } from 'ethers'

export default {
  name: 'Positions',
  props:['positions', 'synths', 'authed'],
  computed: {
    synthsArray () {
      return Object.entries(this.synths)
        .map((synth) => {
          let name = synth[0]
          synth = synth[1]
          synth.name = name
          return synth
        })
    }
  },
  methods:{
    showMintModal(synthKey) {
      const synth = this.synths[synthKey]
      synth.name = synthKey
      let pendingWithdrawal = this.positions
      .filter((p) => p.name === synthKey)
      .reduce((prev, curr) => prev === true || curr.pendingWithdrawal, false)
      if(pendingWithdrawal) {
        this.$buefy.snackbar.open({
          message: 'Please cancel or confirm the pending withdrawal to mint this synth',
          type: 'is-danger',
          position: 'is-top'
        })
        return
      }
      const self = this
      this.$buefy.modal.open({
        parent: this,
        component: Mint,
        trapFocus: true,
        fullScreen:true,
        customClass:"modal",
        props:{
          ...synth
        },
        events:{
          mint({collateral, synth, synthName}){
            self.$emit('mint', {collateral, synth, synthName})
          }
        }
      })
    },
    showWithdrawModal(index) {
      let position = this.positions[index]
      const synth = this.synths[position.name]
      position.liquidationThresh = synth.liquidationThresh
      position.price = synth.price
      position.collateralSymbol = synth.collateralSymbol
      const self = this
      this.$buefy.modal.open({
        parent: this,
        component: Withdraw,
        trapFocus: true,
        fullScreen:true,
        customClass:"modal",
        props:{
          ...position
        },
        events:{
          withdraw({collateral, synthName}){
            self.$emit('withdraw', {collateral, synthName})
          }
        }
      })
    },
    goToPool(synthKey) {
      const synth = this.synths[synthKey]
      var win = window.open(synth.pool, '_blank');
      win.focus();
    },
    balanceFormat(baseUnit) {
      try {
        return ethers.utils.formatEther(baseUnit)
      } catch(e) {
        return 0
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-top:50px;
  margin-bottom:50px !important;
}
.subtitle {
  margin-bottom:100px !important;
}
.button {
  display:block;
  margin:auto;
  margin-top:40px;
  min-width:300px;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 20px;
    background:#f9fafb;
}
</style>
