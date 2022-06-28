<template>
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
    })

    const onSetUpdateReplyInform = (replynum: number) => {
      state.updateReplySeq = replynum;
      state.replySeq = replynum;
      context.emit("updateSeq", state.replySeq);
    }

    
    const onUpdateReplyInform = () => {
      const replyUpdateContent = (document.getElementById("replyUpdateContent") as HTMLInputElement).value;
      if(!replyUpdateContent) {
        alert('댓글에 값이없습니다')
      } else {
        doUpdate(replyUpdateContent);
        state.updateReplySeq = 0;
      }
    }

    const doUpdate = (reply: string) => {
      if(state.updateReplySeq !== 0 && props.data) {
        context.emit("updateSeq", reply);
      }
    }

    const isReplyWriter = (userId:number): boolean => {
      return props.userId === userId;
    }

    const onDeleteReplyInform = (replySeq: number) => {
      state.replySeq = replySeq;
      context.emit("deleteSeq", state.replySeq);
    }



    return {
      state,
      props,
      onSetUpdateReplyInform,
      onUpdateReplyInform,
      isReplyWriter,
      onDeleteReplyInform
    }
  }

})
</script>

<style>

</style>