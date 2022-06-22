import express from "express";
import { IReqBoardInform, IReqReplyInform, IResInform} from "../interface";
import BoardResModel from "../model/boardResModel";
import BoardReqModel from "../model/boardReqModel";
import ReplyReqModel from "../model/replyReqModel";
import ReplyResModel from "../model/replyResModel"
import BoardService from "../services/boardService";
import { EStatusCode } from "../enum";
import ResponseMessage from "../common/responseMessage";

const boardList: BoardResModel[] = [];
const replyList: ReplyResModel[] = [];


class BoardResponse {
  res: express.Response;
  constructor(res: express.Response) {
    this.res = res;
  }

  response(res:IResInform) {
    this.res.status(res.status).send(res)
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
    console.log(this.boardService.getBoardPageList())

    if(pageNo > 0) {
      this.boardService.sortBoardList(sortBy, sortDir)
      this.boardService.createBoardPageList(countPerPage, pageNo);
      this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: this.boardService.getBoardPageList(), totalLength : this.boardService.getTotalCount(), totalPage: totalPage, pageSize: countPerPage, pageNum: pageNo, sortBy: sortBy, sortDir: sortDir});
    } else {
      this.boardResponse.response({status: EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: this.boardService.getBoardList(), totalLength : this.boardService.getTotalCount(), pageSize: countPerPage, pageNum: pageNo, sortBy: sortBy, sortDir: sortDir});
    }
  }

  getBoardDetail() {
    const paramsSeq = Number(this.req.params.bbsSeq);
    const board: BoardResModel | undefined = this.boardService.findBoardByBbsSeq(paramsSeq);
    if(board) {
      this.boardResponse.response({status: EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: board})
    } else {
      this.boardResponse.response({status: EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_BBSSEQ, data: []})
    }
  }

  postBoard() {
    const reqBoard: BoardReqModel = new BoardReqModel(this.req.body as IReqBoardInform)
    const paramsId: number = Number(this.req.params.id);
    let bbsSeq: number = 0;
    bbsSeq = this.boardService.selectLastBbsSeq(boardList) + 1;
    const board: BoardResModel = new BoardResModel(bbsSeq, paramsId ,reqBoard);

    if(board.isValidation()) {
      this.boardService.postBoard(board);
      this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: board})
    } else {
      this.boardResponse.response({status:EStatusCode.WRONGFORMAT, msg: ResponseMessage.WRONG_FORMAT, data: []});
    }
  }

  deleteBoard() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    if(this.boardService.findBoardIndex(paramsSeq) !== -1) {
      this.boardService.deleteBoard(paramsSeq);
      this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: this.boardService.getBoardList()})
    } else {
      this.boardResponse.response({status:EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_BBSSEQ, data: []})
    }
  }

  updateBoard() {
    const reqBoard: BoardReqModel = new BoardReqModel(this.req.body as IReqBoardInform);
    const paramsId: number = Number(this.req.body.id);
    const bbsSeq: number = Number(this.req.params.bbsSeq);
    const board: BoardResModel = new BoardResModel(bbsSeq, paramsId ,reqBoard);
    if(board.isValidation()) {
      const resBoard: BoardResModel | undefined = this.boardService.findBoardByBbsSeq(bbsSeq);
      if(resBoard) {
        this.boardService.updateBoard(resBoard, board);
        this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: board})
      } else {
        this.boardResponse.response({status:EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_BBSSEQ, data: []});
      }
    } else {
      this.boardResponse.response({status:EStatusCode.WRONGFORMAT, msg: ResponseMessage.WRONG_FORMAT, data: []});
    }
  }

  getReplyList() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const ownreplyList:ReplyResModel[]  = [];
    this.boardService.getOwnReply(ownreplyList, paramsSeq)
    this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: ownreplyList})
  }

  postReply() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const paramsId: number = Number(this.req.params.id); //
    const reqReply: ReplyReqModel = new ReplyReqModel(this.req.body as IReqReplyInform);
    let replySeq: number = 0;
    replySeq = this.boardService.selectLastReplySeq(replyList) + 1;
    const resReply: ReplyResModel = new ReplyResModel(reqReply, paramsSeq, replySeq, paramsId);
    if(resReply.isValidation()) {
      if(this.boardService.findBoardIndex(paramsSeq) !== -1) {
        this.boardService.postReply(resReply);
        this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: resReply})
      } else {
        this.boardResponse.response({status:EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_BBSSEQ, data: []})
      }
    } else {
      this.boardResponse.response({status:EStatusCode.WRONGFORMAT, msg: ResponseMessage.WRONG_FORMAT, data: []});
    }
  }

  /**
   * 1.게시글이 존재한다면 삭제하려는 replySeq가 replyList에 존재하는지 체크한다.
   * 2.해당 replySeq 값을 replyList 에서 삭제한다.
   * 3.삭제 후 replyLilst 에서 해당 bbsSeq값을 가지고있는 댓글들을 ownreplyList에 담아 data로 뿌려준다.
   */
  
  deleteReply() {
    const paramsBbsSeq: number = Number(this.req.params.bbsSeq);
    const paramsReplySeq: number = Number(this.req.params.replySeq);
    const ownreplyList:ReplyResModel[]  = [];
    if(this.boardService.findBoardByBbsSeq(paramsBbsSeq) !== undefined) {
      if(this.boardService.findReplyIndex(paramsReplySeq) !== -1) {
        this.boardService.deleteReply(paramsReplySeq);
        this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: ownreplyList});
      } else {
        this.boardResponse.response({status:EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_REPLYSEQ, data: []});
      }
    } else {
      this.boardResponse.response({status:EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_BBSSEQ, data: []});
    }
  }

  updateReply() {
    const paramsBbsSeq: number = Number(this.req.params.bbsSeq);
    const paramsReplySeq: number = Number(this.req.params.replySeq);
    const reqReply: ReplyReqModel = new ReplyReqModel(this.req.body as IReqReplyInform);
    const ownreplyList:ReplyResModel[]  = [];
    if(reqReply.isValidation()) {
      if(this.boardService.findReplyByReplySeq(paramsReplySeq) !== undefined) {
        if(this.boardService.findReplyIndex(paramsReplySeq) !== -1) {
          let reply = this.boardService.findReplyByReplySeq(paramsReplySeq);
          if(reply)
          this.boardService.updateReply(reply, reqReply);
          this.boardService.getOwnReply(ownreplyList, paramsBbsSeq);
          this.boardResponse.response({status:EStatusCode.SUCCESS, msg: ResponseMessage.SUCCESS, data: ownreplyList});
        } else {
          this.boardResponse.response({status:EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_REPLYSEQ, data: []});
        }
      } else {
        this.boardResponse.response({status:EStatusCode.NOTFOUND, msg: ResponseMessage.NOT_FOUNT_BBSSEQ, data: []});
      }
    } else {
      this.boardResponse.response({status:EStatusCode.WRONGFORMAT, msg: ResponseMessage.WRONG_FORMAT, data: []});
    }
  }
}


export {BoardController, boardList};
