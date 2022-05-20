<template>
  <div class = "content">
    <h3>{{$props.alertMsg}}</h3>
  </div>
  <div>
    
  </div>
</template>
<script lang="ts">
import { defineComponent, } from 'vue'

export default defineComponent({
  name: 'Content-Popup',
  props:{
   alertMsg: {
     type: String
   }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  width:100% !important;
}
</style>
