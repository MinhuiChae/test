import replydModel from "./replyReqModel"
import { IReplyInform } from "../interface";

class ReplySeqModel extends replydModel{
  bbsSeq: number = 0;
  replySeq: number = 0;
  constructor(req: IReplyInform, bbsSeq: number, replySeq: number) {
    super(req);
    this.bbsSeq = bbsSeq;
    this.replySeq = replySeq;
  }
}

export default ReplySeqModel;