<template>
<div class="write">
  <div class="buttons">
    <button class="backToHomeListButton" @click.stop = "onChangeBoardInform" v-if="state.post">글쓰기</button>
    <button class="wirteBoardButton" @click.stop = "onChangeBoardInform" v-if="state.update">수정</button>
    <button class="backToHomeListButton" @click.stop = "onMovePageToHome" >리스트</button>
  </div>
    <form ref = 'el' class="boardDetailViews">
      <ul v-for="inform in writeInformList" :key="inform.seq">
        <li :class="inform.listClass" v-if="inform.isInputType === false">{{ inform.title }}</li>
        <li><input type="text" :class="inform.inputClass" :name="inform.inputName" :value="inform.inputValue" v-if="inform.isInputType"></li>
      </ul>
    </form>
</div>
</template>

<script lang="ts">
import {reactive, defineComponent, ref, onMounted} from 'vue';
import useObject from '@/composition/useObject';
import { THTMLElement } from '@/types';
import { IReqBoardInform , IResBoardInform, IResInform, IWriteInform } from "@/interface";
import { useRoute } from 'vue-router';
import axios from 'axios';
export default defineComponent({
   //eslint-disable-next-line
  name: 'Write',
  props: {
    title: String,
    content: String,
    board: Object
  },
  setup(props) {
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
      bbsSeq:0,
      update: false,
      post: false,
      curPage:0,
      sortBy: '',
      sortDir: '',
    });

    const writeInformList: IWriteInform[] = [
      {
        seq: 1,
        isInputType: false,
        listClass: 'Write',
        title: '제목'
      },
      {
        seq: 2,
        isInputType: true,
        inputClass: 'inputWriteTitle',
        inputName: 'title',
        inputValue: props.title
      },
      {
        seq: 3,
        isInputType: false,
        listClass: 'Write',
        title: '내용'
      },
      {
        seq: 4,
        isInputType: true,
        inputClass: 'inputWriteContent',
        inputName: 'content',
        inputValue: props.content
      }
    ]

    const updateBoardDetail = (res: IResInform) => {
      state.resData = res.data as IResBoardInform;
    }

    const completedWrite = (res: IResInform, num: number) => {
      state.post = false;
      state.update = false;
      updateBoardDetail(res);
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
      window.location.href=`/detail/${state.resData.bbsSeq}/${page}/${state.userId}/${state.sortBy}/${state.sortDir}`;
    }

    const el = ref<HTMLFormElement>();
    const changeIBoardData: IReqBoardInform = boardInform;
    const { setProperty, getElementValue } = useObject();
    const checkFormList: string[] = [];

    const onChangeBoardInform = () => {
      setNewDataAtBoard();

      if(checkFormList.length !== 0) {
        alert(checkFormList + '를 확인하세요');
      } doWrite();

      checkFormList.length = 0;
    }

    const setNewDataAtBoard = () => {
      const elements = el.value?.elements;
      if(elements) {
        [...elements].forEach(element => {
          const key = element.getAttribute("name");
          let value: string = getElementValue(element as THTMLElement);
          if(key) {
            if(!value) {
              checkFormList.push(key);
            } setProperty(changeIBoardData, key as keyof IReqBoardInform, value);
          }
        })
      }
    }

    const doWrite = () => {
      state.Data = changeIBoardData;
      state.post === true? postBoard() : updateBoard();
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
      if(state.update) {
        state.curPage = Number(route.params.pageNo);
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
      onMovePageToHome,
      writeInformList,
      props
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