<template>
  <div class="has-text-centered">
    <div class="title">
      My Positions
    </div>
    <div v-if="!positions || positions.length === 0" class="subtitle">
      You have no open positions. Try minting a synth!
    </div>
    <b-table v-else :data="positions">
      <template slot-scope="props">
        <b-table-column field="name" label="Name">
            {{ props.row.name }}
        </b-table-column>
        <b-table-column field="amount" label="Amount">
            {{ props.row.amount }}
        </b-table-column>
        <b-table-column field="collateral" label="Collateral">
            {{ props.row.collateral }} DAI
        </b-table-column>
        <b-table-column field="cratio" label="C. Ratio">
            {{ props.row.cratio }}
        </b-table-column>
        <b-table-column field="creq" label="C. Req.">
            {{ props.row.creq }}
        </b-table-column>
        <b-table-column field="pending" label="Pending">
            {{ props.row.pending }}
        </b-table-column>
        <b-table-column field="action" label="Action">
            <div class="position-action">mint</div> | <div class="position-action">withdraw</div> | <div class="position-action">trade</div>
        </b-table-column>
      </template>
    </b-table>
    <b-dropdown aria-role="list">
        <button :disabled="synths.length === 0" class="button is-primary" size="is-medium" slot="trigger">
            Mint a Synth
        </button>
        <b-dropdown-item v-for="(synth, key) in synths" :key="key" @click='showMintModal(key)' aria-role="listitem">{{key}}</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import Mint from '../components/Mint';
export default {
  name: 'Positions',
  props:['positions', 'synths'],
  data () {
    return {
      columns: [
        {
            field: 'name',
            label: 'Name',
        },
        {
            field: 'amount',
            label: 'Amount',
        },
        {
            field: 'collateral',
            label: 'Collateral',
        },
        {
            field: 'cratio',
            label: 'C. Ratio',
        },
        {
            field: 'creq',
            label: 'C. Req.',
        },
        {
            field: 'pending',
            label: 'Pending',
        }
      ]
    }
  },
  methods:{
    showMintModal(synthKey) {
      const synth = this.synths[synthKey]
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
          mint({collateral, synth}){
            alert(collateral, synth)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-top:100px;
  margin-bottom:100px !important;
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
.position-action {
  display: inline;
  cursor:pointer;
}
</style>
