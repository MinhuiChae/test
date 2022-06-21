<template>
    <div class="boardTitle" @click.stop="onMoveHomePage()">BoardList</div>
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
      <th v-for="board in boardListTitle" :key ="board.name" :class="board.class" @click.stop="onSort(board.name)">
        {{ board.title }} 
        <p class="sorting" v-if="decideSortItem(board.name)">{{ getSortIcon }}</p>
      </th> 
      <tr v-for="board in state.boardList" :key ="board.bbsSeq" class = "dataList" @click.stop="onMoveDetailPage(board.bbsSeq)" >
        <td>{{ board.bbsSeq }}</td>
        <td >{{ board.title }} ({{ getOwnReplyLength(board.bbsSeq) }})</td>
        <td>{{ board.userId }}</td>
      </tr>
    </table>
  </div>

  <div class="btn-cover">
    <button @click.stop="onMinusPageNum" :class="{'disabled': !canPrevPage, 'page-btn': canPrevPage}">
      이전
    </button>
    <span> {{ state.pageNo }} / {{ state.totalPage }} 페이지 </span>
    <button @click.stop="onPlusPageNum" :class="{'disabled': !canNextPage, 'page-btn': canNextPage}">
      다음
    </button>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, computed} from 'vue';
import { IResBoardInform, IUserData, ESortDir, IBoardInputInform, IResReplyInform, IResInform} from "@/interface";
import axios from 'axios';
import { useRoute } from 'vue-router';

export { default as detailPage } from './DetailBoard.vue'; 
export default defineComponent({
  name: 'Board-detail',
  setup() {
    const route = useRoute();
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
      sortIcon: '(-)',
      replyLength: [] as IResReplyInform[],
      replyList: [] as IResReplyInform[]
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
        const url = `/api/board/?countPerPage=${state.countPerPage}&pageNo=${state.pageNo}&sortBy=${state.sortBy}&sortDir=${state.sortDir}`;
        axios.get(url).then((res: any) => {
          updateList(res.data);
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
        
    const changeDirInform = () => {
      if (state.sortDir === ESortDir.ORIGIN) {
        state.sortDir = ESortDir.ASC;
      } else if (state.sortDir === ESortDir.ASC) {
        state.sortDir = ESortDir.DESC;
      } else {
        state.sortDir = ESortDir.ORIGIN;
      }
    }

    const onSort = (sortBy: string) => {
      if (state.sortBy === sortBy) {
        changeDirInform();
      } else {
        state.sortDir = ESortDir.ASC;
      }

      state.sortBy = sortBy;
      getBoard();
    }

    // 위에 처럼 변경
    const getUser = () => {
      try{        
        const url = "/api/user";
        axios.get(url).then((res: any) => {
          updateUserList(res);
          checkValidUser();
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const updateUserList = (res: any) => {
      state.userList = res.data.data as IUserData[];
    }

    const checkValidUser = () => {
      state.isValidUser = state.userList.find((user)=> user.id === state.userId) === undefined ? false : true;
    }


    const updateList = (res: IResInform) => {
      state.boardList.length = 0;
      state.boardList = res.data as IResBoardInform[];
      if(res.replyList) state.replyList = res.replyList;
      if(res.totalPage)state.totalPage = res.totalPage === 0 ? 1 : res.totalPage;
    }

    const getOwnReplyLength = (bbsSeq: number): number => {
      let getReply:IResReplyInform[] = [];
      state.replyList.forEach((reply) => {
        if(reply.bbsSeq === bbsSeq) getReply.push(reply)
      });

      return getReply.length;
    }

    const onPlusPageNum = () => {
      state.pageNo < state.totalPage ? state.pageNo ++ : state.pageNo;
      getBoard();
    }

    const onMinusPageNum = () => {
      state.pageNo > 1 ? state.pageNo -- : state.pageNo;
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

    const onMoveDetailPage = (bbsSeq: number) => {
      window.location.href=`/detail/${bbsSeq}/${state.pageNo}/${state.userId}/${state.isValidUser}/${state.sortBy}/${state.sortDir}`;
    }

    const onMoveHomePage = () => {
      window.location.href='/';
    }
    
    onMounted(() => {
      initRouteParam();
      getBoard(),
      getUser();
    })

    return {
      state,
      onPlusPageNum,
      onMinusPageNum,
      checkValidUser,
      onSort,
      decideSortItem,
      canPrevPage,
      canNextPage,
      boardListTitle,
      onMoveDetailPage,
      onMoveHomePage,
      getSortIcon,
      getOwnReplyLength,
    }
  }
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