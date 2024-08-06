import { Router } from "express";
import { port } from "../config/index.js";
import authenticateToken from "../middleware/auth.js";
import { getAnswer, insertAnswer } from "../model/answerController.js";
import { sendEmail } from "../model/emailController.js";
import { getEvent, insertEvent } from "../model/eventController.js";

const router = Router();

router.post("/insertEvent", authenticateToken, insertEvent);

router.post("/insertAnswer", authenticateToken, insertAnswer);

router.get("/getEvent", authenticateToken, getEvent);

router.get("/getAnswers", authenticateToken, getAnswer);

router.post("/sendEmail", authenticateToken, sendEmail);

router.get("/", (req, res) => {
  res.status(200).send(`puerto: ${port}`);
});

export default router;
