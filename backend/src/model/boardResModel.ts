import BoardReqModel from "./boardReqModel"
import { IReqBoardInform, IResReplyInform } from "../interface";

class BbsSeqModel extends BoardReqModel{
  bbsSeq: number = 0;
  userId: number = 0;
  replyCnt: number = 0;  
  constructor(bbsSeq: number,  userId: number, req: IReqBoardInform, replyCnt?: number) {
    super(req);
    this.userId = userId;
    this.bbsSeq = bbsSeq;
    this.replyCnt = replyCnt ?? 0;
  }
}

export default BbsSeqModel;