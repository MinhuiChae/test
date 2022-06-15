import replydModel from "./replyReqModel"
import { IReplyInform } from "../interface";

class ReplySeqModel extends replydModel{
  bbsSeq: number = 0;
  replySeq: number = 0;
  userId: number = 0;
  constructor(req: IReplyInform, bbsSeq: number, replySeq: number, userId: number) {
    super(req);
    this.bbsSeq = bbsSeq;
    this.replySeq = replySeq;
    this.userId = userId;
  }
}

export default ReplySeqModel;