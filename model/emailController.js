import { sendEmailToAddress } from "../services/emailService.js";

export async function sendEmail(req, res) {
  const { destino, titulo, cuerpo } = req.body;

  try {
    const result = await sendEmailToAddress(titulo, cuerpo, destino);

    //   if (result.error) {
    //     res.status(404).json({ error: result.error });
    //   } else {
    res.json({ result });
    //   }
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ error: "Error sending email" });
  }
}
