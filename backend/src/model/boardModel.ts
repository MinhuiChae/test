import { IBoardInform } from "../interface";
class BoardModel {
  bbsSeq: number = 0;
  userId: number = 0;
  title: string = "";
  content: string = "";

  constructor(req: IBoardInform) {
    this.bbsSeq = req.bbsSeq;
    this.userId = req.userId;
    this.title = req.title;
    this.content = req.content;
  }
}

export default BoardModel;