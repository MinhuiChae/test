<template>
  <div class = "content">
    <h3>{{$props.alertMsg}}</h3>
  </div>
  <div>
    
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Alert-Popup',
  props:{
   alertMsg: {
     type: String
   }
  }
})
</script>