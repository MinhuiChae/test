<template>
<div class="write">
  <div class="buttons">
    <button class="backToHomeListButton" @click.stop = "onChangeBoardInform" v-if="state.post">글쓰기</button>
    <button class="wirteBoardButton" @click.stop = "onChangeBoardInform" v-if="state.update">수정</button>
    <button class="backToHomeListButton" @click.stop = "onMovePageToHome" >리스트</button>
  </div>
    <form ref = 'el' class="boardDetailViews">
      <ul>
        <li class="Write">제목</li>
      </ul>
      <ul>
        <li><input type="text" class="inputWriteTitle" name="title" :value="state.Data.title"></li>
      </ul>
      <ul>
        <li class="Write">내용</li>
      </ul>
      <ul>
        <li><input type="text" class="inputWriteContent" name="content" :value="state.Data.content"></li>
      </ul>
    </form>
</div>
</template>

<script lang="ts">
import {reactive, defineComponent, ref, onMounted} from 'vue';
import useObject from '@/composition/useObject';
import { THTMLElement } from '@/types';
import { IReqBoardInform , IResBoardInform, IResInform} from "@/interface";
import { useRoute } from 'vue-router';
import axios from 'axios';
export default defineComponent({
   //eslint-disable-next-line
  name: 'Write',
 
  setup() {
    const route = useRoute();
    const boardInform: IReqBoardInform = {
      title: '',
      content: ''
    }

    const boardData: IResBoardInform = {
      title: '',
      content: '',
      bbsSeq: 0,
      userId:0
    };

    const state = reactive({
      userId: 0,
      Data: boardInform as IReqBoardInform,
      resData: boardData as IResBoardInform,
      totalPage: 0,
      bbsSeq:0,
      update: false,
      post: false,
      curPage:0,
      isValidUser: '',
      sortBy: '',
      sortDir: '',
    })

    const updateBoardList = (res: IResInform) => {
      state.resData = res.data as IResBoardInform;
    }

    const completedWrite = (res: IResInform, num: number) => {
      state.post = false;
      state.update = false;
      updateBoardList(res);
      alert(res.msg);
      moveToDetailPage(num);
    }

    const postBoard = () => {
      try{        
        const url = "/api/board/" + state.userId;
        axios.post(url, {
          title: state.Data.title,
          content: state.Data.content
        }).then((res: any) => {
          completedWrite(res.data, 1)
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const updateBoard = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq;
        axios.put(url, {
          title: state.Data.title,
          content: state.Data.content
        }).then((res: any) => {
          completedWrite(res.data, state.curPage);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const moveToDetailPage = (page: number) => {
      window.location.href=`/detail/${state.resData.bbsSeq}/${page}/${state.userId}/${state.isValidUser}/${state.sortBy}/${state.sortDir}`;
    }

    const el = ref<HTMLFormElement>();
    const changeIBoardData: IReqBoardInform = Object.assign({}, state.Data);
    const { setProperty, getElementValue } = useObject();
    const checkFormList: string[] = [];

    const onChangeBoardInform = () => {
      const elements = el.value?.elements;
      if(elements) {
        [...elements].forEach(element => {
          const key = element.getAttribute("name");
          let value: string = getElementValue(element as THTMLElement);
          if(key) checkValidInform(key, value);
        })
      }

      if(checkFormList.length === 0) {
        state.Data = changeIBoardData;
        if(state.post) {
          // state.isValidUser === 'true' ? postBoard() : alert("회원이 아닙니다.");
           postBoard()
        } else {
          updateBoard();
        }
      } else {
        alert(checkFormList + '를 확인하세요')
      }
      checkFormList.length = 0;
    }

    const checkValidInform = (key: string, value: any) => {
      !value === true ? checkFormList.push(key) : setProperty(changeIBoardData, key as keyof IReqBoardInform, value);
    }

    const onMovePageToHome = () => {
      window.location.href='/'
    }

    const initRouteParam = () => {
      state.update = Boolean(route.params.update);
      state.post = Boolean(route.params.post);
      state.bbsSeq = Number(route.params.bbsSeq);
      state.userId = Number(route.params.userId);
      state.sortBy = String(route.params.sortBy);
      state.sortDir = String(route.params.sortDir);
      state.isValidUser = String(route.params.isValidUser);
      if(state.update) {
        state.curPage = Number(route.params.pageNo);
        state.Data.title = String(route.params.title);
        state.Data.content = String(route.params.content);
      }
    }

    onMounted(() => {
      initRouteParam()
    })

    return {
      state,
      el,
      onChangeBoardInform,
      updateBoard,
      onMovePageToHome
    }
  }
})
</script>

<style lang="scss"> 
  .Write {
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
  .wirteBoardButton, .backToHomeButton, .fixBoardButton, .deleteBoardButton, .backToHomeListButton{
    margin-right: 10px;
    display: inline-block;
  }
  .ul, li {
    text-decoration: none;
    list-style: none;
  }
  .boardDetailViews {
    margin-top: 50px;
    border: 1px solid #E1E1E1;
    border-collapse: collapse;
  }
  .write {
    width: 80%;
    margin-left: 150px;
    margin-top: 70px;
  }
</style>