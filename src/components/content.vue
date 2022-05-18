<template>
  <div class="content">
    <h1 @click="$emit('update-modal')">UserUpdate</h1>
    <form ref = 'el'>
     <table>
        <tr>
          <td>id: <input type="text" name="userId" :value = 'props.selectedData.id'></td>
          <td>name:<input type="text" name="userName" :value = 'props.selectedData.name' > </td>
          <td>age: <input type="text" name="userAge" :value = 'props.selectedData.age'></td>
          <td>gender: <input type="text" name="userGender" :value = 'props.selectedData.gender'></td>
        </tr>
      </table>
    </form>    
  </div>
  <div>
    <button class="btn btn-primary" @click.stop="updateUser">update</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import {UserData} from '../App.vue';
type aa = HTMLInputElement | HTMLTextAreaElement;
const a = <T extends aa>(element: T): any => {
  return element.value;
}

export default defineComponent({
  name: 'Content-Popup',
  emits: ['changeData'],
  props:{
    selectedData: {
      type: Object as PropType<UserData>
    }
  },
  setup(props, context) {
    const el = ref<HTMLFormElement>();

    const updateUser = () => {
      const elements = el.value?.elements;
      if (elements ){
        [...elements].forEach(element => {
          console.log(element.getAttribute("name"));
          const v = a(element as aa);
          console.log(v);
        });
      }
      
      context.emit('changeData', )
    }

    return {
      props,
      updateUser,
      el,
    }

  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  width:100% !important;
}
</style>
