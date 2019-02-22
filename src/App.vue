<template>
  <div id="app"  >
    <router-view/>
  </div>
</template>

<script>
  import router from './router'
  export default {
    name: 'App',
    data() {
      return {
        routes: router.options.routes
      }
    },
    comments: {},
  }
</script>

<style>

</style>
