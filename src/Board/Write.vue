<template>
  <div class="buttonDiv">
    <button class="wirteBoardButton" @click="moveWirtePage">글쓰기</button>
  </div>
  <div>
   <table class="boardDetailView">
    <!-- <tr>
      <td class="userId">작성자</td>
    </tr> -->
    <tr>
      <td class="WriteTitle">제목</td>
    </tr>
    <tr>
      <td><input type="text" class="inputWriteTitle"></td>
    </tr>
    <tr>
      <td class="WriteContent">내용</td>
    </tr>
    <tr>
      <td><input type="text" class="inputWriteContent"></td>
    </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent} from 'vue';
import axios from 'axios';
export default defineComponent({
  name: 'write-detail',
  setup() {
    const state = reactive({
      title: '',
      content: '',
      userId: 3
    })

    // const postBoard = () =>  axios.get("/api/board/" + state.userId, {
    // }).then((res: any) => {
      
    // }); 

    return {
      state
    }
  }
})
</script>

<style lang="scss"> 
  .WriteContent, .WriteTitle {
    height: 35px;
  }
  .inputWriteTitle {
    height: 35px;
    width: 700px;
    border: none;
  }
  .inputWriteContent {
    height: 150px;
    width: 700px;
    border: none;
  }
  .wirteBoardButton {
    float: right;
  }
</style>