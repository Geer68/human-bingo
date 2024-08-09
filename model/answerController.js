import {
  getAnswersByEventID,
  insertAnswerDB,
} from "../services/answersService.js";
import { sendEmailToAddress } from "../services/emailService.js";
import { existingEventByID } from "../services/eventsService.js";

export async function insertAnswer(req, res) {
  try {
    const { nombre, email, title, momentoRespuesta, answers } = req.body.answer;
    const { idEvento } = req.body;

    const answer = {
      nombre: nombre || "",
      email: email || "",
      momentoRespuesta: momentoRespuesta || "",
      answers: answers || [],
    };

    const result = await insertAnswerDB(idEvento, answer);
    await sendEmailToAddress(
      idEvento,
      answer,
      answer.email,
      "noreply@nerdconf.com"
    );

    if (result.error) {
      res.status(404).json({ error: result.error });
    } else {
      res.json({ msg: result.msg, id: result.id });
    }
  } catch (e) {
    console.error("Error adding answer: ", e);
    res.status(500).json({ error: "Error adding answer" });
  }
}

export async function getAnswer(req, res) {
  const { eventID } = req.body;

  try {
    if ((await existingEventByID(eventID)) == null) {
      return res.status(404).json({ error: "Not existing event" });
    }

    const answers = await getAnswersByEventID(eventID);

    if (answers.length === 0) {
      console.error("Answers not found: ", eventID);
      return res.status(404).json({ error: "Answers not found" });
    } else {
      res.json({ id: eventID, answers, total: answers.length });
    }
  } catch (e) {
    console.error("Error getting answer: ", e);
    res.status(500).json({ error: "Error getting answers" });
  }
}
