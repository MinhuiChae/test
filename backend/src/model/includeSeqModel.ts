import boardModel from "./boardModel"
import { IBoardInform } from "../interface";

class BbsSeqModel extends boardModel{
  bbsSeq: number = 0;
  constructor(bbsSeq: number, req: IBoardInform) {
    super(req);
    this.bbsSeq = bbsSeq;
  }
}

export default BbsSeqModel;