import express from "express";
// import { IBoardInform } from "../interface";
import BbsModel from "../model/includeSeqModel";
import BoardService from "../services/boardService";
import { EStatusCode } from "../enum";
import ResponseMessage from "../common/responseMessage";
import { ESortType, ESortDir} from "../enum/index"

const boardList: BbsModel[] = [];

const a = new BbsModel(1,"1",{ title:'ㅎ', content:''});
const b = new BbsModel(2,"55",{ title:'ㅂ', content:''});
const c = new BbsModel(3,"3",{ title:'ㅁ', content:''});
const d = new BbsModel(4,"4",{ title:'ㄴ', content:''});
const e = new BbsModel(5,'5',{ title:'ㄱ', content:''});
const f = new BbsModel(6,'6',{ title:'ㄹ', content:''});
const g = new BbsModel(7,'7',{ title:'ㅎㅎ', content:''});
const h = new BbsModel(8,'8',{ title:'ㅁㅁ', content:''});
const i = new BbsModel(9,'9',{ title:'ㄴㄴ', content:''});
const j = new BbsModel(10,'10',{ title:'ㅇㅇ', content:''});
boardList.push(a,b,c,d,e,f,g,h,i,j);

class BoardResponse {
  res: express.Response;
  constructor(res: express.Response) {
    this.res = res;
  }

  response(status: number, msg: string , data: BbsModel[] | BbsModel, totalPage?: number, pageSize?: number, pageNum?: number, sortBy?: ESortType, sortDir?: string) {
    this.res.status(status).send({status:status, msg: msg, totalPage: totalPage, pageSize, pageNum: pageNum, sortBy: sortBy, sortDir: sortDir, data: data})
  }
}

class BoardController {
  req: express.Request;
  res: express.Response;
  boardResponse: BoardResponse;
  boardService: BoardService;

  constructor(req: express.Request, res: express.Response) {
    this.req = req;
    this.res = res;

    this.boardResponse = new BoardResponse(this.res);
    this.boardService = new BoardService(boardList)
  }

  getBoardList() {
    let countPerPage: any = this.req.query.countPerPage;
    let pageNo: any = this.req.query.pageNo;
    let sortBy: any = this.req.query.sortBy;
    let sortDir: any = this.req.query.sortDir;
    
    this.boardService.getCountInform(countPerPage, pageNo);

    if(pageNo > 0) {
      this.boardService.sortBoardList(sortBy, sortDir)
      this.boardService.createBoardPageList(countPerPage, pageNo);
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getBoardPageList(), this.boardService.getTotalCount(), countPerPage, pageNo, sortBy, sortDir);
    } else {
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getBoardList(), this.boardService.getTotalCount(), countPerPage, pageNo, sortBy, sortDir);
    }
  }

  getBoardDetail() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const board: BbsModel | undefined = this.boardService.findBoardByBbsSeq(paramsSeq);
    if(board) {
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, board)
    } else {
      this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_BBSSEQ, [])
    }
  }
 
}


export {BoardController, boardList};
