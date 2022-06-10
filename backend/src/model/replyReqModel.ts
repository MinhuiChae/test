import {IReplyInform} from "../interface"
class ReplyModel {
  content: string = "";
  constructor(req: IReplyInform) {
    this.content = req.content ?? "";
  }

  isValidation(): boolean {
    return this.content !== "";
  }
}

export default ReplyModel;