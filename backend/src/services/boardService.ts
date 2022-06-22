import BoardReqModel from "../model/boardReqModel";
import BoardResModel from "../model/boardResModel";
import ReplyReqModel from "../model/replyReqModel";
import ReplyResModel from "../model/replyResModel";
import { ESortDir} from "../enum/index";
import { IReqBoardInform } from "../interface";

const update = <BoardReqModel , K extends keyof BoardReqModel>(updateModel: BoardReqModel, reqModel: BoardReqModel, key: K) => {
  if (reqModel[key]) { 
    updateModel[key] = reqModel[key];
  }
}

const sortAsAsc = <K extends keyof IReqBoardInform>(datas: IReqBoardInform[], key: K) => {
  datas.sort((a: IReqBoardInform, b: IReqBoardInform) => {
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0; 
  });
}

const sortAsDesc = <K extends keyof IReqBoardInform>(datas: IReqBoardInform[], key: K) => {
  datas.sort((a: IReqBoardInform, b: IReqBoardInform) => {
    if(a[key] > b[key]) return -1;
    if(a[key] < b[key]) return 1;
    return 0; 
})}

const copiedData: BoardResModel[] = [];

class boardService {
  boardList: BoardResModel[] = [];
  replyList: ReplyResModel[] = [];
  boardPageList: BoardResModel[] = [];
  dir: ESortDir = ESortDir.ASC;
  sortType: string = '';
  
  constructor(boardList: BoardResModel[], replyList: ReplyResModel[]) {
    this.boardList = boardList;
    this.replyList = replyList;
  }

  getBoardList(): BoardResModel[] {
    return this.boardList;
  }

  createBoardPageList(countPerPage:any, pageNo:any): void {
    const startItemNo = ((pageNo -1) * countPerPage);
    let endItemNo = (pageNo * countPerPage) -1;
    if(endItemNo > (this.boardList.length -1)) {
      endItemNo = this.boardList.length - 1;
    }
    [...this.boardList].splice(1,endItemNo);
    if(startItemNo < this.boardList.length) {
      for(let index = startItemNo; index <= endItemNo; index++) {
        this.boardPageList.push(this.boardList[index]);
      }
    }
  }

  getBoardPageList(): BoardResModel[] {
    return this.getBoardListAfterChangeInform(this.boardPageList);
  }

  getTotalCount(): number {
    return this.boardList.length;
  }

  getCountInform(countPerPage:any, pageNo:any):void {
    if(countPerPage === undefined || typeof countPerPage === "undefined" || countPerPage === null) countPerPage = 10; 
    else {
      if(countPerPage) countPerPage = parseInt(countPerPage);
    }
    if(pageNo === undefined || typeof pageNo === "undefined" || pageNo === null) pageNo = 0; 
    else pageNo = parseInt(pageNo);
  }

  doSortAsAsc(sortType: string) {
    Object.values(this.boardList).map(a => {
      Object.keys(a).find((key) => {
        if(key === sortType) sortAsAsc(this.boardList, key as keyof IReqBoardInform);
      })
    })
  }

  doSortAsDesc(sortType: string) {
    Object.values(this.boardList).map(a => {
      Object.keys(a).find((key) => {
        if(key === sortType) sortAsDesc(this.boardList, key as keyof IReqBoardInform);
      })
    })
  }

  doSortAsOrigin() {
    this.boardList.length = 0;
    copiedData.forEach((a: BoardResModel) => this.boardList.push(a));
  }

  sortBoardList(sortType: string, sortDir: ESortDir) {
    this.sortType = sortType;
    this.dir = sortDir;
    switch(sortDir) {
      case 'asc':
        this.doSortAsAsc(sortType);  
        break;
      case 'desc':
        this.doSortAsDesc(sortType);
        break;
      case 'origin':
        this.doSortAsOrigin();
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

  deleteReply(replySeq: number): void{
    const replyIndex = this.findReplyIndex(replySeq);
    this.replyList.splice(replyIndex, 1);
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

  updateReply(updateModel: ReplyReqModel, reqModel: ReplyReqModel) {
    Object.keys(updateModel).forEach((key) => {
      update(updateModel, reqModel, key as keyof ReplyReqModel);
    })
  }

  /**
   * 1.List 안에 있는 board 의 bbsSeq 값과 replyList 안에 있는 reply 의 bbsSeq 값이 같으면 
   *   ownReplyList에 push 한다.
   * 2.replyCnt 값을 ownReplyList.length 로 정의하고 해당 replyCnt 값을 board 안의 replyCnt 값에 세팅해준다.
   * 3.세팅하고 난 후의 boardList를 return 한다.
   */

  changeBoardListInform(list: BoardResModel[]) {
    list.map((board) => {
      const ownReplyList:ReplyResModel[] = [];
      let replyCnt: number = 0;
      this.getOwnReply(ownReplyList, board.bbsSeq);
      replyCnt = ownReplyList.length;
      board.replyCnt = replyCnt;
    })
  }

  getBoardListAfterChangeInform(list: BoardResModel[]) {
    this.changeBoardListInform(list)
    return list;
  }

  getOwnReply(ownList: ReplyResModel[], paramsSeq: number) {
    this.replyList.map((list) => {
      if(list.bbsSeq === paramsSeq) ownList.push(list)
    });
  }

  postReply(resReply: ReplyResModel) {
    this.replyList.push(resReply);
  }

  getReplyList():ReplyResModel[] {
    return this.replyList;
  }

  selectLastBbsSeq(list: any[]) {
    let seqList:number[] = [0];
    let seq: number = 0;
    list.map((board) => seqList.push(board.bbsSeq))

    seq = Math.max(...seqList)
    return seq;
  }

  selectLastReplySeq(list: any[]) {
    let seqList:number[] = [0];
    let seq: number = 0;
    list.map((reply) => seqList.push(reply.replySeq))

    seq = Math.max(...seqList)
    return seq;
  }

}

export default boardService;


