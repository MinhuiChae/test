<template>

  <div class="boardTitle">{{state.board.title}}</div>
  <div class="buttonDiv">
    <button @click="movePageToList(state.pageNo, state.isVisitedDetailVue)" class="backToListButton">List</button>
    <button @click="movePageToHome()" class="backToHomeButton">Home</button>
  </div>
  <table class="boardDetailView">
    <tr>
      <td class="userId">작성자</td>
      <td>{{state.board.userId}}</td>
    </tr>
    <tr>
      <td class="content">내용</td>
      <td>{{state.board.content}}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted} from 'vue';
import axios from 'axios';
import { IResBoardInform } from '@/interface';
export default defineComponent({
  name:"Detail-view",
  props: {
    pageNo: Number
  },
  setup(props) {
    const userData: IResBoardInform = {
      title: '',
      content: '',
      bbsSeq: 0,
      userId:0
    };

    const state = reactive({
      bbsSeq: 0,
      board: userData  as IResBoardInform,
      pageNo: 0,
      isVisitedDetailVue: true
    })

    const getBoard = () => axios.get("/api/board/" + state.bbsSeq).then((res: any) => {
      state.board = res.data.data as IResBoardInform;
    });

    onMounted(() => {
      getBoard()
    })

    return {
      props,
      state,
    }
  },
  created() {
    this.state.bbsSeq = Number(this.$route.params.bbsSeq)
    this.state.pageNo = Number(this.$route.params.pageNo)
  },
  methods: {
    movePageToList(pageNo: number, isVisitedDetailVue:boolean) {
      window.location.href='/' + pageNo + "/" + isVisitedDetailVue;
    },
    movePageToHome() {
      window.location.href='/'
    }
  }
});
</script>

<style lang="scss">

</style>