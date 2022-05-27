<template>
  <div class="modal">
    <div class="overlay" @click="closeModalFun(props.overlCloseAction)" ></div>
    <div class="modal-card">
      <div v-show = "props.useCloseBtn" @click="closeModalFun(props.useCloseBtn)" class="closeBtn" >닫기</div>
      <slot></slot>
      <div v-show="props.isConfirmModal">
        <button @click="clickDeleteBtn">확인</button>
        <button @click="closeModalFun(props.useCloseBtn)">취소</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';

export default defineComponent({
  name: 'Content-Popup',
  emits: ['closeModal', 'confirmAction'],
  props:{
    useCloseAction: {
      type: Boolean,
      default: false,
    },
    overlCloseAction: {
      type: Boolean,
      default: false,
    },
    useCloseBtn: {
      type: Boolean,
      default: false,
    },
    isConfirmModal: {
      type: Boolean,
      default: false
    },
  },
  setup(props, context) {
    const closeModalFun = (optionBtn: boolean) => {
      if (props.useCloseAction && optionBtn) {
        context.emit('closeModal', closeModalFun)
      }
    }

    const clickDeleteBtn = () => {
      context.emit("confirmAction")
    }

    return {
      props,
      closeModalFun,
      clickDeleteBtn
    }
  },
 
})
</script>
<style lang="scss" scoped>

.modal {
  display: flex;
  width:100%;
  height:100%;
  background: transparent;
  .overlay {
    display: flex;
    width:100%;
    height:100%;
  }

}
</style>