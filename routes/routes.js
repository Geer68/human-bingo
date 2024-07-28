import { Router } from "express";
import { getEvent, insertEvent } from "../model/eventController.js";
import { getAnswer, insertAnswer } from "../model/answerController.js";
import authenticateToken from "../middleware/auth.js";
import { port } from "../config/index.js";

const router = Router();

router.post("/insertEvent", authenticateToken, insertEvent);

router.post("/insertAnswer", authenticateToken, insertAnswer);

router.get("/getEvent", authenticateToken, getEvent);

router.get("/getAnswers", authenticateToken, getAnswer);

router.get("/", (req, res) => {
  res.status(200).send(`puerto: ${port}`);
});

export default router;
