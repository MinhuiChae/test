<template>
  <div class="container">
    <button @click="onEnlargeTimeLine()" v-if="state.canEnlargeTimeLine">확대</button>
    <button @click="onReductionTimeLine()" v-if="state.canReductionTimeLine">축소</button>
    <video class="video" src="gdragon.mp4" ref="videoEl" controls></video>
    {{ state.currentFrame }}
    <div class="frameBox">
      <div class="frameTimeline" v-bind:style="{left:(state.currentPixel) + 'px'}"></div>
      <p><canvas class="canvas" width="600" height="40" ref = "canvasEl">이 브라우저는 캔버스를 지원하지 않습니다.</canvas></p>
    </div>
  </div>
  
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import DrawCanvas from './draw';

export default defineComponent({
  name: 'test-view',
  setup() {    
    const canvasEl = ref<HTMLCanvasElement>();
    const videoEl = ref<HTMLVideoElement>();
    const canvasClass = ref<DrawCanvas>();
    const state = reactive({
      canvasCtx: null as unknown as CanvasRenderingContext2D,
      videoDuration:0,
      currentPixel: 0,
      ruleFrame: 0,
      currentFrame: 0,
      videoFrame: 0,
      startVideoFrame: 0,
      myVideoDuration: 0,
      startPixel: 0,
      canEnlargeTimeLine: true,
      canReductionTimeLine: false,
      maxRuleFrame: 0,
      ruleWidth: 0,
      maxRuleWidth: 0,
      minRuleWidth: 0
    })

    const decideMaxRuleInfo = () => {
      canvasClass.value?.calculateRuleFrame(0, state.videoDuration);
      state.maxRuleFrame = state.ruleFrame;
      state.maxRuleWidth = state.ruleWidth;
    }

    const draw = () => {
      const start = state.startVideoFrame;
      const end = Math.ceil(state.videoDuration * state.videoFrame);
      state.myVideoDuration = (end - start) / state.videoFrame;
      drawCanvas(8, start, end);
    }

    const drawWithChangeInfo = (num: number) => {
      state.videoDuration = state.videoDuration * num
      console.log('state.videoDuration:', state.videoDuration);

      draw();
      decideCurrentTimeVideoInfo()
    }

    const onEnlargeTimeLine = () => {
      state.canReductionTimeLine = true;
      const canvas = canvasEl.value;
      if(canvas)
      state.canvasCtx.clearRect(0, 0, canvas?.width, canvas?.height)

      drawWithChangeInfo(0.8);

      if(canvasClass.value) {
        if(state.ruleFrame > 1) {
          state.canEnlargeTimeLine = true;
        } else if(state.ruleFrame === 1){
          state.canEnlargeTimeLine = false;
        } 
      }
    }

    const onReductionTimeLine = () => {
      state.canEnlargeTimeLine = true;
      const canvas = canvasEl.value;
      if(canvas)
      state.canvasCtx.clearRect(0, 0, canvas?.width, canvas?.height);
      
      drawWithChangeInfo(2);

      if(state.ruleFrame === state.maxRuleFrame && state.ruleWidth === state.maxRuleWidth) {
        state.canReductionTimeLine = false;
      } else {
        state.canReductionTimeLine = true;        
      }
    }


    const decideCurrentTimeVideoInfo = () => {
      const video = videoEl.value;
      const canvas = canvasClass.value;

      if(video && canvas) {
        video.currentTime = state.startVideoFrame / state.videoFrame;
        const startFrame = Math.ceil(video?.currentTime * state.videoFrame);
        state.startPixel = canvas.getCurrentPixel(startFrame, state.myVideoDuration);
        video?.addEventListener('timeupdate', function() {
          setInterval(function() {
            state.currentFrame = Math.ceil(video?.currentTime * state.videoFrame);
            state.currentPixel = canvas.getCurrentPixel(state.currentFrame, state.myVideoDuration) - state.startPixel;
          })
        });
      }
    }

    const drawVideo = () => {
      const video = videoEl.value;
      video?.addEventListener('loadedmetadata', function () {
        const duration = video?.duration ;
        state.videoDuration = duration;
        draw()
        decideCurrentTimeVideoInfo()
        decideMaxRuleInfo();
      });
    }

    const drawCanvas = (ruleFrame: number, start: number, end: number) => {
      const canvas = canvasClass.value;
      if (canvas) {
        canvas.setRuleFrame(ruleFrame);
        canvas.setRuleUnit(5);
        canvas.draw(start, end);
        state.ruleFrame = canvas.ruleFrame;
        state.ruleWidth = canvas.ruleWidth;
        state.minRuleWidth = canvas.minRuleWidth;
      }
    }

    onMounted(() => {
      state.canvasCtx = canvasEl.value?.getContext('2d') as CanvasRenderingContext2D;
      if(canvasEl.value) {
        canvasClass.value = new DrawCanvas( canvasEl.value, state.canvasCtx);
        state.videoFrame = canvasClass.value?.getVideoFrame();
      }
      drawVideo();
    })

    return {
      canvasEl,
      videoEl,
      state,
      onEnlargeTimeLine,
      onReductionTimeLine
    }
  }

});
</script>

<style lang="scss">
.container {
  width:100%;
  height:100vh;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction: column
}
.video {
  width: 50%;
}
.frameTimeline{
  border-left: 2px solid red;
  display: inline;
  height: 50px;
  position: absolute;
}
.frameBox {
  position: relative;
}
</style>
