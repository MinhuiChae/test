import {IReqReplyInform} from "../interface"
class ReplyReqModel {
  content: string = "";
  constructor(req: IReqReplyInform) {
    this.content = req.content ?? "";
  }

  isValidation(): boolean {
    return this.content !== "";
  }
}

export default ReplyReqModel;