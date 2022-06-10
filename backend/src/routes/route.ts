
import express from 'express';
const router = express.Router();

import UserController from "../controllers/userController";
import {BoardController} from "../controllers/boardControllers"

//user
router.get("/api/user", (req: express.Request, res: express.Response) => {
  new UserController(req, res).getUser();
});
router.post("/api/user", (req: express.Request, res: express.Response) => {
  new UserController(req, res).postUser();
});
router.delete("/api/user/:id", (req: express.Request, res: express.Response) => {
  new UserController(req, res).deleteUser();
});
router.put("/api/user", (req: express.Request, res: express.Response) => {
  new UserController(req, res).updateUser();
});

//board
router.get("/api/board", (req: express.Request, res: express.Response) => {
  new BoardController(req, res).getBoardList();
});
router.get("/api/board/:bbsSeq", (req: express.Request, res: express.Response) => {
  new BoardController(req, res).getBoardDetail();
});
router.post("/api/board/:id", (req: express.Request, res: express.Response) => {
  new BoardController(req, res).postBoard();
});
router.delete("/api/board/:bbsSeq", (req: express.Request, res: express.Response) => {
  new BoardController(req, res).deleteBoard();
});
router.put("/api/board/:bbsSeq", (req: express.Request, res: express.Response) => {
  new BoardController(req, res).updateBoard();
});

//reply
router.get("/api/board/:bbsSeq/reply", (req: express.Request, res: express.Response) => {
  new BoardController(req, res).getReplyList();
});
router.post("/api/board/:bbsSeq/reply", (req: express.Request, res: express.Response) => {
  new BoardController(req, res).postReply();
});

module.exports = router;

export default router;