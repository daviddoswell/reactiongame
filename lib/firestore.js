import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

export const addScore = async (username, score, age, gender) => {
  const scoresRef = collection(db, "scores");

  try {
    return await addDoc(scoresRef, {
      username: username,
      score: score,
      age: age,
      gender: gender,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding score: ", error);
  }
};

export const getScores = async () => {
  const q = query(collection(db, "scores"), orderBy("score"));

  try {
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Compute average scores
    let userScores = {};
    data.forEach(({ id, username, score, age, gender }) => {
      if (userScores[username]) {
        userScores[username].scores.push(score);
      } else if (username && age && gender) {
        // Only create a new entry if all fields are present
        userScores[username] = { scores: [score], age, gender };
      }
    });

    // Transform data for scatter plot
    let averageScores = [];
    for (let username in userScores) {
      const user = userScores[username];
      const averageScore =
        user.scores.reduce((a, b) => a + b, 0) / user.scores.length;
      averageScores.push({
        username,
        score: averageScore,
        age: user.age,
        gender: user.gender,
      });
    }

    return averageScores;
  } catch (error) {
    console.error("Error getting scores: ", error);
  }
};

export const listenScores = (updateScores) => {
  const q = query(collection(db, "scores"), orderBy("score"));

  try {
    return onSnapshot(q, (querySnapshot) => {
      let scores = [];
      let userScores = {}; // Initialize userScores here
      querySnapshot.forEach((doc) => {
        scores.push({ ...doc.data(), id: doc.id });
      });

      // Compute average scores
      scores.forEach(({ id, username, score, age, gender }) => {
        if (userScores[username]) {
          userScores[username].scores.push(score);
        } else if (username && age && gender) {
          // Only create a new entry if all fields are present
          userScores[username] = { scores: [score], age, gender };
        }
      });

      // Transform data for scatter plot
      let averageScores = [];
      for (let username in userScores) {
        const user = userScores[username];
        const averageScore =
          user.scores.reduce((a, b) => a + b, 0) / user.scores.length;
        averageScores.push({
          username,
          score: averageScore,
          age: user.age,
          gender: user.gender,
        });
      }

      updateScores(averageScores);
    });
  } catch (error) {
    console.error("Error listening to scores: ", error);
  }
};
