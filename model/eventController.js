import {
  getEventByID,
  getEventID,
  insertEventDB,
} from "../services/eventsService.js";

export async function insertEvent(req, res) {
  const { title, size, randomQuestions, sponsorsQuestions } = req.body.evento;

  console.log("Inserting new event: ", title);

  const event = {
    title: title || "",
    size: size || 0,
    randomQuestions: randomQuestions || [],
    sponsorQuestions: sponsorsQuestions || [],
  };

  try {
    const existingEvent = await getEventID(event.title);

    if (existingEvent != null) {
      console.error("Event already exists: ", event.title);
      return res.status(406).json({ error: "Event already exists" });
    } else {
      const docRef = await insertEventDB(event);

      res.status(201).json({
        msg: `Nuevo evento creado para: ${title}`,
        id: docRef.id,
        url: docRef.url,
      });
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(500).json({ error: "Error adding document" });
  }
}

export async function getEvent(req, res) {
  const eventID = req.query.eventID;

  try {
    const eventData = await getEventByID(eventID);

    if (eventData == null) {
      console.error("Event not found: ", eventID);
      return res.status(404).json({ error: "Event not found" });
    } else {
      res.json({ id: eventID, eventData });
    }
  } catch (e) {
    console.error("Error getting event: ", e);
    res.status(500).json({ error: "Error getting event" });
  }
}
