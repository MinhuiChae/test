import express from "express";
import { IBoardInform } from "../interface";
import BoardModel from "../model/boardModel";
import BoardService from "../services/boardService";

const boardList: BoardModel[] = [];

class BoardResponse {
  res: express.Response;
  constructor(res: express.Response) {
    this.res = res;
  }

  response(status: number, msg: string, data: BoardModel[]) {
    this.res.status(status).send({status:status, msg: msg, data: data })
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
}

