<template>
  <div>
    <canvas id="canvas" width="700" height="400" ref = "canvasEl">이 브라우저는 캔버스를 지원하지 않습니다.</canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import DrawCanvas from './draw';

export default defineComponent({
  name: 'test-view',
  setup() {    
    const canvasEl = ref<HTMLCanvasElement>();
    const canvasClass = ref<DrawCanvas>();
    const state = reactive({
      canvasCtx: null as unknown as CanvasRenderingContext2D,
      duration: 300,
    })

    const draw = () => {
      const canvas = canvasClass.value;
      if (canvas) {
        canvas.setRuleFrame(5);
        canvas.setRuleUnit(25);
        canvas.draw();
      }
    }

    onMounted(() => {
      state.canvasCtx = canvasEl.value?.getContext('2d') as CanvasRenderingContext2D;
      canvasClass.value = new DrawCanvas( canvasEl.value, state.canvasCtx, state.duration);
      
      draw();
    })

    return {
      canvasEl,
    }
    

  }

});
</script>
