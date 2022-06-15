import BoardModel from "../model/boardReqModel";
import BbsModel from "../model/boardResModel";
import ReplyReqModel from "../model/replyReqModel";
import ReplyResModel from "../model/replyResModel";
import { ESortDir} from "../enum/index";
import { IBoardInform } from "../interface";

const update = <BoardModel , K extends keyof BoardModel>(updateModel: BoardModel, reqModel: BoardModel, key: K) => {
  if (reqModel[key]) { 
    updateModel[key] = reqModel[key];
  }
}

const sortAsAsc = <K extends keyof IBoardInform>(userDatas: IBoardInform[], key: K) => {
  userDatas.sort((a: IBoardInform, b: IBoardInform) => {
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0; 
  });
}

const sortAsDesc = <K extends keyof IBoardInform>(userDatas: IBoardInform[], key: K) => {
  userDatas.sort((a: IBoardInform, b: IBoardInform) => {
    if(a[key] > b[key]) return -1;
    if(a[key] < b[key]) return 1;
    return 0; 
})}

class boardService {
  boardList: BbsModel[] = [];
  replyList: ReplyResModel[] = [];
  boardPageList: BbsModel[] = [];
  dir: ESortDir = ESortDir.ASC;
  sortType: string = '';
 
  constructor(boardList: BbsModel[], replyList: ReplyResModel[]) {
    this.boardList = boardList;
    this.replyList = replyList;
  }

  getBoardList(): BbsModel[] {
    return this.boardList;
  }

  createBoardPageList(countPerPage:any, pageNo:any): void {
    const startItemNo = ((pageNo -1) * countPerPage);
    let endItemNo = (pageNo * countPerPage) -1;

    if(endItemNo > (this.boardList.length -1)) {
      endItemNo = this.boardList.length - 1;
    }
    if(startItemNo < this.boardList.length) {
      for(let index = startItemNo; index <= endItemNo; index++) {
        this.boardPageList.push(this.boardList[index]);
      }
    }
  }

  getBoardPageList(): BbsModel[] {
    return this.boardPageList;
  }

  getTotalCount(): number {
    return this.boardList.length;
  }

  getCountInform(countPerPage:any, pageNo:any):void {
    if(countPerPage === undefined || typeof countPerPage === "undefined" || countPerPage === null) {
      countPerPage = 10;
    } else {
      if(countPerPage)
      countPerPage = parseInt(countPerPage);
    }
    if(pageNo === undefined || typeof pageNo === "undefined" || pageNo === null) {
      pageNo = 0;
    } else {
      pageNo = parseInt(pageNo);
    }
  }

  sortBoardList(sortType: string, sortDir: ESortDir) {
    this.sortType = sortType;
    this.dir = sortDir;
    if(sortDir === 'asc') {
      Object.values(this.boardList).map(a => {
        Object.keys(a).find((key) => {
          if(key === sortType) {
            sortAsAsc(this.boardList, key as keyof IBoardInform);
          }
        })
      })
    } else if(sortDir === 'desc') {
      Object.values(this.boardList).map(a => {
        Object.keys(a).find((key) => {
          if(key === sortType) {
            sortAsDesc(this.boardList, key as keyof IBoardInform);
          }
        })
      })
    } 
    return this.boardList;
  }

  findBoardByBbsSeq(paramsSeq: number):BbsModel | undefined {
    const board = this.boardList.find((seq) => seq.bbsSeq === paramsSeq)
    return board;
  }

  findReplyByReplySeq(replySeq: number): ReplyResModel | undefined {
    const reply = this.replyList.find((seq) => seq.replySeq === replySeq);
    return reply;
  }

  postBoard(board: BbsModel): void {
    this.boardList.push(board);
  }

  getPageCount(pageSize: number): number {
    let page = Math.floor(this.boardList.length / pageSize);
    if(this.boardList.length % pageSize > 0) page += 1;
  
    return page;
  }

  deleteBoard(bbsSeq: number): void {
    const boardIndex = this.findBoardIndex(bbsSeq);
    this.boardList.splice(boardIndex, 1);
  }

  deleteReply(replySeq: number): void{
    const replyIndex = this.findReplyIndex(replySeq);
    this.replyList.splice(replyIndex, 1);
  }

  findBoardIndex(bbsSeq: number): number {
    const index = this.boardList.findIndex((bbsModel) => bbsModel.bbsSeq === bbsSeq);
    return index;
  }

  findReplyIndex(replySeq: number): number {
    const index = this.replyList.findIndex((replyModel) => replyModel.bbsSeq === replySeq);
    return index;
  }

  updateBoard(updateModel: BoardModel, reqModel: BoardModel) {
    Object.keys(updateModel).forEach((key) => {
      update(updateModel, reqModel, key as keyof BoardModel);
    })
  }

  updateReply(updateModel: ReplyReqModel, reqModel: ReplyReqModel) {
    Object.keys(updateModel).forEach((key) => {
      update(updateModel, reqModel, key as keyof ReplyReqModel);
    })
  }

  addReplyAtOwnBoard(ownList: ReplyResModel[], paramsSeq: number) {
    this.replyList.map((list) => {
      if(list.bbsSeq === paramsSeq) {
        ownList.push(list)
      }
    });
  }

  postReply(resReply: ReplyResModel) {
    this.replyList.push(resReply);
  }

  getReplyList():ReplyResModel[] {
    return this.replyList;
  }

  selectLastSeq(list: any[]) {
    let seqList:number[] = [0];
    let seq: number = 0;
    list.map((board) => {
      seqList.push(board.bbsSeq)
    })

    seq = Math.max(...seqList)
    console.log(seqList)
    return seq;
  }

}

export default boardService;


