
import express from 'express';
const router = express.Router();

import UserController from "../controllers/userController";

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

module.exports = router;

export default router;