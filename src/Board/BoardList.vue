<template>
    <div class="boardTitle" @click.stop="onMoveHomePage()">BoardList</div>
    <div class="buttonDiv">
    <router-link :to="{ name: 'Write', params: { 
      totalPage: state.totalPage,
      curPerPage: state.countPerPage,
      boardListLength: state.boardList.length,
      post: true,
      userId: state.userId,
      sortBy: state.sortBy,
      sortDir: state.sortDir
    }}">
    <button class="backToHomeButton" v-if="canWriteBoard()">글쓰기</button>
    </router-link>
    </div>
    <div class = "container">
    <table class = "userListTable">
      <th v-for="column in columnList" :key ="column.name" :class="column.class" @click.stop="onSort(column.name)">
        {{ column.title }} 
        <p class="sorting" v-if="isPresentSortItem(column.name)">{{ getSortIcon }}</p>
      </th> 
      <tr v-for="board in state.boardList" :key ="board.bbsSeq" class = "dataList" @click.stop="onMoveDetailPage(board.bbsSeq)" >
        <td>{{ board.bbsSeq }}</td>
        <td>{{ board.title }} ({{ board.replyCnt}}) </td>
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
import { reactive, defineComponent, onMounted, computed} from 'vue';
import { IResBoardInform, IUserData, ESortDir, IcolumnInform, IResInform} from "@/interface";
import axios from 'axios';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Board-detail',
  setup() {
    const route = useRoute();
    const state = reactive({
      boardList: [] as IResBoardInform[],
      id: 2,
      userId: 0,
      countPerPage: 5,
      pageNo: 1,
      sortBy: 'bbsSeq',
      sortDir: 'origin',
      totalPage: 1,
      bbsSeq: 0,
      isVisitedDetailVue: false,
      userList: [] as IUserData[],
      sortIcon: '(-)'
    });

    const columnList : IcolumnInform[] = [
      {
        name: 'bbsSeq',
        title: 'No ',
        class: 'boardListSeq'
      },
      {
        name: 'title',
        title: 'Title ',
        class: 'boardListTitle'
      },
      {
        name: 'userId',
        title: 'Id ',
        class: 'boardListUserId'
      }
    ]

    const canWriteBoard = (): boolean => {
      return state.userId !== 0
    }

    const getBoardList = () => {
      try{        
        const url = `/api/board/?countPerPage=${state.countPerPage}&pageNo=${state.pageNo}&sortBy=${state.sortBy}&sortDir=${state.sortDir}`;
        axios.get(url).then((res: any) => {
          updateBoardList(res.data);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const isPresentSortItem = (sortBy: string): boolean => {
      return state.sortBy === sortBy;
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
        
    const changeSortDir = () => {
      if (state.sortDir === ESortDir.ORIGIN) {
        state.sortDir = ESortDir.ASC;
      } else if (state.sortDir === ESortDir.ASC) {
        state.sortDir = ESortDir.DESC;
      } else {
        state.sortDir = ESortDir.ORIGIN;
      }
    }

    const initSortDir = () => {
      state.sortDir = ESortDir.ASC;
    }

    const onSort = (sortBy: string) => {
      state.sortBy === sortBy ? changeSortDir() : initSortDir();
      state.sortBy = sortBy;
      getBoardList();
    }

    const checkValidUser = () => {
      try{        
        const url = "/api/user";
        axios.get(url).then((res: any) => {
          updateUserList(res);
          checkUserInUserList();
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const updateUserList = (res: any) => {
      state.userList = res.data.data as IUserData[];
    }

    const checkUserInUserList = () => {
      const userSeq = state.userList.findIndex((user) => user.id === state.id);
      if(userSeq !== -1) state.userId = state.id;
    }

    const updateBoardList = (res: IResInform) => {
      state.boardList.length = 0;
      state.boardList = res.data as IResBoardInform[];
      if(res.totalPage)state.totalPage = res.totalPage === 0 ? 1 : res.totalPage;
    }

    const onPlusPageNum = () => {
      state.pageNo < state.totalPage ? state.pageNo ++ : state.pageNo;
      getBoardList();
    }

    const onMinusPageNum = () => {
      state.pageNo > 1 ? state.pageNo -- : state.pageNo;
      getBoardList();
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
      window.location.href=`/detail/${bbsSeq}/${state.pageNo}/${state.userId}/${state.sortBy}/${state.sortDir}`;
    }

    const onMoveHomePage = () => {
      window.location.href='/';
    }
    
    onMounted(() => {
      initRouteParam();
      getBoardList(),
      checkValidUser()
    })

    return {
      state,
      onPlusPageNum,
      onMinusPageNum,
      onSort,
      isPresentSortItem,
      canPrevPage,
      canNextPage,
      columnList,
      onMoveDetailPage,
      onMoveHomePage,
      getSortIcon,
      canWriteBoard
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