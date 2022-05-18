<template>
  <div class="content">
    <h1 @click="$emit('update-modal')">UserUpdate</h1>
    <form ref = 'el'>
     <table>
        <tr>
          <td>id: <input type="text" :value = 'props.selectedData?.id'></td>
          <td>name:<input type="text" :value = 'props.selectedData?.name' > </td>
          <td>age: <input type="text" :value = 'props.selectedData?.age'></td>
          <td>gender: <input type="text" :value = 'props.selectedData?.gender'></td>
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

export default defineComponent({
  name: 'Content-Popup',
  emits: ['changeData','update:selectedData'],
  props:{
    selectedData: {
      type: Object as PropType<UserData>
    },
    testNumber : {
      type: Number,
    }
  },
  setup(props, context) {
    const el = ref<HTMLElement>();
    const updateUser = () => {
      const {selectedData} = props;
      if (selectedData) {
        context.emit('update:selectedData' ,{
          id: 1234,
          name: 'test',
          age: 33,
          gender: 'female',
        } as UserData);
         context.emit('changeData');
         console.log(selectedData);
      }
     

      // const changeData:UserData = {
      //   id: 1234,
      //   name: 'test',
      //   age: 100,
      //   gender: 'female',
      // };
      // context.emit('changeData', changeData);
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
