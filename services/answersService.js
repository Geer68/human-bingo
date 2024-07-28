import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/index.js";
import { existingEventByID } from "./eventsService.js";

export async function insertAnswerDB(idEvento, answer) {
  const newAnswer = {
    id: idEvento || "",
    answer: answer || "",
  };

  try {
    const eventExists = await existingEventByID(idEvento);

    if (eventExists == null) {
      console.error("Event not found: ", idEvento);
      return { error: "Event not found" };
    } else {
      const docRef = await addDoc(collection(db, "answers"), newAnswer);
      console.log("New answer written with ID: ", docRef.id);

      return {
        msg: `Insertada respuesta evento: ${newAnswer.id}`,
        id: docRef.id,
      };
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    return { error: "Error adding document" };
  }
}

export async function getAnswersByEventID(eventID) {
  try {
    console.log("Retrieving answers for event: ", eventID);
    const answerRef = collection(db, "answers");
    const querySnapshot = await getDocs(answerRef);
    const answers = [];

    querySnapshot.forEach((doc) => {
      if (doc.data().id === eventID) {
        answers.push(doc.data().answer);
      }
    });

    return answers;
  } catch (error) {
    console.error("Error retrieving answers: ", error);
    throw new Error("Error retrieving answers");
  }
}
