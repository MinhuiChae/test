class drawCanvas {
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined = undefined;
  duration: number = 0;
  ruleUnit: number = 15;
  ruleFrame: number = 4;

  constructor(canvas: HTMLCanvasElement | undefined, context: CanvasRenderingContext2D, duration: number) {
    this.canvas = canvas;
    this.context = context;
    this.duration = duration;
  }

  //일정 프레임은 y축을 더 길게 표시
 
  isSatisfiedRepresntText = (x: number):boolean => {
    return x % this.ruleUnit === 0
  }

  setRuleUnit(ruleUnit: number) {
    this.ruleUnit = ruleUnit;
  }

  setRuleFrame(ruleFrame: number) {
    this.ruleFrame = ruleFrame;
  }
  

  draw() {
    const context = this.context;
    const duration = this.duration;
    const canvas = this.canvas;
  
    if (context && canvas) {
      const ruleWidth = canvas.width / duration;
      context.lineWidth = 0.5;
      let cnt = 0;
      /// ?????
      for (let drawRuleFrame = 0; drawRuleFrame <= duration; drawRuleFrame+=this.ruleFrame) {
        const rulePositionX = ruleWidth * drawRuleFrame;
        const drawTextPositionX =  rulePositionX - 5;
        let linePositionY = 20;

        if (this.isSatisfiedRepresntText(cnt++)) {
          linePositionY = 30;
          context.fillText(String(drawRuleFrame), drawTextPositionX, 40);
        }

        context.strokeStyle = "#000000";
        context.beginPath();
        context.moveTo(rulePositionX-0.5, 0);
        context.lineTo(rulePositionX-0.5, linePositionY);
        context.stroke();
      }
    }
  }
}

export default drawCanvas;