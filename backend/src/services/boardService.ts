import BoardModel from "../model/boardModel";

class boardService {
  boardList: BoardModel[] = [];
  constructor(boardList: BoardModel[]) {
    this.boardList = boardList;
  }

}

export default boardService;