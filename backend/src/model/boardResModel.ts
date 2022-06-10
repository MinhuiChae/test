import boardModel from "./boardReqModel"
import { IBoardInform } from "../interface";

class BbsSeqModel extends boardModel{
  bbsSeq: number = 0;
  userId: number = 0;
  constructor(bbsSeq: number,  userId: number, req: IBoardInform) {
    super(req);
    this.userId = userId;
    this.bbsSeq = bbsSeq;
  }
}

export default BbsSeqModel;