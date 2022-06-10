<template>
  <div class = "container">
    <table class = "userListTable">
      <thead>
        <th>No</th>
        <th>Title</th>    
        <th>Name</th>    
      </thead>
      <tr v-for="board in state.boardList" :key ="board.title">
        <td>{{ state.bbsSeq }}</td>
        <td>{{ board.title }}</td>
        <td>{{ state.name }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted} from 'vue';
import { IBoardInform } from "@/interface";
import axios from 'axios';

export default defineComponent({
  name: 'Board-view',
  setup() {
    // const board: IBoardInform = {
    //   title: "",
    //   content: ""
    // }

    const state = reactive({
      boardList: [] as IBoardInform[],
      bbsSeq: 0,
      name: '',
      countPerPage: 5,
      pageNo: 1,
      sortBy: 'bbsSeq',
      sortDir: 'asc'
    });

    const getBoard = () => axios.get("/api/board/?" + state.countPerPage + "&"+ state.pageNo + "&" + state.sortBy + "&" + state.sortDir).then((res: any) => {
      updateList(res)
    }); 

    const updateList = (res: any) => {
      state.boardList = res.data.data;
      state.bbsSeq = res.data.data.bbsSeq;
      console.log(res.data)
    }

    onMounted(() => {
      getBoard()
    })
    return {
      state,

    }
  }
})
</script>
