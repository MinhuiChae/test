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
      update: true,
      userId: state.userId,
      isValidUser: state.isValidUser,
    }}">
    <button class="backToHomeButton" v-if="state.isWriter">수정</button>
    </router-link>
    <button @click="deleteBoard" class="backToHomeButton" v-if="state.isWriter">삭제</button>
    </div>
  </div>
    <table class="boardDetailView" ref = 'el'>
      <tr>
        <td class="userId">작성자</td>
        <td class="stateUserId" id="stateUserId">{{state.board.userId}}</td>
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
      <p class="replyUserId"> 작성자:{{ reply.userId }}, 번호:{{ reply.replySeq }}</p>
      <p class="replyBtnC">
        <button class="replyUpdate" @click.stop="getUpdateReplyInform(reply.replySeq)" v-if="state.isClickUpdateReplyButton !== reply.replySeq && appearButton(reply.replySeq)">수정</button>
        <button class="replyUpdate" @click.stop="updateReplyInform(reply.userId)" v-if="state.isClickUpdateReplyButton === reply.replySeq && appearButton(reply.replySeq)">확인</button>
        <button class="replyDelete" @click.stop="deleteReplyInform(reply.replySeq)" v-if="appearButton(reply.replySeq)">삭제</button>
      </p>
      <input type="text" class="replyContent" :value="reply.content" readonly v-if="state.isClickUpdateReplyButton !== reply.replySeq">
      <input type="text" class="replyContent" :value="reply.content" id="replyUpdateContent" v-if="state.isClickUpdateReplyButton === reply.replySeq">
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
      userId: 0,
      bbsSeq: 0,
      board: boardData  as IResBoardInform,
      replyList: [] as IResReplyInform[],
      Data: replyData as IResReplyInform,
      pageNo: 0,
      isVisitedDetailVue: true,
      isClickReplyButton: false,
      clickReplyButtonNum: 0,
      isClickUpdateReplyButton: 0,
      replySeq:0,
      isValidUser: '',
      isWriter: false,
      isReplyWriter: false,
      myReplyList: [] as number[],
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
      isWriter();
    });

    const deleteBoard = () => axios.delete("/api/board/" + state.bbsSeq).then((res: any) => {
      alert(res.data.msg)
      window.location.href = "/"
    });

    const getReplyList = () => axios.get("/api/board/" + state.bbsSeq + "/reply").then((res: any) => {
      state.replyList = res.data.data as IResReplyInform[];
      isReplyWriter();
      console.log("state.myReplyList", state.myReplyList)
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

    const updateReply = () => axios.put("/api/board/" + state.bbsSeq + "/reply/" + state.replySeq, {
      content: state.Data.content
    }).then((res: any) => {
      state.replyList = res.data.data as IResReplyInform[];
      state.isClickUpdateReplyButton = 0;
      state.Data.content = '';
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));

    const changeReplyInform = () => {
      const replyValue = (document.getElementById("replyContent") as HTMLInputElement).value;
      if(!replyValue) {
        alert("댓글을 입력하십시오")
      } else {
          if(state.isValidUser === 'true') {
            if(state.isClickReplyButton) {
              state.Data.content = replyValue;
              postReply();
            } 
          } else {
            alert("회원이 아닙니다.")
          }
        }
    }

    const getUpdateReplyInform = (replynum: number) => {
      state.isClickUpdateReplyButton = replynum;
      state.replySeq = replynum;
    }

    const updateReplyInform = (userId: number) => {
      const replyUpdateValue = (document.getElementById("replyUpdateContent") as HTMLInputElement).value;
      if(!replyUpdateValue) {
        alert("댓글을 입력하십시오")
      } else {
        if(state.isValidUser === 'true') {
          if( userId === state.userId) {
            state.isWriter = true;
            if(state.isClickUpdateReplyButton !== 0 && replyUpdateValue) {
              state.Data.content = replyUpdateValue;
              updateReply();
            }
          }
        } else {
          alert("회원이 아닙니다.")
        }
      }
    }

    const deleteReply = () => axios.delete("/api/board/" + state.bbsSeq + "/reply/" + state.replySeq)
    .then((res: any) => {
      alert(res.data.msg);
      getReplyList();
    }).catch((res:any) => alert(res.data.msg));


    const deleteReplyInform = (replySeq: number) => {
      state.replySeq = replySeq;
      deleteReply()
    }

    const isWriter = () => {
      console.log(state.userId)
      if(state.board.userId === state.userId) {
        state.isWriter = true;
      } else {
        state.isWriter = false;
      }
    }

    const isReplyWriter = () => {
      console.log(state.replyList)
      state.replyList.map((reply )=> {
        if(reply.userId === state.userId) {
          state.myReplyList.push(reply.replySeq)
        } 
      })
    }

    const appearButton = (seq:number): boolean => {
      console.log(seq)
      console.log(state.myReplyList)
      if(state.myReplyList.find((mySeq) => mySeq === seq)) {
        return true;
      } else {
        return false;
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
      changeReplyInform,
      updateReplyInform,
      getUpdateReplyInform,
      deleteReplyInform,
      appearButton
    }
  },
  created() {
    this.state.bbsSeq = Number(this.$route.params.bbsSeq);
    this.state.pageNo = Number(this.$route.params.pageNo);
    this.state.userId = Number(this.$route.params.userId);
    this.state.isValidUser = String(this.$route.params.isValidUser);
    console.log(this.state.isValidUser)
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
  width: 85%;
}
.replyUserId {
  margin-left: 5px;
  margin-bottom: 0;
}
.replyBtnC {
  float: right;
  margin-bottom: 20px;
  margin-top:8px;
}
.replyLength, .replyButton, .WriteReplyButton, .replyBtnC, .replyContent {
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
.replyUpdate, .replyDelete {
  margin-bottom: 8px;
  margin-left: 3px;
  width: 50px;
  height: 30px;
  margin-top:0
}
</style>