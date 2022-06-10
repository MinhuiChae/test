import boardModel from "./boardModel"
import { IBoardInform } from "../interface";

class BbsSeqModel extends boardModel{
  bbsSeq: number = 0;
  userName: string = "";
  constructor(bbsSeq: number,  userName: string, req: IBoardInform) {
    super(req);
    this.userName = userName;
    this.bbsSeq = bbsSeq;
  }
}

export default BbsSeqModel;