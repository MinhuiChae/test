<template>
    <div class="boardTitle" @click="moveHomePage()">BoardList</div>
    <div class="buttonDiv">
    <router-link :to="{ name: 'Write', params: { 
      totalPage: state.totalPage,
      curPerPage: state.countPerPage,
      boardListLength: state.boardList.length,
      post: true,
      isValidUser: state.isValidUser,
      userId: state.userId,
      sortBy: state.sortBy,
      sortDir: state.sortDir
    }}">
    <button class="backToHomeButton">글쓰기</button>
    </router-link>
    </div>
    <div class = "container">
    <table class = "userListTable">
      <th v-for="board in boardListTitle" :key ="board.name" :class="board.class" @click.stop="sort(board.name)">
        {{ board.title }} 
        <p class="sorting" v-if="decideSortItem(board.name)">{{ getSortIcon }}</p>
      </th> 
      <tr v-for="board in state.boardList" :key ="board.bbsSeq" class = "dataList" @click="moveDetailPage(board.bbsSeq)" >
        <td>{{ board.bbsSeq }}</td>
        <td>{{ board.title }}</td>
        <td>{{ board.userId }}</td>
      </tr>
    </table>
  </div>

  <div class="btn-cover">
    <button @click="MinusPageNum" :class="{'disabled': !canPrevPage, 'page-btn': canPrevPage}">
      이전
    </button>
    <span> {{ state.pageNo }} / {{ state.totalPage }} 페이지 </span>
    <button @click="plusPageNum" :class="{'disabled': !canNextPage, 'page-btn': canNextPage}">
      다음
    </button>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, computed} from 'vue';
import { IResBoardInform, IUserData, ESortDir, IBoardInputInform} from "@/interface";
import axios from 'axios';
import { useRoute } from 'vue-router';

export { default as detailPage } from './DetailBoard.vue'; 
export default defineComponent({
  name: 'Board-detail',
  setup() {

    const route = useRoute();
    const state = reactive({
      boardList: [] as IResBoardInform[],
      userId: 3,
      countPerPage: 5,
      pageNo: 1,
      sortBy: 'bbsSeq',
      sortDir: 'origin',
      totalPage: 1,
      bbsSeq:0,
      isVisitedDetailVue:false,
      userList: [] as IUserData[],
      isValidUser: false,
      sortBbsSeqCnt:0,
      sortTitleCnt:0,
      sortUserIdCnt:0,
      sortIcon: '(-)',
      isAlreadySorted: false
    });

    const boardListTitle : IBoardInputInform[] = [
      {
        name: 'bbsSeq',
        title: 'No ',
        class: 'boardListSeq'
      },
      {
        name: 'title',
        title: 'Title  ',
        class: 'boardListTitle'
      },
      {
        name: 'userId',
        title: 'Id ',
        class: 'boardListUserId'
      }
    ]

    const getBoard = () => {
      try{        
        const url = "/api/board/?countPerPage=" + state.countPerPage + "&pageNo="+ state.pageNo + "&sortBy=" + state.sortBy + "&sortDir=" + state.sortDir;
        axios.get(url).then((res: any) => {
          // changeDirInform();
          updateList(res);
        }); 
      } catch(err) {
        console.error(err);
      }
    }
    

    const decideSortItem = (sortBy: string): boolean => {
      return state.sortBy === sortBy ? true : false;
    }

    const getSortIcon = computed(() => {
      let iconStr = '(-)';
      switch(state.sortDir) {
        case ESortDir.ASC:
          iconStr = '(↑)';
          break;
        case ESortDir.DESC:
          iconStr = '(↓)';
          break;
      }
      return iconStr;
    });
        

    const sort = (sortBy: string) => {
      if (state.sortBy === sortBy) {
        if (state.sortDir === ESortDir.ORIGIN) {
          state.sortDir = ESortDir.ASC;
        } else if (state.sortDir === ESortDir.ASC) {
          state.sortDir = ESortDir.DESC;
        } else {
          state.sortDir = ESortDir.ORIGIN;
        }
      } else {
        state.sortDir = ESortDir.ORIGIN;
      }

      state.sortBy = sortBy;
      getBoard();
    }

    // 위에 처럼 변경

    const getUser = () => axios.get("/api/user").then((res: any) => {
      updateUserList(res);
      isValidUser();
    });

    const updateUserList = (res: any) => {
      state.userList = res.data.data as IUserData[];
    }

    const isValidUser = () => {
      state.isValidUser = state.userList.find((user)=> user.id === state.userId) === undefined ? false : true;
    }


    const updateList = (res: any) => {
      state.boardList.length = 0;
      state.boardList = res.data.data;
      state.totalPage = res.data.totalPage === 0 ? 1 : res.data.totalPage;
    }

    const plusPageNum = () => {
      state.pageNo < state.totalPage ? state.pageNo ++ : state.pageNo
      getBoard()
    }

    const MinusPageNum = () => {
      state.pageNo > 1 ? state.pageNo -- : state.pageNo
      getBoard();
    }

    // 3 항 연산자
    const isActiveNextButton = (num: number):boolean => {
      return num >= state.totalPage ? false : true;
    }
    
    // 한줄로
    const isActivePrevButton = (num: number):boolean => {
      return num <= 1 ? false : true;
    }

    const canPrevPage = computed(() => isActivePrevButton(state.pageNo));
    const canNextPage = computed(() => isActiveNextButton(state.pageNo));

    const initRouteParam = () => {
      if (route.params.isVisitedDetailVue) {
        state.pageNo = Number(route.params.pageNo);
        state.sortBy = String(route.params.sortBy);
        state.sortDir = String(route.params.sortDir);
      }
    }

    const moveDetailPage = (bbsSeq: number) => {
      // `` 처리하게 변경
      window.location.href='/detail/' + bbsSeq + "/" + state.pageNo + "/" + state.userId + "/" + state.isValidUser + "/" + state.sortBy + "/" + state.sortDir;
    }

    const moveHomePage = () => {
      window.location.href='/';
    }
    
    onMounted(() => {
      initRouteParam();
      getBoard(),
      getUser();
    })


    return {
      state,
      plusPageNum,
      MinusPageNum,
      isValidUser,
      sort,
      decideSortItem,
      canPrevPage,
      canNextPage,
      boardListTitle,
      moveDetailPage,
      moveHomePage,
      getSortIcon
    }
  },
  created() {
    // alert(this.$route.params.isVisitedDetailVue);
    // this.state.isVisitedDetailVue = Boolean(this.$route.params.isVisitedDetailVue);
    
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
    height: 55px;
  }
  .boardListTitle {
    width: 40%;
  }
  .boardListUserId {
    width: 30%;
  }
  .sorting{
    display: inline-block;
  }
  .boardListDiv {
    text-align: center;
  }

</style>