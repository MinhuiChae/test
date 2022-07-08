import { setTransitionHooks } from "vue";

class drawCanvas {
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined = undefined;
  ruleUnit: number = 15;
  ruleFrame: number = 4;
  ruleWidth: number = 0;
  shortPositionY: number = 20;
  longPositionY: number = 30;
  videoFrame: number = 23.976;
  minRuleWidth: number = 0;
  isInit: boolean = false;

  constructor(canvas: HTMLCanvasElement | undefined, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }
 
  isSatisfiedRepresntText = (x: number):boolean => {
    return x % this.ruleUnit === 0
  }

  setVideoFrame(frame: number) {
    this.videoFrame = frame;
  }

  getVideoFrame() {
    return this.videoFrame;
  }

  setShortPositionY(shortY: number) {
    this.shortPositionY = shortY;
  }

  setLongPositionY(longY: number) {
    this.longPositionY = longY;
  }

  setRuleUnit(ruleUnit: number) {
    this.ruleUnit = ruleUnit;
  }

  setRuleFrame(ruleFrame: number) {
    this.ruleFrame = ruleFrame;
  }

  getCurrentPixel(currentFrame: number, duration: number): number {
    if(this.canvas) {
      return currentFrame / (Math.ceil(duration * 23.976) / this.canvas?.width);
    } else {
      return 0;
    }
  }

  calculateRuleFrame(start: number, end: number) {
   
    const duration = end - start;
    const canvas = this.canvas;
    console.error("calculateRuleFrame : duration ", duration)
    if (canvas) {
    
      //표현하는 단위 ruleFrame 
      // 표현단위가 너무 작아서 
      // 5000 개 5000개 방법 
      // 9개 방법으로 
      // 1.... 2...... 4 .... 8...  16...

      for(let ruleFrame = 1; ruleFrame < duration; ruleFrame*=2) {
        const ruleCnt = duration / ruleFrame;
        const pixel = canvas.width / ruleCnt;
        console.log("pixel > ", pixel);
        if(pixel >= 5 && pixel <= 10) {
          console.log("pixel> ", pixel)
          console.log("ruleFrame> ", ruleFrame)
          this.ruleFrame = ruleFrame;
          this.ruleWidth = pixel;
          break;
        }
      }
    }
  }

  /**
   * 최소 ruleWidth 값은?
   * 
   */

  draw(start: number, end: number): void {
    const context = this.context;
    const canvas = this.canvas;
    const duration = end - start;
  
    if (context && canvas) {
    this.calculateRuleFrame(start, end)
    const ruleWidth = canvas.width / duration * this.ruleFrame;
    this.ruleWidth = ruleWidth;
    this.minRuleWidth = canvas.width / duration;
    const ruleCnt = canvas.width / ruleWidth;
    context.lineWidth = 0.5;

    console.log("ruleFrame", this.ruleFrame);
    console.log("ruleWidth", ruleWidth);

      for(let cnt = 0; cnt <= ruleCnt; cnt++) {
        const rulePositionX = ruleWidth * cnt; 
        const drawTextPositionX =  rulePositionX - 5;
        let linePositionY = this.shortPositionY;
        const drawRuleFrame = start + (this.ruleFrame * cnt);
  
        if (this.isSatisfiedRepresntText(cnt)) {
          linePositionY = this.longPositionY;
          context.fillText(String(drawRuleFrame), drawTextPositionX, 40);
        }

        context.strokeStyle = "#000000";
        context.beginPath();
        context.moveTo(rulePositionX-0.5, 0);
        context.lineTo(rulePositionX-0.5, linePositionY);
        context.stroke();
        context.closePath();
      }
    }
  }
}

export default drawCanvas;

