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
        <p class="sorting" v-if="decideSortItem(board.name)">{{ state.sortIcon }}</p>
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
import { IResBoardInform, IUserData, ESortDir, EBoardSortType, IBoardInputInform} from "@/interface";
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

    const getBoard = () => axios.get("/api/board/?countPerPage=" + state.countPerPage + "&pageNo="+ state.pageNo + "&sortBy=" + state.sortBy + "&sortDir=" + state.sortDir).then((res: any) => {
      decideSortIcon(state.sortDir);
      changeDirInform();
      updateList(res);
    }); 

    const changeDirInform = () => {
      getDirInfomFromDetailPage(ESortDir.ASC, 1);
      getDirInfomFromDetailPage(ESortDir.DESC, 2);
    }

    const getDirInfomFromDetailPage = (sortDir: ESortDir, num: number) => {
      if(state.sortDir === sortDir) {
        if(state.sortBy === EBoardSortType.BBSSEQ) {
          state.sortBbsSeqCnt = num;
        } else if(state.sortBy === EBoardSortType.TITLE) {
          state.sortTitleCnt = num;
        } else if(state.sortBy === EBoardSortType.USERID) {
          state.sortUserIdCnt = num;
        }
      }
    }

    const decideDirByCnt = (sortNum: number, num:number) => {
      if(sortNum % num === 1) {
        state.sortDir = ESortDir.ASC
      } else if(sortNum % num === 2) {
        state.sortDir = ESortDir.DESC
      } else if(sortNum % num === 0) {
        state.sortDir = ESortDir.ORIGIN
      }
    }

    const decideSortItem = (sortBy: string): boolean => {
      if(state.sortBy === sortBy) {
        return true;
      } else {
        return false;
      }
    }

    const decideSortIcon = (Dir: string) => {
      if(Dir === ESortDir.ASC) {
        state.sortIcon = '(↑)'
      } else if(Dir === ESortDir.DESC) {
        state.sortIcon = '(↓)'
      } else if(Dir === ESortDir.ORIGIN) {
        state.sortIcon = '(-)'
      }
    }

    const sort = (sortBy: string) => {
      state.sortBy = sortBy;
      if(state.sortBy === EBoardSortType.BBSSEQ) {
        state.sortBbsSeqCnt++;
        decideDirByCnt(state.sortBbsSeqCnt, 3);
      } else if(state.sortBy === EBoardSortType.TITLE) {
        state.sortTitleCnt++;
        decideDirByCnt(state.sortTitleCnt, 3);
      } else if(state.sortBy === EBoardSortType.USERID) {
        state.sortUserIdCnt++;
        decideDirByCnt(state.sortUserIdCnt, 3);
      }
      getBoard();
    }

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
      if(state.totalPage === 0) {
        state.totalPage = 1;
      }
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
        getBoard()
      }
    }

    const MinusPageNum = () => {
      if(state.pageNo > 1) {
        state.pageNo--
        getBoard()
      }
    }

    const isActiveNextButton = (num: number):boolean => {
      if(num >= state.totalPage ) {
        return false;
      } else {
        return true;
      }
    }

    const isActivePrevButton = (num: number):boolean => {
      if(num <= 1) {
        return false;
      } else {
        return true;
      }
    }

    const canPrevPage = computed(() => isActivePrevButton(state.pageNo));
    const canNextPage = computed(() => isActiveNextButton(state.pageNo));

    onMounted(() => {
      getBoard(),
      getUser()
    })

    return {
      state,
      onChangePageNum,
      plusPageNum,
      MinusPageNum,
      isValidUser,
      sort,
      decideSortItem,
      canPrevPage,
      canNextPage,
      boardListTitle
    }
  },
  methods: {
    moveDetailPage(bbsSeq: number) {
      window.location.href='/detail/' + bbsSeq + "/" + this.state.pageNo + "/" + this.state.userId + "/" + this.state.isValidUser + "/" + this.state.sortBy + "/" + this.state.sortDir;
    },
    moveHomePage() {
      window.location.href='/'
    }
  },
  created() {
    this.state.isVisitedDetailVue = Boolean(this.$route.params.isVisitedDetailVue);
    if(this.state.isVisitedDetailVue === true) {
      this.state.pageNo = Number(this.$route.params.pageNo);
      this.state.sortBy = String(this.$route.params.sortBy);
      this.state.sortDir = String(this.$route.params.sortDir);
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