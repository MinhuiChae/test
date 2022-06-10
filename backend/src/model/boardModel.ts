import { IBoardInform } from "../interface";
class BoardModel {
  title: string = "";
  content: string = "";

  constructor(req: IBoardInform) {
    this.title = req.title;
    this.content = req.content;
  }
}

export default BoardModel;