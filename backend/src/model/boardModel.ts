import { IBoardInform } from "../interface";
class BoardModel {
  userId: number = 0;
  title: string = "";
  content: string = "";

  constructor(req: IBoardInform) {
    this.userId = req.userId;
    this.title = req.title;
    this.content = req.content;
  }
}

export default BoardModel;