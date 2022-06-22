import { IReqBoardInform } from "../interface";
class BoardReqModel {
  title: string = "";
  content: string = "";

  constructor(req: IReqBoardInform) {
    this.title = req.title ?? "";
    this.content = req.content ?? "";
  }

  isValidation(): boolean {
    return this.title !=="" && this.content !=="";
  }
}

export default BoardReqModel;