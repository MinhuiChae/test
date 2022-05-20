<template>
  <div class = "content">
    <form ref = 'el'>
      <h1 v-if="updateModal === true" >UserUpdate</h1>
      <h1 v-if="addModal === true" >UserAdd</h1>
     <table>
        <tr>
          <td v-if="updateModal === true">id: <input type="number" name="id" :value = 'props.selectedData?.id' readonly></td>
          <td v-if="addModal === true">id: <input type="number" name="id" :value = 'props.selectedData?.id'></td>
          <td>name:<input type="text" name="name" :value = 'props.selectedData?.name' > </td>
          <td>age: <input type="number" name="age" :value = 'props.selectedData?.age'></td>
          <td>gender: <input type="text" name="gender" :value = 'props.selectedData?.gender'></td>
        </tr>
      </table>
    </form>    
  </div>
  <div>
    <button class="btn btn-primary" @click.stop="changeUser" v-if="updateModal === true">update</button>
    <button class="btn btn-primary" @click.stop="changeUser" v-if="addModal === true">add</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import {UserData} from '../App.vue';
type aa = HTMLInputElement | HTMLTextAreaElement;
const a = <T extends aa>(element: T): string => {
  return element.value;
}

export default defineComponent({
  name: 'Content-Popup',
  emits: ['changeData'],
  props:{
    selectedData: {
      type: Object as PropType<UserData>
    },
    updateModal: {
      type: Boolean
    },
    addModal: {
      type: Boolean
    }
  },
  setup(props, context) {
    const el = ref<HTMLFormElement>();
    const changeUserData: UserData = Object.assign({}, props.selectedData);

    const setProperty = <T, K extends keyof T> (obj: T , key: K, value: T[K]) => {
      obj[key] = value;
    }
    
    const changeUser = () => {
      const elements = el.value?.elements;
      if (elements ){
        [...elements].forEach(element => {
          const namesText = element.getAttribute("name");
          let v: string | number = a(element as aa);
          if (typeof changeUserData[namesText as keyof UserData] === 'number') {
            v = parseInt(v as string);
          } 
          setProperty(changeUserData, namesText as keyof UserData, v);
        });
      }
      context.emit('changeData', changeUserData);
    }
    return {
      props,
      changeUser,
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
