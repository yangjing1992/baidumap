<template>
  <div id="app">
    <mapVue />
  </div>
</template>

<script>
import mapVue from './components/map.vue'

export default {
  name: 'App',
  components: {
    mapVue
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html,body,#app{
  margin: 0;
  height: 100%;
}
</style>
