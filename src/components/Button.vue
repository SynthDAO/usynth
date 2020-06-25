<template>
    <div>
        <b-button v-if="type === 'primary'" style="background:#8182EF" type="is-primary">{{text}}</b-button>
        <b-button v-else>{{text}}</b-button>
    </div>
</template>

<script>
export default {
  name: 'Button',
  props:['type', 'text']
}
</script>

<style scoped>
</style>
