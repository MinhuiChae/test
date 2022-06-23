import BoardReqModel from "../model/boardReqModel";
import BoardResModel from "../model/boardResModel";
import ReplyReqModel from "../model/replyReqModel";
import ReplyResModel from "../model/replyResModel";
import { ESortDir} from "../enum/index";
import { IReqBoardInform, IBoardResponse, IResponseResponse } from "../interface";

const update = <BoardReqModel , K extends keyof BoardReqModel>(updateModel: BoardReqModel, reqModel: BoardReqModel, key: K) => {
  if (reqModel[key]) { 
    updateModel[key] = reqModel[key];
  }
}

const sortByAsc = <K extends keyof IReqBoardInform>(datas: IReqBoardInform[], key: K) => {
  datas.sort((a: IReqBoardInform, b: IReqBoardInform) => {
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0; 
  });
}

const sortByDesc = <K extends keyof IReqBoardInform>(datas: IReqBoardInform[], key: K) => {
  datas.sort((a: IReqBoardInform, b: IReqBoardInform) => {
    if(a[key] > b[key]) return -1;
    if(a[key] < b[key]) return 1;
    return 0; 
})}

const copiedData: BoardResModel[] = [];

class BoardService {
  boardList: BoardResModel[] = [];
  replyList: ReplyResModel[] = [];
  
  constructor(boardList: BoardResModel[], replyList: ReplyResModel[]) {
    this.boardList = boardList;
    this.replyList = replyList;
  }

  /**
   * 1.boardList 안에 있는 board 에 replyCnt 를 미리 세팅한다.
   * 2.boardPageList에 boardList에서 startIndex 부터 endIndex까지 자른 list를 넣어준다.
   * 3.해당 boardPageList를 get 한다.
   * 
   * 필요한 메서드(
   *  1.boardList 안의 board에 replyCnt를 세팅하는 메서드
   *  2.boardList를 startIndex 부터 endIndex까지 자르고 가져오는 메서드
   *  3.최종 list를 get 하는 메서드
   * )
   */

  //1.boardList 안의 board에 replyCnt를 세팅하는 메서드
    /**
     * 1.List 안에 있는 board 의 bbsSeq 값과 replyList 안에 있는 reply 의 bbsSeq 값이 같으면 
     *   ownReplyList에 push 한다.
     * 2.replyCnt 값을 ownReplyList.length 로 정의하고 해당 replyCnt 값을 board 안의 replyCnt 값에 세팅해준다.
     */
  

  //2.boardList를 startIndex 부터 endIndex까지 자르는 메서드
  getBoardList(countPerPage:any, pageNo:any, sortType: string, sortDir: ESortDir): BoardResModel[] {
    this.setPageCountInform(countPerPage, pageNo);
    this.sortBoardList(sortType, sortDir)
    let boardPageList: BoardResModel[] = [];
    const startItemNo = ((pageNo -1) * countPerPage);
    
    boardPageList = [...this.boardList].splice(startItemNo, countPerPage);
    boardPageList.forEach((boardInfo) => {
      boardInfo.replyCnt = this.getReplyListByBoardSeq(boardInfo.bbsSeq).length;
    })

    return boardPageList;
  }

  getTotalCount(): number {
    return this.boardList.length;
  }

  setPageCountInform(countPerPage:any, pageNo:any):void {
    if(countPerPage === undefined || typeof countPerPage === "undefined" || countPerPage === null) countPerPage = 10; 
    else {
      if(countPerPage) countPerPage = parseInt(countPerPage);
    }
    if(pageNo === undefined || typeof pageNo === "undefined" || pageNo === null) pageNo = 0; 
    else pageNo = parseInt(pageNo);
  }

  doSortByAsc(sortType: string) {
    Object.values(this.boardList).map(a => {
      Object.keys(a).find((key) => {
        if(key === sortType) sortByAsc(this.boardList, key as keyof IReqBoardInform);
      })
    })
  }

  doSortByDesc(sortType: string) {
    Object.values(this.boardList).map(a => {
      Object.keys(a).find((key) => {
        if(key === sortType) sortByDesc(this.boardList, key as keyof IReqBoardInform);
      })
    })
  }

  doSortByOrigin() {
    this.boardList.length = 0;
    copiedData.forEach((a: BoardResModel) => this.boardList.push(a));
  }

  sortBoardList(sortType: string, sortDir: ESortDir) {
    switch(sortDir) {
      case 'asc':
        this.doSortByAsc(sortType);  
        break;
      case 'desc':
        this.doSortByDesc(sortType);
        break;
      case 'origin':
        this.doSortByOrigin();
    }
    return this.boardList;
  }

  findBoardByBbsSeq(paramsSeq: number):BoardResModel | undefined {
    const board = this.boardList.find((seq) => seq.bbsSeq === paramsSeq)
    return board;
  }

  findReplyByReplySeq(replySeq: number): ReplyResModel | undefined {
    const reply = this.replyList.find((seq) => seq.replySeq === replySeq);
    return reply;
  }
  
  postBoard(board: BoardResModel): void {
    this.boardList.push(board);
    copiedData.push(board);
  }

  createNewBoard(reqBoard: BoardReqModel, paramsId: number) {
    const newBbsSeq: number = this.getNewBoardseq();
    return new BoardResModel(newBbsSeq, paramsId ,reqBoard);
  }

  createNewReply(reqReply: ReplyReqModel, paramsSeq: number, paramsId: number) {
    let replySeq: number = this.getNewReplyseq();
    return new ReplyResModel(reqReply, paramsSeq, replySeq, paramsId);
  }

  getPageCount(pageSize: number): number {
    let page = Math.floor(this.boardList.length / pageSize);
    if(this.boardList.length % pageSize > 0) page += 1;
  
    return page;
  }

  deleteBoard(bbsSeq: number): void {
    const boardIndex = this.findBoardIndex(bbsSeq);
    this.boardList.splice(boardIndex, 1);
    copiedData.splice(boardIndex, 1);
  }

  getDeleteBoardResponse(paramsSeq: number): boolean {
    if(this.findBoardIndex(paramsSeq) !== -1) {
      this.deleteBoard(paramsSeq)
      return true;
    } else {
      return false;
    }
  }

  getDeleteReplyResponse(paramsBbsSeq: number, paramsReplySeq: number, replySeq: number): number{
    if(this.findBoardByBbsSeq(paramsBbsSeq) !== undefined) {
      if(this.findReplyIndex(paramsReplySeq) !== -1) {
        const replyIndex = this.findReplyIndex(replySeq);
        this.replyList.splice(replyIndex, 1);
        return 200;
      } else {
        return 405;
      }
    } return 404;
  }

  findBoardIndex(bbsSeq: number): number {
    const index = this.boardList.findIndex((BoardResModel) => BoardResModel.bbsSeq === bbsSeq);
    return index;
  }

  findReplyIndex(replySeq: number): number {
    const index = this.replyList.findIndex((replyModel) => replyModel.replySeq === replySeq);
    return index;
  }

  updateBoard(updateModel: BoardReqModel, reqModel: BoardReqModel) {
    Object.keys(updateModel).forEach((key) => {
      update(updateModel, reqModel, key as keyof BoardReqModel);
    })
  }

  getUpdateBoardResponse(bbsSeq: number,  updateBoard: BoardReqModel, paramsId: number):IBoardResponse  {
    const existingBoard: BoardResModel | undefined = this.findBoardByBbsSeq(bbsSeq);
    if(existingBoard) {
      const data: BoardResModel = new BoardResModel(bbsSeq, paramsId ,updateBoard);
      this.updateBoard(existingBoard, data);
      return {data: data, status: 200};
    } else {
      return {data: [], status: 404}
    }
  } 

  updateReply(updateModel: ReplyReqModel, reqModel: ReplyReqModel) {
    Object.keys(updateModel).forEach((key) => {
      update(updateModel, reqModel, key as keyof ReplyReqModel);
    })
  }

  getUpdateReplyResponse(paramsReplySeq: number, paramsBbsSeq: number, reqReply: ReplyReqModel):IResponseResponse {
    if(this.findBoardByBbsSeq(paramsBbsSeq) !== undefined) {
      let reply = this.findReplyByReplySeq(paramsReplySeq);
      if(reply) {
        this.updateReply(reply, reqReply);
        const list = this.getReplyListByBoardSeq(paramsBbsSeq);
        return {data: list, status:200}
      }
      else {
        return {data: [], status:405}
      }
    } else {
      return {data: [], status:404}
    }
  }

  getReplyListByBoardSeq(findBoardSeq: number) : ReplyResModel[] {
    return this.replyList.filter((list) => list.bbsSeq === findBoardSeq);
  }

  postReply(resReply: ReplyResModel) {
    this.replyList.push(resReply);
  }

  getPostReplyResponse(paramsSeq: number, newReply:ReplyResModel):boolean {
    if(this.findBoardIndex(paramsSeq) !== -1) {
      this.postReply(newReply);
      return true;
    } else {
      return false;
    }
  }

  getReplyList():ReplyResModel[] {
    return this.replyList;
  }

  getNewBoardseq(): number {
    return this.boardList.length === 0 ? 1 : Math.max(...this.boardList.map((board) => board.bbsSeq)) + 1;
  }

  getNewReplyseq(): number {
    return this.replyList.length === 0 ? 1 : Math.max(...this.replyList.map((reply) => reply.replySeq)) + 1;
  }


}

export default BoardService;


