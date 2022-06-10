import { IBoardInform } from "../interface";
class BoardModel {
  title: string = "";
  content: string = "";

  constructor(req: IBoardInform) {
    this.title = req.title ?? "";
    this.content = req.content ?? "";
  }

  isValidation(): boolean {
    return this.title !=="" && this.content !=="";
  }
}

export default BoardModel;