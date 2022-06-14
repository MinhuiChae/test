<template>

    <div class="boardTitle">BoardList</div>
    <div class="buttonDiv">
      <button class="wirteBoardButton" @click="moveWirtePage">글쓰기</button>
    </div>
    <div class = "container">
    <table class = "userListTable">
      <thead>
        <th>No</th>
        <th>Title</th>    
        <th>Id</th>    
      </thead>
      <tr v-for="board in state.boardList" :key ="board.bbsSeq" class = "dataList" @click="moveDetailPage(board.bbsSeq, state.pageNo)" >
        <td>{{ board.bbsSeq }}</td>
        <td>{{ board.title }}</td>
        <td>{{ board.userId }}</td>
      </tr>
       <!-- <tr v-for="board in state.userLilst" :key ="board.id" class = "dataList">
        <td>{{ board.id }}</td>
        <td>{{ board.name }}</td>
        <td>{{ board.age }}</td>
      </tr> -->
    </table>
  </div>

  <div class="btn-cover">
    <button @click="MinusPageNum">
      이전
    </button>
    <span class=""> 페이지 </span>
    <button @click="plusPageNum">
      다음
    </button>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted} from 'vue';
import { IResBoardInform, IUserData } from "@/interface";
import axios from 'axios';
export { default as detailPage } from './DetailBoard.vue'; 
export default defineComponent({
  name: 'Board-detail',
  setup() {
    const state = reactive({
      boardList: [] as IResBoardInform[],
      userLilst: [] as IUserData[],
      countPerPage: 5,
      pageNo: 1,
      sortBy: 'bbsSeq',
      sortDir: 'asc',
      totalPage: 0,
      bbsSeq:0,
      isVisitedDetailVue:false
    });

    const getBoard = () => axios.get("/api/board/?countPerPage=" + state.countPerPage + "&pageNo="+ state.pageNo + "&sortBy=" + state.sortBy + "&sortDir=" + state.sortDir).then((res: any) => {
      updateList(res)
    }); 

    const getUser = () => axios.get("/api/user").then((res: any) => {
      state.userLilst = res.data.data as IUserData[];
    });

    const updateList = (res: any) => {
      state.boardList.length = 0;
      state.boardList = res.data.data;
      state.totalPage = res.data.totalPage;
      console.log(state.boardList)
    }

    const onChangePageNum = (num: number) => {
      if(state.pageNo > 0 && state.pageNo <= state.totalPage) {
        const changePageNum = state.pageNo + num;
        state.pageNo = changePageNum;
        getBoard()
      }
    }

    const plusPageNum = () => {
      if(state.pageNo < state.totalPage) {
        state.pageNo++;
        console.log(state.pageNo);
        getBoard()
      }
    }

    const MinusPageNum = () => {
      if(state.pageNo > 1) {
        state.pageNo--
        getBoard()
      }
    }
    // const showBoardDeatilApi = (num: number) => {
    //   state.bbsSeq = num;
    //   console.log(state.bbsSeq)
    //   axios.get("/api/board/" + state.bbsSeq).then((res: any) => {
    //     console.log(res.data)
    //   }); 
    // }
    onMounted(() => {
      getBoard(),
      getUser()
    })
    return {
      state,
      onChangePageNum,
      plusPageNum,
      MinusPageNum,
      // showBoardDeatilApi,
    }
  },
  methods: {
    moveDetailPage(bbsSeq: number, pageNo: number) {
      window.location.href='/detail/' + bbsSeq + "/" + pageNo;
    },
    moveWirtePage() {
      window.location.href='/write/' + this.state.totalPage;
    }
  },
  created() {
    this.state.isVisitedDetailVue = Boolean(this.$route.params.isVisitedDetailVue);
    if(this.state.isVisitedDetailVue === true) {
      this.state.pageNo = Number(this.$route.params.pageNo);
    }
  },
})
</script>

<style lang="scss">
  .wirteBoardButton {
    margin-top:60px;
    margin-right: 20px;
    float: right;
  }

</style>