<template>
  <div class="button">
    <button class="wirteBoardButton" @click.stop = "changeBoardInform" v-if="state.post">글쓰기</button>
    <button class="wirteBoardButton" @click.stop = "changeBoardInform" v-if="state.update">수정</button>
    <button class="backToHomeListButton" @click.stop = "movePageToHome" >리스트</button>
  </div>
  <div>
    <form ref = 'el' class="boardDetailView">
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
import {reactive, defineComponent, ref} from 'vue';
import useObject from '@/composition/useObject';
import { THTMLElement } from '@/types';
import { IBoardInform , IResBoardInform} from "@/interface";
import axios from 'axios';
export default defineComponent({
   //eslint-disable-next-line
  name: 'Write',
 
  setup() {
    const boardInform: IBoardInform = {
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
      userId: 3,
      Data: boardInform as IBoardInform,
      resData: boardData as IResBoardInform,
      totalPage: 0,
      bbsSeq:0,
      update: false,
      post: false,
      curPage:0,
      curPerPage:0,
      boardListLength:0,
      newCurPage:0
    })

    const postBoard = () =>  axios.post("/api/board/" + state.userId, {
      title: state.Data.title,
      content: state.Data.content,
    }).then((res: any) => {
      state.resData = res.data.data as IResBoardInform;
      console.log(res.data.data)
      makeNewCurPage();
      window.location.href="/detail/" + state.resData.bbsSeq + "/" + state.newCurPage
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));

    const updateBoard = () => axios.put("/api/board/" + state.bbsSeq, {
      title: state.Data.title,
      content: state.Data.content,
    }).then((res: any) => {
      
      state.resData = res.data.data as IResBoardInform;
      console.log(res.data.data)
      window.location.href="/detail/" + state.resData.bbsSeq + "/" + state.curPage;
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));

    const makeNewCurPage = () => {
      console.log(state.boardListLength, state.curPerPage)
      if(state.boardListLength+1 <= state.curPerPage) {
        state.newCurPage = state.totalPage;
      } else {
        state.newCurPage = state.totalPage + 1;
      }
    }

    const el = ref<HTMLFormElement>();
    const changeIBoardData: IBoardInform = Object.assign({}, state.Data);
    const { setProperty, getElementValue } = useObject();
    const checkFormList: string[] = [];

    const changeBoardInform = () => {
      const elements = el.value?.elements;
      console.log(el)
      if(elements) {
        [...elements].forEach(element => {
          const key = element.getAttribute("name");
          let value: string = getElementValue(element as THTMLElement);
          if(key) {
            isValidInform(key, value);
          }
          console.log(key, value)
        })
      }

      if(checkFormList.length === 0) {
        state.Data = changeIBoardData;
        if(state.post) {
          postBoard();
          state.post = false;
        } else {
          updateBoard();
          state.update = false;
        }
      } else {
        alert(checkFormList + '를 확인하세요')
      }
      checkFormList.length = 0;
    }

    const isValidInform = (key: string, value: any) => {
      if (!value) {
        checkFormList.push(key);
      } else {
        setProperty(changeIBoardData, key as keyof IBoardInform, value);
      }
    }

    // const inputList:IBoardInputInform[] = [
    //   {
    //     name: 'title',
    //     value: state.Data.title,
    //     inputType: 'text'
    //   },
    //   {
    //     name: 'content',
    //     value: state.Data.content,
    //     inputType: 'text'
    //   }
    // ]
    return {
      state,
      el,
      changeBoardInform,
      updateBoard
    }
  },
  created() {
    this.state.boardListLength = Number(this.$route.params.boardListLength);
    this.state.curPerPage = Number(this.$route.params.curPerPage);
    this.state.totalPage = Number(this.$route.params.totalPage);
    this.state.update = Boolean(this.$route.params.update)
    this.state.post = Boolean(this.$route.params.post);
    this.state.bbsSeq = Number(this.$route.params.bbsSeq);
      if(this.state.update) {
        this.state.curPage = Number(this.$route.params.pageNo);
        this.state.Data.title = String(this.$route.params.title);
        this.state.Data.content = String(this.$route.params.content);
      }
    
  },
  methods: {
    movePageToHome() {
      window.location.href='/'
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
    margin-left: 10px;
    margin-top: 100px;
    margin-bottom: 0;
  }
  .ul, li {
    text-decoration: none;
    list-style: none;
  }
  .boardDetailView {
    width: 80%;
    border: 1px solid #E1E1E1;
    border-collapse: collapse;
    margin-left: 150px;
  }
  .button {
    margin-left:140px;
  }
</style>