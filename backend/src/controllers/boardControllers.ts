import express from "express";
import { IBoardInform, IReplyInform } from "../interface";
import BoardResModel from "../model/boardResModel";
import BoardReqModel from "../model/boardReqModel";
import ReplyReqModel from "../model/replyReqModel";
import ReplyResModel from "../model/replyResModel"
import BoardService from "../services/boardService";
import { EStatusCode } from "../enum";
import ResponseMessage from "../common/responseMessage";
import { ESortType} from "../enum/index"

const boardList: BoardResModel[] = [];
const replyList: ReplyResModel[] = [];


class BoardResponse {
  res: express.Response;
  constructor(res: express.Response) {
    this.res = res;
  }

  response(status: number, msg: string , data: BoardResModel[] | BoardResModel | ReplyResModel[] | ReplyResModel, totalLength?: number, totalPage?: number, pageSize?: number, pageNum?: number, sortBy?: ESortType, sortDir?: string) {
    this.res.status(status).send({status:status, msg: msg, totalLength: totalLength, totalPage : totalPage, pageSize: pageSize, pageNum: pageNum, sortBy: sortBy, sortDir: sortDir, data: data})
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
    this.boardService = new BoardService(boardList, replyList)
  }

  getBoardList() {
    let countPerPage: any = this.req.query.countPerPage;
    let pageNo: any = this.req.query.pageNo;
    let sortBy: any = this.req.query.sortBy;
    let sortDir: any = this.req.query.sortDir;
    let totalPage: number = this.boardService.getPageCount(countPerPage);
    
    this.boardService.getCountInform(countPerPage, pageNo);

    if(pageNo > 0) {
      this.boardService.sortBoardList(sortBy, sortDir)
      this.boardService.createBoardPageList(countPerPage, pageNo);
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getBoardPageList(), this.boardService.getTotalCount(), totalPage, countPerPage, pageNo, sortBy, sortDir);
    } else {
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getBoardList(), this.boardService.getTotalCount(), countPerPage, pageNo, sortBy, sortDir);
    }
  }

  getBoardDetail() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const board: BoardResModel | undefined = this.boardService.findBoardByBbsSeq(paramsSeq);
    if(board) {
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, board)
    } else {
      this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_BBSSEQ, [])
    }
  }

  postBoard() {
    const reqBoard: BoardReqModel = new BoardReqModel(this.req.body as IBoardInform)
    const paramsId: number = Number(this.req.params.id);
    const bbsSeq: number = boardList.length + 1;
    const board: BoardResModel = new BoardResModel(bbsSeq, paramsId ,reqBoard);

    if(board.isValidation()) {
      this.boardService.postBoard(board);
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, board)
    } else {
      this.boardResponse.response(EStatusCode.WRONGFORMAT, ResponseMessage.WRONG_FORMAT, []);
    }
  }

  deleteBoard() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    if(this.boardService.findBoardIndex(paramsSeq) !== -1) {
      this.boardService.deleteBoard(paramsSeq);
      this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getBoardList())
    } else {
      this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_BBSSEQ, [])
    }
   
  }

  updateBoard() {
    const reqBoard: BoardReqModel = new BoardReqModel(this.req.body as IBoardInform);
    const paramsId: number = Number(this.req.body.id);
    const bbsSeq: number = Number(this.req.params.bbsSeq);
    const board: BoardResModel = new BoardResModel(bbsSeq, paramsId ,reqBoard);
    if(board.isValidation()) {
      const resBoard: BoardResModel | undefined = this.boardService.findBoardByBbsSeq(bbsSeq);
      if(resBoard) {
        this.boardService.updateBoard(resBoard, board);
        this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getBoardList())
      } else {
        this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_BBSSEQ, []);
      }
    } else {
      this.boardResponse.response(EStatusCode.WRONGFORMAT, ResponseMessage.WRONG_FORMAT, []);
    }
  }

  getReplyList() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const ownreplyList:ReplyResModel[]  = [];
    this.boardService.addReplyAtOwnBoard(ownreplyList, paramsSeq)
    this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, ownreplyList)
  }

  postReply() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const reqReply: ReplyReqModel = new ReplyReqModel(this.req.body as IReplyInform);
    const replySeq: number = replyList.length + 1;
    const resReply: ReplyResModel = new ReplyResModel(reqReply, paramsSeq, replySeq);

    if(resReply.isValidation()) {
      if(this.boardService.findBoardIndex(paramsSeq) !== -1) {
        this.boardService.postReply(resReply);
        this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, resReply)
      } else {
        this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_BBSSEQ, [])
      }
    } else {
      this.boardResponse.response(EStatusCode.WRONGFORMAT, ResponseMessage.WRONG_FORMAT, []);
    }
  }

  deleteReply() {
    const paramsBbsSeq: number = Number(this.req.params.bbsSeq);
    const paramsReplySeq: number = Number(this.req.params.replySeq);
    if(this.boardService.findBoardByBbsSeq(paramsBbsSeq) !== undefined) {
      if(this.boardService.findReplyIndex(paramsBbsSeq) !== -1) {
        this.boardService.deleteReply(paramsReplySeq);
        this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getReplyList())
      } else {
        this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_REPLYSEQ, [])
      }
    } else {
      this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_BBSSEQ, [])
    }
    
  }

  updateReply() {
    const paramsBbsSeq: number = Number(this.req.params.bbsSeq);
    const paramsReplySeq: number = Number(this.req.params.replySeq);
    const reqReply: ReplyReqModel = new ReplyReqModel(this.req.body as IReplyInform);
    if(reqReply.isValidation()) {
      if(this.boardService.findBoardByBbsSeq(paramsBbsSeq) !== undefined) {
        if(this.boardService.findReplyIndex(paramsReplySeq) !== -1) {
          let reply = this.boardService.findReplyByReplySeq(paramsReplySeq);
          if(reply)
          this.boardService.updateReply(reply, reqReply);
          this.boardResponse.response(EStatusCode.SUCCESS, ResponseMessage.SUCCESS, this.boardService.getReplyList())
        } else {
          this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_REPLYSEQ, []);
        }
      } else {
        this.boardResponse.response(EStatusCode.NOTFOUND, ResponseMessage.NOT_FOUNT_BBSSEQ, []);
      }
    } else {
      this.boardResponse.response(EStatusCode.WRONGFORMAT, ResponseMessage.WRONG_FORMAT, []);
    }
  }
}


export {BoardController, boardList};
