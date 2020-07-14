<template>
  <div>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    id="logo"
                    src="/img/logo.svg"
                    alt="SynthSwap Home"
                >
            </b-navbar-item>
        </template>
        <template slot="start">
            <!--
            <b-navbar-item href="/" >
                Positions
            </b-navbar-item>
            <b-navbar-item href="/swap">
                Swap
            </b-navbar-item>
            <b-navbar-item href="/pool">
                Pool
            </b-navbar-item
            -->
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div v-if="!authed" class="buttons">
                    <a @click="$emit('connect')" class="button is-primary">
                        <strong>Connect Wallet</strong>
                    </a>
                </div>
                <div v-else>
                    <div id="address">
                    <b-tag
                        type="is-success"
                        rounded>
                        Connected
                    </b-tag>
                    {{shortAddress}}
                    </div>
                    <div id="network">
                    {{network}}
                    </div>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props:['authed', 'address', 'network'],
  computed: {
      shortAddress () {
          return this.address.slice(0, 6) + '...' + this.address.slice(38, 42)
      }
  }
}
</script>

<style lang="scss" scoped>
#logo {
    height:100%;
}
#address {
    font-size:15px;
}
#network {
    float:right;
    font-size:13px;
}
</style>
