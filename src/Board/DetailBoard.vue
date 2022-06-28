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
      sortBy: state.sortBy,
      sortDir: state.sortDir
    }}">
    <button class="backToHomeButton" v-if="isBoardWriter()">수정</button>
    </router-link>
    <button @click.stop="onDeleteBoard" class="backToHomeButton" v-if="isBoardWriter()">삭제</button>
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
  <reply-content
    :data = "state.Data"
    :replyList = "state.replyList"
    :userId = "state.userId"
    @updateReply = "doUpdateReply"
    @replySeq = "setUpdateReplySeq"
    @deleteReplySeq = "doDeleteReply"
    @postReply = "doPostReply"
  ></reply-content>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted} from 'vue';
import axios from 'axios';
import replyContent from '../components/reply.vue';
import { IResBoardInform, IResReplyInform, IResInform } from '@/interface';
import { useRoute } from 'vue-router';
export default defineComponent({
  name:"Detail-view",
  props: {
    pageNo: Number
  },
  components: {
    replyContent
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
      replySeq:0,
      sortBy: '',
      sortDir: ''
    });

    const getBoard = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq;
        axios.get(url).then((res: any) => {
          updateBoard(res.data);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const updateBoard = (res: IResInform) => {
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

    const getReplyList = async () => {
      try{        
        const url = "/api/board/" + state.bbsSeq + "/reply";
        const res = await axios.get(url);
        if (res) updateReplyList(res.data);
      } catch(err) {
        console.error(err);
      }
    }

    const initPostReplyInform = () => {
      state.Data.content='';
    }

    const initUpdateReplyInform = () => {
      state.Data.content = '';
    }

    const doPostReply = (reply: string) => {
      state.Data.content = reply;
      postReply();
    }
    
    const postReply = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq + "/reply/" + state.userId;
        axios.post(url, {
          content: state.Data.content
        }).then((res: any) => {
          getReplyList();
          initPostReplyInform();
          alert(res.data.msg);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const setUpdateReplySeq = (replySeq: number) => {
      state.replySeq = replySeq;
    }

    const doUpdateReply = (reply: string) => {
      state.Data.content = reply;
      updateReply();
    }

    const updateReply = () => {
      try{        
        const url = "/api/board/" + state.bbsSeq + "/reply/" + state.replySeq;
        axios.put(url, {
          content: state.Data.content
        }).then((res: any) => {
          updateReplyList(res.data);
          initUpdateReplyInform();
          alert(res.data.msg);
        }); 
      } catch(err) {
        console.error(err);
      }
    }

    const doDeleteReply = (replySeq: number) => {
      state.replySeq = replySeq;
      deleteReply();
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

    const isBoardWriter = (): boolean => {
      return state.board.userId === state.userId;
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
      onMovePageToList,
      onMovePageToHome,
      isBoardWriter,
      doUpdateReply,
      setUpdateReplySeq,
      doDeleteReply,
      doPostReply
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