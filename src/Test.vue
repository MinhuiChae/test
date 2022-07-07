<template>
  <div class="container">
    <button @click="enlargeTimeLine()">확대</button>
    <video class="video" src="gdragon.mp4" ref="videoEl" controls ></video>
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
      endVideoFrame: 0
    })

    const draw = () => {
      const start = state.startVideoFrame;
      state.endVideoFrame = Math.ceil(state.videoDuration * state.videoFrame);
      const end = state.endVideoFrame;
      state.myVideoDuration = (end - start) / state.videoFrame;
      drawCanvas(8, start, end);
    }

    const enlargeTimeLine = () => {
      const canvas = canvasEl.value;
      if(canvas)
      state.canvasCtx.clearRect(0, 0, canvas?.width, canvas?.height)
      state.startVideoFrame += 50;
      state.endVideoFrame -= 50;
      state.myVideoDuration = (state.endVideoFrame - state.startVideoFrame) / state.videoFrame;
      drawCanvas(8, state.startVideoFrame, state.endVideoFrame);
      videoCurrentTime()
    }

    const videoCurrentTime = () => {
      const video = videoEl.value;
      const canvas = canvasClass.value;

      if(video && canvas) {
        video?.play();
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
        videoCurrentTime()
      });
    }

    const drawCanvas = (ruleFrame: number, start: number, end: number) => {
      const canvas = canvasClass.value;
      if (canvas) {
        canvas.setRuleFrame(ruleFrame);
        canvas.setRuleUnit(5);
        canvas.draw(start, end);
        state.ruleFrame = canvas.ruleFrame;
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
      enlargeTimeLine
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
