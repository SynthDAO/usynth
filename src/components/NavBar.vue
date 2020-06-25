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
            <b-navbar-item href="/" >
                Positions
            </b-navbar-item>
            <b-navbar-item href="/swap">
                Swap
            </b-navbar-item>
            <b-navbar-item href="/pool">
                Pool
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Connect Wallet</strong>
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>

<style lang="scss" scoped>
#logo {
    height:100%;
}
</style>
