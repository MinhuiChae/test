<template>
<!--게시글-->
  <div class="boardTitle">{{state.board.title}}</div>
  <div class="buttonDiv">
    <div class="buttonDetailDiv">
    <button @click="movePageToList(state.pageNo, state.isVisitedDetailVue)" class="backToListButton">리스트</button>
    <button @click="movePageToHome()" class="backToHomeButton">Home</button>
    <router-link :to="{ name: 'Write', params: { 
      title: state.board.title, 
      content: state.board.content, 
      pageNo: state.pageNo, 
      bbsSeq: state.bbsSeq,
      update: true,
      userId: state.userId,
      isValidUser: state.isValidUser,
      sortBy: state.sortBy,
      sortDir: state.sortDir
    }}">
    <button class="backToHomeButton" v-if="state.isWriter">수정</button>
    </router-link>
    <button @click="deleteBoard" class="backToHomeButton" v-if="state.isWriter">삭제</button>
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
    <p class="replyCnt">댓글 ({{ state.replyList.length }})</p>
    <p class="replyButton">
      <button @click.stop="isClickReplyButton">댓글쓰기</button>
    </p>
  </div>
  
  <div class="replyDivBox">
    <div v-if="state.isClickReplyButton">
      <p> 작성자: {{ state.userId }}</p>
      <div class="writeReplyBox">
        <input type="text" class="writeReplyInputBox" :value="state.Data.content" id="replyContent">
        <button class="writeReplyButton" @click.stop="postReplyInform">확인</button>
      </div>
    </div>
    
    <div v-for="reply in state.replyList" :key="reply.replySeq">
      <p class="replyUserId"> 작성자: {{ reply.userId }}</p>
      <p class="replyBtnC">
        <button class="replyUpdate" @click.stop="getUpdateReplyInform(reply.replySeq)" v-if="state.isClickUpdateReplyButton !== reply.replySeq && isReplyWriter(reply.replySeq)">수정</button>
        <button class="replyUpdate" @click.stop="updateReplyInform(reply.userId)" v-if="state.isClickUpdateReplyButton === reply.replySeq && isReplyWriter(reply.replySeq)">확인</button>
        <button class="replyDelete" @click.stop="deleteReplyInform(reply.replySeq)" v-if="isReplyWriter(reply.replySeq)">삭제</button>
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
      sortBy: '',
      sortDir: ''
    })

    const isClickReplyButton = () => {
      state.isClickReplyButton = !state.isClickReplyButton;
    }

    const getBoard = () => axios.get("/api/board/" + state.bbsSeq).then((res: any) => {
      updateBoardList(res);
      isBoardWriter();
    });

    const updateBoardList = (res: any) => {
      state.board = res.data.data as IResBoardInform;
    }

    const updateReplyList = (res: any) => {
      state.replyList = res.data.data as IResReplyInform[];
    }

    const deleteBoard = () => axios.delete("/api/board/" + state.bbsSeq).then((res: any) => {
      alert(res.data.msg)
      movePageToListAfterDelete();
    });

    const movePageToListAfterDelete = () => {
      window.location.href = "/" + state.sortBy + "/" + state.sortDir
    };

    const getReplyList = () => axios.get("/api/board/" + state.bbsSeq + "/reply").then((res: any) => {
      updateReplyList(res);
      setReplyAtOwnReplyList();
    });

    const changePostReplyInform = () => {
      state.isClickReplyButton = false;
      state.clickReplyButtonNum = 0;
      state.Data.content='';
    }

    const changeUpdateReplyInform = () => {
      state.isClickUpdateReplyButton = 0;
      state.Data.content = '';
    }

    const postReply = () => axios.post("/api/board/" + state.bbsSeq + "/reply/" + state.userId, {
      content: state.Data.content
    }).then((res: any) => {
      getReplyList();
      changePostReplyInform();
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));

    const updateReply = () => axios.put("/api/board/" + state.bbsSeq + "/reply/" + state.replySeq, {
      content: state.Data.content
    }).then((res: any) => {
      updateReplyList(res);
      changeUpdateReplyInform();
      alert(res.data.msg);
    }).catch((res:any) => alert(res.data.msg));
    
    const getUpdateReplyInform = (replynum: number) => {
      state.isClickUpdateReplyButton = replynum;
      state.replySeq = replynum;
    }

    const postReplyInform = () => {
      const replyValue = (document.getElementById("replyContent") as HTMLInputElement).value;
      isValidReplyForm('post', replyValue);
    }

    const updateReplyInform = (userId: number) => {
      const replyUpdateValue = (document.getElementById("replyUpdateContent") as HTMLInputElement).value;
      isValidReplyForm('update', replyUpdateValue, userId);
    }

    const updating = (reply: string, userId: number) => {
      if(userId === state.userId) {
        state.isWriter = true;
        if(state.isClickUpdateReplyButton !== 0 && reply) {
          state.Data.content = reply;
          updateReply();
        }
      }
    }

    const posting = (reply: string) => {
      if(state.isClickReplyButton) {
        state.Data.content = reply;
        postReply();
      } 
    }

    const isValidReplyForm = (states: string, reply: string, userId?: number) => {
      if(!reply) {
        alert("댓글을 입력하십시오")
      } else {
        if(state.isValidUser === 'true') {
          if(states === 'update' && userId) updating(reply, userId)
          else posting(reply);
        } else alert("회원이 아닙니다.");
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

    const isBoardWriter = () => {
      state.isWriter = state.board.userId === state.userId ? true : false;
    }

    const setReplyAtOwnReplyList = () => {
      state.replyList.map((reply)=> {
        if(reply.userId === state.userId) {
          state.myReplyList.push(reply.replySeq)
        } 
      })
    }

    const isReplyWriter = (seq:number): boolean => {
      return state.myReplyList.find((mySeq) => mySeq === seq) === undefined ? false : true;
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
      postReplyInform,
      updateReplyInform,
      getUpdateReplyInform,
      deleteReplyInform,
      isReplyWriter
    }
  },
  created() {
    this.state.bbsSeq = Number(this.$route.params.bbsSeq);
    this.state.pageNo = Number(this.$route.params.pageNo);
    this.state.userId = Number(this.$route.params.userId);
    this.state.sortBy = String(this.$route.params.sortBy);
    this.state.sortDir = String(this.$route.params.sortDir);
    this.state.isValidUser = String(this.$route.params.isValidUser);
  },
  methods: {
    movePageToList(pageNo: number, isVisitedDetailVue:boolean) {
      window.location.href='/' + pageNo + "/" + isVisitedDetailVue + "/" + this.state.sortBy + "/" + this.state.sortDir;
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
.replyCnt, .replyButton, .writeReplyButton, .replyBtnC, .replyContent {
  display: inline-block;
}
.replyButton {
  float: right;
}
.wirteReplyBox {
  border-bottom: 1px solid lightgray;
  display: inline-block;
}
.writeReplyButton {
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