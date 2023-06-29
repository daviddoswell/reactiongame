import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';

export const addScore = async (username, score, age, gender) => {
  const scoresRef = collection(db, 'scores');

  return await addDoc(scoresRef, {
    username: username,
    score: score,
    age: age,
    gender: gender,
    createdAt: serverTimestamp(),
  });
};

export const getScores = async () => {
  const q = query(collection(db, 'scores'), orderBy('score'));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
};
