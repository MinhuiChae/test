<template>
  <div class="button">
    <button class="wirteBoardButton" @click.stop = "changeBoardInform" >글쓰기</button>
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
  name: 'write-detail',
  setup() {
    const boardInform: IBoardInform = {
      title: '',
      content: ''
    }

    const userData: IResBoardInform = {
      title: '',
      content: '',
      bbsSeq: 0,
      userId:0
    };

    const state = reactive({
      userId: 3,
      Data: boardInform as IBoardInform,
      isDisabled: false,
      resData: userData as IResBoardInform,
      totalPage: 0
    })

    const postBoard = () =>  axios.post("/api/board/" + state.userId, {
      title: state.Data.title,
      content: state.Data.content,
    }).then((res: any) => {
      state.isDisabled = true;
      state.resData = res.data.data as IResBoardInform;
      window.location.href="/detail/" + state.resData.bbsSeq + "/" + state.totalPage
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));


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
        postBoard()
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
    }
  },
  created() {
    this.state.totalPage = Number(this.$route.params.totalPage)
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