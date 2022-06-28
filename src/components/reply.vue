<template>
<div class="reply">
  <p class="replyCnt">댓글 ({{ props.replyList?.length }})</p>
  <p class="replyButton">
    <button @click.stop="onChangeReplyButtonStatus" v-if="isValidUser()">댓글쓰기</button>
  </p>
</div>
<div class="replyDivBox">
  <div v-if="state.isClickReplyButton">
    <p> 작성자: {{ props.userId }}</p>
    <div class="writeReplyBox">
      <input type="text" class="writeReplyInputBox" :value="props.data?.content" id="replyContent">
      <button class="writeReplyButton" @click.stop="onPostReplyInform">확인</button>
    </div>
  </div>

  <div v-for="reply in props.replyList" :key="reply.replySeq">
    <p class="replyUserId"> 작성자: {{ reply.userId }}</p>
    <p class="replyBtnC">
      <button class="replyUpdate" @click.stop="onSetUpdateReplyInform(reply.replySeq)" v-if="state.updateReplySeq !== reply.replySeq && isReplyWriter(reply.userId)">수정</button>
      <button class="replyUpdate" @click.stop="onUpdateReplyInform()" v-if="state.updateReplySeq === reply.replySeq && isReplyWriter(reply.userId)">확인</button>
      <button class="replyDelete" @click.stop="onDeleteReplyInform(reply.replySeq)" v-if="isReplyWriter(reply.userId)">삭제</button>
    </p>
    <input type="text" class="replyContent" :value="reply.content" readonly v-if="state.updateReplySeq !== reply.replySeq">
    <input type="text" class="replyContent" :value="reply.content" id="replyUpdateContent" v-if="state.updateReplySeq === reply.replySeq">
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import { IResReplyInform } from '@/interface';
export default defineComponent({
  name: "reply-content",
  props: {
    replyList: {
      type: [] as PropType<IResReplyInform[]>
    },
    data: {
      type: Object as PropType<IResReplyInform>
    },
    userId: Number
  },

  setup(props, context) {
    const state = reactive({
      updateReplySeq: 0,
      replySeq:0,
      isClickReplyButton: false,
    })

    const onSetUpdateReplyInform = (replynum: number) => {
      state.updateReplySeq = replynum;
      state.replySeq = replynum;
      context.emit("replySeq", state.replySeq);
    }

    const onChangeReplyButtonStatus = () => {
      state.isClickReplyButton = !state.isClickReplyButton;
    }
    
    const onUpdateReplyInform = () => {
      const replyUpdateContent = (document.getElementById("replyUpdateContent") as HTMLInputElement).value;
      if(!replyUpdateContent) {
        alert('댓글에 값이없습니다')
      } else {
        emitUpdateReply(replyUpdateContent);
        initUpdateReplySeq();
      }
    }

    const emitUpdateReply = (reply: string) => {
      if(state.updateReplySeq !== 0) {
        context.emit("updateReply", reply);
      }
    }

    const initUpdateReplySeq = () => {
      state.updateReplySeq = 0;
    }

    const onDeleteReplyInform = (replySeq: number) => {
      state.replySeq = replySeq;
      emitDeleteReplySeq(replySeq);
    }

    const emitDeleteReplySeq = (replySeq: number) => {
      context.emit("deleteReplySeq", replySeq);
    }

    const onPostReplyInform = () => {
      const replyContent = (document.getElementById("replyContent") as HTMLInputElement).value;
      if(!replyContent) {
        alert('댓글에 값이없습니다')
      } else {
        emitPostReply(replyContent);
        initReplyButton();
      }
    }

    const emitPostReply = (reply: string) => {
      context.emit("postReply", reply);
    }

    const initReplyButton = () => {
      state.isClickReplyButton = false;
    }

    const isValidUser = (): boolean => {
      return props.userId !== 0
    }

    const isReplyWriter = (userId:number): boolean => {
      return props.userId === userId;
    }

    return {
      state,
      props,
      onSetUpdateReplyInform,
      onUpdateReplyInform,
      onDeleteReplyInform,
      onPostReplyInform,
      isReplyWriter,
      isValidUser,
      onChangeReplyButtonStatus
    }
  }
})
</script>

<style>

</style>