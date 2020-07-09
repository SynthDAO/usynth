<template>
  <div>
    <Positions :synths="this.$store.state.synths"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Positions from '@/screens/Positions.vue'

export default {
  name: 'Home',
  components: {
    Positions
  }
}
</script>
