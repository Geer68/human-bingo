import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/index.js";
import { selectQuestions } from "./randomSortService.js";

export async function insertEventDB(event) {
  const { title, size, randomQuestions, sponsorQuestions } = event;

  const newEvent = {
    title: title || "",
    size: size || 0,
    url: title.replace(/\s+/g, "-").toLowerCase(),
    randomQuestions: randomQuestions || [],
    sponsorQuestions: sponsorQuestions || [],
  };

  try {
    const existingEvent = await getEventID(newEvent.title);

    if (existingEvent != null) {
      return { error: "Event already exists" };
    } else {
      const docRef = await addDoc(collection(db, "events"), newEvent);

      return {
        msg: "Nuevo evento insertado",
        id: docRef.id,
        url: newEvent.url,
      };
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    return { error: "Error adding document" };
  }
}

export async function existingEventByID(eventID) {
  const eventRef = collection(db, "events");
  const querySnapshot = await getDocs(eventRef);

  for (const doc of querySnapshot.docs) {
    if (doc.id === eventID) {
      return doc.id;
    }
  }

  return null;
}

export async function getEventID(eventName) {
  const eventRef = collection(db, "events");
  const querySnapshot = await getDocs(eventRef);

  for (const doc of querySnapshot.docs) {
    if (doc.data().title === eventName) {
      return doc.id;
    }
  }

  return null;
}

export async function getEventByID(eventID) {
  const eventRef = collection(db, "events");
  const querySnapshot = await getDocs(eventRef);

  const idEvento = await getEventIDByURL(eventID);

  let eventData = null;
  for (const doc of querySnapshot.docs) {
    if (doc.id === idEvento) {
      eventData = doc.data();
      break;
    }
  }

  if (!eventData) {
    return null;
  }

  return {
    size: eventData.size,
    questions: await selectQuestions(eventData),
    title: eventData.title,
  };
}

export async function getEventIDByURL(url) {
  const eventRef = collection(db, "events");
  const querySnapshot = await getDocs(eventRef);

  for (const doc of querySnapshot.docs) {
    if (doc.data().url === url) {
      return doc.id;
    }
  }

  return null;
}
