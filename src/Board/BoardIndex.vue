<template>
<router-view/>
</template>

<script lang="ts">

export default ({
  name: 'Board-view',
})
</script>

<style lang="scss">
.text-align-center {
  text-align: center;
}
.btn-cover {
  margin-top: 1.5rem;
  text-align: center;
}
.btn-cover .page-btn {
  letter-spacing: 0.5px;
}
.btn-cover .page-count {
  padding: 0 1rem;
}

.disabled {
  width:100px;
  height:35px;
  border:0px;
  margin:0px;
  background-color: gray;
  color:#000;
}

</style>
