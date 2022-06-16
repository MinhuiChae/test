<template>
    <div class="boardTitle">BoardList</div>
    <div class="buttonDiv">
    <router-link :to="{ name: 'Write', params: { 
      totalPage: state.totalPage,
      curPerPage: state.countPerPage,
      boardListLength: state.boardList.length,
      post: true,
      isValidUser: state.isValidUser,
      userId: state.userId
    }}">
    <button class="backToHomeButton">글쓰기</button>
    </router-link>
    </div>
    <div class = "container">
    <table class = "userListTable">
      <thead>
        <th class="boardListSeq">No (↑)</th>
        <th class="boardListTitle">Title</th>    
        <th class="boardListUserId">Id</th>    
      </thead>
      <tr v-for="board in state.boardList" :key ="board.bbsSeq" class = "dataList" @click="moveDetailPage(board.bbsSeq)" >
        <td>{{ board.bbsSeq }}</td>
        <td>{{ board.title }}</td>
        <td>{{ board.userId }}</td>
      </tr>
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
import { IResBoardInform, IUserData} from "@/interface";
import axios from 'axios';
export { default as detailPage } from './DetailBoard.vue'; 
export default defineComponent({
  name: 'Board-detail',
  setup() {
    const state = reactive({
      boardList: [] as IResBoardInform[],
      userId: 2,
      countPerPage: 5,
      pageNo: 1,
      sortBy: 'bbsSeq',
      sortDir: 'desc',
      totalPage: 0,
      bbsSeq:0,
      isVisitedDetailVue:false,
      userList: [] as IUserData[],
      isValidUser: false,
    });

    const getBoard = () => axios.get("/api/board/?countPerPage=" + state.countPerPage + "&pageNo="+ state.pageNo + "&sortBy=" + state.sortBy + "&sortDir=" + state.sortDir).then((res: any) => {
      updateList(res)
    }); 

    const getUser = () => axios.get("/api/user").then((res: any) => {
      updateUserList(res);
      isValidUser();
    });

    const updateUserList = (res: any) => {
      state.userList = res.data.data as IUserData[];
    }

    const isValidUser = () => {
      if(state.userList.find((user)=> user.id === state.userId)) {
        state.isValidUser = true;
      } else {
        state.isValidUser = false;
      }
    }

    const updateList = (res: any) => {
      state.boardList.length = 0;
      state.boardList = res.data.data;
      state.totalPage = res.data.totalPage;
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

    onMounted(() => {
      getBoard(),
      getUser()
    })
    return {
      state,
      onChangePageNum,
      plusPageNum,
      MinusPageNum,
      isValidUser
    }
  },
  methods: {
    moveDetailPage(bbsSeq: number) {
      window.location.href='/detail/' + bbsSeq + "/" + this.state.pageNo + "/" + this.state.userId + "/" + this.state.isValidUser;
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
  .boardListSeq {
    width: 30%;
  }
  .boardListTitle {
    width: 40%;
  }
  .boardListUserId {
    width: 30%;
  }

</style>