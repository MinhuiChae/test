<template>

    <button class="wirteBoardButton" @click.stop = "changeBoardInform" >글쓰기</button>
    <button class="backToHomeButton" @click.stop = "movePageToHome" >리스트</button>

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
import { IBoardInform } from "@/interface";
import axios from 'axios';
export default defineComponent({
  name: 'write-detail',
  setup() {
    const boardInform: IBoardInform = {
      title: '',
      content: ''
    }
    const state = reactive({
      userId: 3,
      Data: boardInform as IBoardInform
    })

    const postBoard = () =>  axios.post("/api/board/" + state.userId, {
      title: state.Data.title,
      content: state.Data.content,
    })


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
        alert('성공')
        console.log(changeIBoardData)
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
      changeBoardInform
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
  .wirteBoardButton {
    float: right;
  }
  .ul, li {
    text-decoration: none;
    list-style: none;
  }
  
</style>