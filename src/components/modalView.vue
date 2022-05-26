<template>
  <div class="modal">
    <div class="overlay" @click="closeModalFun(props.closebtn, props.overlCloseAction)" ></div>
    <div class="modal-card">
      <div style="float: right" @click="closeModalFun(props.closebtn, props.useCloseBtn)">닫기</div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';

export default defineComponent({
  name: 'Content-Popup',
  emits: ['closeModal'],
  props:{
    closebtn: Boolean,
    overlCloseAction: Boolean,
    useCloseBtn: Boolean
  },
  setup(props, context) {
    const closeModalFun = (closeBtn:boolean, optionBtn: boolean) => {
      if(closeBtn && optionBtn) {
        context.emit('closeModal', closeModalFun)
      } 
    }
    return {
      props,
      closeModalFun
    }
  },
})
</script>