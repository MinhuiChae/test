<template>
<!--게시글-->
  <div class="boardTitle">{{state.board.title}}</div>
  <div class="buttonDiv">
    <div class="buttonDetailDiv">
    <button @click="movePageToList(state.pageNo, state.isVisitedDetailVue)" class="backToListButton">리스트</button>
    <button @click="movePageToHome()" class="backToHomeButton">Home</button>
    <router-link :to="{ name: 'Write', params: { 
      title: state.board.title, 
      content:state.board.content, 
      pageNo: state.pageNo, 
      bbsSeq: state.bbsSeq,
      update: true
    }}">
    <button class="backToHomeButton">수정</button>
    </router-link>
    <button @click="deleteBoard" class="backToHomeButton">삭제</button>
    </div>
  </div>
  <table class="boardDetailView">
    <tr>
      <td class="userId">작성자</td>
      <td class="stateUserId">{{state.board.userId}}</td>
    </tr>
    <tr>
      <td class="content">내용</td>
      <td class="stateContent"> {{state.board.content}}</td>
    </tr>
  </table>

<!--댓글-->
  <div class="reply">
    <p class="replyLength">댓글 ({{ state.replyList.length }})</p>
    <p class="replyButton">
      <button @click.stop="isClickReplyButton">댓글쓰기</button>
    </p>
  </div>
  
  <div class="replyDivBox">
    <div v-if="state.isClickReplyButton">
      <p> 작성자: {{ state.userId }}</p>
      <div class="writeReplyBox">
        <input type="text" class="writeReplyInputBox" :value="state.Data.content" id="replyContent">
        <button class="WriteReplyButton" @click.stop="changeReplyInform">확인</button>
      </div>
    </div>
    
    <div v-for="reply in state.replyList" :key="reply.replySeq">
      <p class="replyUserId"> {{ reply.userId }} </p>
      <div class="replyContent">
        {{ reply.content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted} from 'vue';
import axios from 'axios';
import { IResBoardInform, IResReplyInform } from '@/interface';
export default defineComponent({
  name:"Detail-view",
  props: {
    pageNo: Number
  },
  setup(props) {
    const boardData: IResBoardInform = {
      title: '',
      content: '',
      bbsSeq: 0,
      userId:0
    };

    const replyData: IResReplyInform = {
      content: '',
      bbsSeq: 0,
      replySeq: 0,
      userId: 0
    }

    const state = reactive({
      userId: 1,
      bbsSeq: 0,
      board: boardData  as IResBoardInform,
      replyList: [] as IResReplyInform[],
      Data: replyData as IResReplyInform,
      pageNo: 0,
      isVisitedDetailVue: true,
      isClickReplyButton: false,
      clickReplyButtonNum: 0
    })

    const isClickReplyButton = () => {
      state.clickReplyButtonNum ++;
      if(state.clickReplyButtonNum % 2 === 1) {
        state.isClickReplyButton = true;
      } else {
        state.isClickReplyButton = false;
      }
    }

    const getBoard = () => axios.get("/api/board/" + state.bbsSeq).then((res: any) => {
      state.board = res.data.data as IResBoardInform;
    });

    const deleteBoard = () => axios.delete("/api/board/" + state.bbsSeq).then((res: any) => {
      alert(res.data.msg)
      window.location.href = "/"
    });

    const getReplyList = () => axios.get("/api/board/" + state.bbsSeq + "/reply").then((res: any) => {
      state.replyList = res.data.data as IResReplyInform[];
    });

    const postReply = () => axios.post("/api/board/" + state.bbsSeq + "/reply/" + state.userId, {
      content: state.Data.content
    }).then((res: any) => {
      getReplyList();
      state.isClickReplyButton = false;
      state.clickReplyButtonNum = 0;
      state.Data.content='';
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));

    const changeReplyInform = () => {
      const value = (document.getElementById("replyContent") as HTMLInputElement).value;
      if(!value) {
        alert("댓글을 입력하십시오")
      } else {
        state.Data.content = value;
        postReply();
      }
    }


    onMounted(() => {
      getBoard(),
      getReplyList()
    })

    return {
      props,
      state,
      deleteBoard,
      postReply,
      isClickReplyButton,
      changeReplyInform
    }
  },
  created() {
    this.state.bbsSeq = Number(this.$route.params.bbsSeq)
    this.state.pageNo = Number(this.$route.params.pageNo)
  },
  methods: {
    movePageToList(pageNo: number, isVisitedDetailVue:boolean) {
      window.location.href='/' + pageNo + "/" + isVisitedDetailVue;
    },
    movePageToHome() {
      window.location.href='/'
    }
  }
});
</script>

<style lang="scss">
.boardDetailView {
  width: 80%;
  border: 1px solid #E1E1E1;
  border-collapse: collapse;
  margin-left: 150px;
  margin-top: 100px;
}
.userId, .content {
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
  width: 30%;
}
.stateUserId, .stateContent {
  border-bottom: 1px solid gray;
}
.replyDivBox {
  width: 80%;
  margin-left: 150px;
  margin-bottom: 100px;
  border-top: 1px solid black;
} 
.reply {
  width: 80%;
  margin-left: 150px;
  margin-top: 70px;
}
.replyContent {
  margin-top: 5px;
  border-radius: 0.5em;
  height: 35px;
  border:1px solid gray;
}
.replyUserId {
  margin-left: 5px;
  margin-bottom: 0;
}
.replyLength, .replyButton, .WriteReplyButton {
  display: inline-block;
}
.replyButton {
  float: right;
}
.wirteReplyBox {
  border-bottom: 1px solid lightgray;
  display: inline-block;
}
.WriteReplyButton {
  margin-top: 7px;
  width: 70px;
  height: 30px;
  float: right;
}
.writeReplyInputBox {
  margin-top: 5px;
  border-radius: 0.5em;
  height: 35px;
  border:1px solid gray;
  width:90%;
}

</style>