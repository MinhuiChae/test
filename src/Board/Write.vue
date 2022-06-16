<template>
<div class="write">
  <div class="buttons">
    <button class="backToHomeListButton" @click.stop = "changeBoardInform" v-if="state.post">글쓰기</button>
    <button class="wirteBoardButton" @click.stop = "changeBoardInform" v-if="state.update">수정</button>
    <button class="backToHomeListButton" @click.stop = "movePageToHome" >리스트</button>
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
      userId: 0,
      Data: boardInform as IBoardInform,
      resData: boardData as IResBoardInform,
      totalPage: 0,
      bbsSeq:0,
      update: false,
      post: false,
      curPage:0,
      isValidUser: '',
    })
    const updateBoardList = (res: any) => {
      state.resData = res.data.data as IResBoardInform;
    }

    const postBoard = () =>  axios.post("/api/board/" + state.userId, {
      title: state.Data.title,
      content: state.Data.content,
    }).then((res: any) => {
      updateBoardList(res);
      moveToDetailPage(1);
      state.post = false;
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));

    const updateBoard = () => axios.put("/api/board/" + state.bbsSeq, {
      title: state.Data.title,
      content: state.Data.content,
    }).then((res: any) => {
      state.update = false;
      updateBoardList(res);
      moveToDetailPage(state.curPage);
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));

    const moveToDetailPage = (page: number) => {
      window.location.href="/detail/" + state.resData.bbsSeq + "/" + page + "/" + state.userId + "/" + state.isValidUser;
    }

    const el = ref<HTMLFormElement>();
    const changeIBoardData: IBoardInform = Object.assign({}, state.Data);
    const { setProperty, getElementValue } = useObject();
    const checkFormList: string[] = [];

    const changeBoardInform = () => {
      const elements = el.value?.elements;
      console.log(elements)
      if(elements) {
        [...elements].forEach(element => {
          const key = element.getAttribute("name");
          let value: string = getElementValue(element as THTMLElement);
          if(key) {
            isValidInform(key, value);
          }
        })
      }

      if(checkFormList.length === 0) {
        state.Data = changeIBoardData;
        if(state.post) {
          if(state.isValidUser === 'true') {
            postBoard();
          } else {
            alert("회원이 아닙니다.")
          }
        } else {
          updateBoard();
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
    this.state.update = Boolean(this.$route.params.update);
    this.state.post = Boolean(this.$route.params.post);
    this.state.bbsSeq = Number(this.$route.params.bbsSeq);
    this.state.userId = Number(this.$route.params.userId);
    console.log(this.state.userId)
    this.state.isValidUser = String(this.$route.params.isValidUser);
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