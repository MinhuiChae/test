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
  reqBoard: BoardReqModel;

  constructor(req: express.Request, res: express.Response) {
    this.req = req;
    this.res = res;
    this.boardResponse = new BoardResponse(this.res);
    this.boardService = new BoardService(boardList, replyList)
    this.reqBoard = new BoardReqModel(this.req.body as IReqBoardInform)
  }

  getBoardList() {
    const countPerPage: number = Number(this.req.query.countPerPage);
    const pageNo: number = Number(this.req.query.pageNo);
    const sortBy: string = this.req.query.sortBy as string;
    const sortDir: string = this.req.query.sortDir as string;
    const totalPage: number = this.boardService.getPageCount(countPerPage);
    this.boardResponse.response({
      status:EStatusCode.SUCCESS, 
      msg: ResponseMessage.SUCCESS, 
      data: this.boardService.getBoardList(countPerPage, pageNo, sortBy, sortDir), 
      totalLength : this.boardService.getTotalCount(), 
      totalPage: totalPage, 
      pageSize: countPerPage, 
      pageNum: pageNo, 
      sortBy: sortBy, 
      sortDir: sortDir});
  }

  getBoardDetail() {
    const paramsSeq = Number(this.req.params.bbsSeq);
    const board: BoardResModel | undefined = this.boardService.findBoardByBbsSeq(paramsSeq);

    let response = {
      status: EStatusCode.NOTFOUND,
      msg:  ResponseMessage.NOT_FOUNT_BBSSEQ,
      data: [],
    } as IResInform

    if(board) {
      response = {
        status: EStatusCode.SUCCESS,
        msg:  ResponseMessage.SUCCESS,
        data: board,
      }
    } 
    this.boardResponse.response(response)
  }

  postBoard() {
    const boardId: number = Number(this.req.params.id);
    let response = {
      status: EStatusCode.WRONGFORMAT,
      msg:  ResponseMessage.WRONG_FORMAT,
      data: [],
    } as IResInform

    if (this.reqBoard.isValidation()) {
      const newBoardData = this.boardService.postBoard(this.reqBoard, boardId);
      
      response = {
        status: EStatusCode.SUCCESS,
        msg:  ResponseMessage.SUCCESS,
        data: newBoardData
      }
    } 
    this.boardResponse.response(response)
  }

  deleteBoard() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const getDeleteBoardResponse = this.boardService.getDeleteBoardResponse(paramsSeq);
    let response = {
      status: EStatusCode.NOTFOUND,
      msg:  ResponseMessage.NOT_FOUNT_BBSSEQ,
      data: [],
    } as IResInform

    if(getDeleteBoardResponse) {
      response = {
        status: EStatusCode.SUCCESS,
        msg:  ResponseMessage.SUCCESS,
        data: [],
      }
    } 
    this.boardResponse.response(response)
  }

  /**
   * 1.reqBoard??? ??????????????? ?????? ??????.
   * 2.update ????????? resBoard??? ????????? ????????? ??????.
   * 3.reqBoard??? resBoard??? ?????????.
   */

  updateBoard() {
    const bbsSeq: number = Number(this.req.params.bbsSeq);
    const paramsId: number = Number(this.req.body.id);
    let response = {
      status: EStatusCode.WRONGFORMAT,
      msg:  ResponseMessage.WRONG_FORMAT,
      data: [],
    } as IResInform

    if(this.reqBoard.isValidation()) {
      const updateResponse = this.boardService.getUpdateBoardResponse(bbsSeq, this.reqBoard, paramsId)
      if(updateResponse.status === 200) {
        response = {
          status: EStatusCode.SUCCESS,
          msg:  ResponseMessage.SUCCESS,
          data: updateResponse.data,
        }
      } else {
        response = {
          status: EStatusCode.NOTFOUND,
          msg:  ResponseMessage.NOT_FOUNT_BBSSEQ,
          data: [],
        }
      }
    }
    this.boardResponse.response(response);
  }

  getReplyList() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const list = this.boardService.getReplyListByBoardSeq(paramsSeq)
    this.boardResponse.response({
      status:EStatusCode.SUCCESS, 
      msg: ResponseMessage.SUCCESS, 
      data: list
    })
  }

  postReply() {
    const paramsSeq: number = Number(this.req.params.bbsSeq);
    const paramsId: number = Number(this.req.params.id);
    const reqReply: ReplyReqModel = new ReplyReqModel(this.req.body as IReqReplyInform);
    let response = {
      status: EStatusCode.WRONGFORMAT,
      msg:  ResponseMessage.WRONG_FORMAT,
      data: [],
    } as IResInform

    if(reqReply.isValidation()) {
      const newReply = this.boardService.createNewReply(reqReply, paramsSeq, paramsId);
      const postReplyResponse = this.boardService.getPostReplyResponse(paramsSeq, newReply)
      if(postReplyResponse) {
        response = {
          status: EStatusCode.SUCCESS,
          msg:  ResponseMessage.SUCCESS,
          data: newReply,
        }
      } else {
        response = {
          status: EStatusCode.NOTFOUND,
          msg:  ResponseMessage.NOT_FOUNT_BBSSEQ,
          data: [],
        }
      }
    } 
    this.boardResponse.response(response);
  }

  /**
   * 1.???????????? ??????????????? ??????????????? replySeq??? replyList??? ??????????????? ????????????.
   * 2.?????? replySeq ?????? replyList ?????? ????????????.
   * 3.?????? ??? replyLilst ?????? ?????? bbsSeq?????? ??????????????? ???????????? ownreplyList??? ?????? data??? ????????????.
   */
  
  deleteReply() {
    const paramsBbsSeq: number = Number(this.req.params.bbsSeq);
    const paramsReplySeq: number = Number(this.req.params.replySeq);
    const deleteResponseNum: number = this.boardService.getDeleteReplyResponse(paramsBbsSeq, paramsReplySeq);
    let response = {
      status: EStatusCode.NOTFOUND,
      msg:  ResponseMessage.NOT_FOUNT_REPLYSEQ,
      data: [],
    } as IResInform

    if(deleteResponseNum === 200) {
      response = {
        status: EStatusCode.SUCCESS,
        msg:  ResponseMessage.SUCCESS,
        data: [],
      }
    } else if(deleteResponseNum === 404) {
      response = {
        status: EStatusCode.NOTFOUND,
        msg:  ResponseMessage.NOT_FOUNT_BBSSEQ,
        data: [],
      }
    } 
    this.boardResponse.response(response);
  }

  /**
   * 1.controlelr ???????????? ???????????? ?????? ??????(invalidation)
   * update????????? ????????? ?????? Board??? ??????????????? ????????????.
   * 2.????????? index ??? ????????????.
   * 3.?????? index ?????? -1?????? ????????? ???????????? ???????????? ??????
   * 4.????????? ????????? update ?????? update ?????? ??? list ??? data??? ????????????.
   */

  updateReply() {
    const paramsReplySeq: number = Number(this.req.params.replySeq);
    const paramsBbsSeq: number = Number(this.req.params.bbsSeq);
    const reqReply: ReplyReqModel = new ReplyReqModel(this.req.body as IReqReplyInform);   
    let response = {
      status: EStatusCode.WRONGFORMAT,
      msg:  ResponseMessage.WRONG_FORMAT,
      data: [],
    } as IResInform
    
    if(reqReply.isValidation()) {
      const getUpdateReplyResponse = this.boardService.getUpdateReplyResponse(paramsReplySeq, paramsBbsSeq, reqReply);
      
      if(getUpdateReplyResponse.status === 200) {
        response = {
          status: EStatusCode.SUCCESS,
          msg:  ResponseMessage.SUCCESS,
          data: getUpdateReplyResponse.data,
        }
      } else if(getUpdateReplyResponse.status === 404) {
        response = {
          status: EStatusCode.NOTFOUND,
          msg:  ResponseMessage.NOT_FOUNT_BBSSEQ,
          data: [],
        }
      } else {
        response = {
          status: EStatusCode.NOTFOUND,
          msg:  ResponseMessage.NOT_FOUNT_REPLYSEQ,
          data: [],
        }
      }
    } 
    this.boardResponse.response(response);
  }
}

export {BoardController, boardList};
