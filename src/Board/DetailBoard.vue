<template>
<!--게시글-->
  <div class="boardTitle">{{state.board.title}}</div>
  <div class="buttonDiv">
    <div class="buttonDetailDiv">
    <button @click.stop="onMovePageToList(state.pageNo, state.isVisitedDetailVue)" class="backToListButton">리스트</button>
    <button @click.stop="onMovePageToHome()" class="backToHomeButton">Home</button>
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
    <button @click.stop="onDeleteBoard" class="backToHomeButton" v-if="state.isWriter">삭제</button>
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
      <button @click.stop="onChangeReplyButtonStatus">댓글쓰기</button>
    </p>
  </div>
  
  <div class="replyDivBox">
    <div v-if="state.isClickReplyButton">
      <p> 작성자: {{ state.userId }}</p>
      <div class="writeReplyBox">
        <input type="text" class="writeReplyInputBox" :value="state.Data.content" id="replyContent">
        <button class="writeReplyButton" @click.stop="onPostReplyInform">확인</button>
      </div>
    </div>
    
    <div v-for="reply in state.replyList" :key="reply.replySeq">
      <p class="replyUserId"> 작성자: {{ reply.userId }}</p>
      <p class="replyBtnC">
        <button class="replyUpdate" @click.stop="onSetUpdateReplyInform(reply.replySeq)" v-if="state.updateSeq !== reply.replySeq && isReplyWriter(reply.userId)">수정</button>
        <button class="replyUpdate" @click.stop="onUpdateReplyInform()" v-if="state.updateSeq === reply.replySeq && isReplyWriter(reply.userId)">확인</button>
        <button class="replyDelete" @click.stop="onDeleteReplyInform(reply.replySeq)" v-if="isReplyWriter(reply.userId)">삭제</button>
      </p>
      <input type="text" class="replyContent" :value="reply.content" readonly v-if="state.updateSeq !== reply.replySeq">
      <input type="text" class="replyContent" :value="reply.content" id="replyUpdateContent" v-if="state.updateSeq === reply.replySeq">
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted} from 'vue';
import axios from 'axios';
import { IResBoardInform, IResReplyInform, IResInform } from '@/interface';
import { useRoute } from 'vue-router';
export default defineComponent({
  name:"Detail-view",
  props: {
    pageNo: Number
  },
  setup(props) {
    const route = useRoute();
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
      updateSeq: 0,
      replySeq:0,
      isValidUser: '',
      isWriter: false,
      isReplyWriter: false,
      sortBy: '',
      sortDir: ''
    })

    const onChangeReplyButtonStatus = () => {
      state.isClickReplyButton = !state.isClickReplyButton;
    }

    const getBoard = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq;
        axios.get(url).then((res: any) => {
          updateBoardList(res.data);
          checkBoardWriter();
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const updateBoardList = (res: IResInform) => {
      state.board = res.data as IResBoardInform;
    }

    const updateReplyList = (res: IResInform) => {
      state.replyList = res.data as IResReplyInform[];
    }

    const onDeleteBoard = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq;
        axios.delete(url).then((res: any) => {
          alert(res.data.msg)
          movePageToListAfterDelete();
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const movePageToListAfterDelete = () => {
      window.location.href = "/" + state.sortBy + "/" + state.sortDir
    };

    const getReplyList = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq + "/reply";
        axios.get(url).then((res: any) => {
          updateReplyList(res.data);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const changePostReplyInform = () => {
      state.isClickReplyButton = false;
      state.Data.content='';
    }

    const changeUpdateReplyInform = () => {
      state.updateSeq = 0;
      state.Data.content = '';
    }

    const postReply = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq + "/reply/" + state.userId;
        axios.post(url, {
          content: state.Data.content
        }).then((res: any) => {
          getReplyList();
          changePostReplyInform();
          alert(res.data.msg);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const updateReply = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq + "/reply/" + state.replySeq;
        axios.put(url, {
          content: state.Data.content
        }).then((res: any) => {
          updateReplyList(res.data);
          changeUpdateReplyInform();
          alert(res.data.msg);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const onSetUpdateReplyInform = (replynum: number) => {
      state.updateSeq = replynum;
      state.replySeq = replynum;
    }

    const onPostReplyInform = () => {
      const replyValue = (document.getElementById("replyContent") as HTMLInputElement).value;
      if(isValidReplyForm(replyValue)) {
        // if(isValidUser()) {
          doPost(replyValue);
        // } else {
        //   alert("회원이 아닙니다.")
        // }
      } 
    }

    const onUpdateReplyInform = () => {
      const replyUpdateValue = (document.getElementById("replyUpdateContent") as HTMLInputElement).value;
      if(isValidReplyForm(replyUpdateValue)) {
        // if(isValidUser()) {
          doUpdate(replyUpdateValue);
        // } else {
        //   alert("회원이 아닙니다.")
        // }
      }
    }

    const doUpdate = (reply: string) => {
      if(state.updateSeq !== 0) {
        state.Data.content = reply;
        updateReply();
      }
    }

    const doPost = (reply: string) => {
      if(state.isClickReplyButton) {
        state.Data.content = reply;
        postReply();
      } 
    }

    /**
     * 1.먼저 댓글이 있는지 체크
     * 2.회원인지 체크
     * 3.post, update에 넘겨주기
     */
    // const isValidUser = ():boolean => {
    //   return state.isValidUser === 'true'
    // }

    const isValidReplyForm = (reply: string): boolean => {
      if(!reply) {
        alert("댓글을 입력하십시오");
        return false;
      } return true;
    }

    const deleteReply = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq + "/reply/" + state.replySeq;
        axios.delete(url).then((res: any) => {
          alert(res.data.msg);
          getReplyList();
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const onDeleteReplyInform = (replySeq: number) => {
      state.replySeq = replySeq;
      deleteReply()
    }

    const checkBoardWriter = () => {
      state.isWriter = state.board.userId === state.userId ? true : false;
    }

    const isReplyWriter = (userId:number): boolean => {
      return state.userId === userId;
    }

    const onMovePageToList = (pageNo: number, isVisitedDetailVue:boolean) => {
      window.location.href=`/${pageNo}/${isVisitedDetailVue}/${state.sortBy}/${state.sortDir}`;
    }

    const onMovePageToHome = () => {
      window.location.href='/'
    }

    const initRouteParam = () => {
      state.bbsSeq = Number(route.params.bbsSeq);
      state.pageNo = Number(route.params.pageNo);
      state.userId = Number(route.params.userId);
      state.sortBy = String(route.params.sortBy);
      state.sortDir = String(route.params.sortDir);
      state.isValidUser = String(route.params.isValidUser);
    }

    onMounted(() => {
      initRouteParam(),
      getBoard(),
      getReplyList()
    })

    return {
      props,
      state,
      onDeleteBoard,
      postReply,
      onChangeReplyButtonStatus,
      onPostReplyInform,
      onUpdateReplyInform,
      onSetUpdateReplyInform,
      onDeleteReplyInform,
      isReplyWriter,
      onMovePageToList,
      onMovePageToHome
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