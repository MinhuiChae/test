import ReplyReqModel from "./replyReqModel"
import { IReqReplyInform } from "../interface";

class ReplySeqModel extends ReplyReqModel{
  bbsSeq: number = 0;
  replySeq: number = 0;
  userId: number = 0;
  constructor(req: IReqReplyInform, bbsSeq: number, replySeq: number, userId: number) {
    super(req);
    this.bbsSeq = bbsSeq;
    this.replySeq = replySeq;
    this.userId = userId;
  }
}

export default ReplySeqModel;