<template>

  <div class="boardTitle">{{state.board.title}}</div>
  <div class="buttonDiv">
    <button @click="movePageToList(state.pageNo, state.isVisitedDetailVue)" class="backToListButton">리스트</button>
    <button @click="movePageToHome()" class="backToHomeButton">Home</button>
    <button @click="movePageToUpdate()" class="backToHomeButton">수정</button>
    <button @click="deleteBoard" class="backToHomeButton">삭제</button>
  </div>
  <table class="boardDetailView">
    <tr>
      <td class="userId">작성자</td>
      <td class="stateUserId">{{state.board.userId}}</td>
    </tr>
    <tr>
      <td class="content">내용</td>
      <td class="stateContent"> {{state.board.content}}</td>
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

    const deleteBoard = () => axios.delete("/api/board/" + state.bbsSeq).then((res: any) => {
      alert(res.data.msg)
      window.location.href = "/"
    });

    onMounted(() => {
      getBoard()
    })

    return {
      props,
      state,
      deleteBoard
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
    },
    movePageToUpdate() {
      window.location.href = "/Write"
    }
  }
});
</script>

<style lang="scss">
.boardDetailView {
  width: 80%;
  border: 1px solid #E1E1E1;
  border-collapse: collapse;
  margin-left: 150px;
  margin-top: 100px;
}
.userId, .content {
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
  width: 30%;
}
.stateUserId, .stateContent {
  border-bottom: 1px solid gray;
}
</style>