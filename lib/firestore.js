import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';

export const addScore = async (username, score, age) => {
  const scoresRef = collection(db, 'scores');

  return await addDoc(scoresRef, {
    username: username,
    score: score,
    age: age,
    createdAt: serverTimestamp(),
  });
};

export const getScores = async (username) => {
  const q = query(collection(db, 'scores'), where('username', '==', username), orderBy('score'));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
};
