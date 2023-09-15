import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import Row from "../models/row";

const firebaseConfig = {
  apiKey: "AIzaSyAB39A1eVvhFbTIqol1yB8sIrbv9Allqpg",
  authDomain: "ynab-47641.firebaseapp.com",
  projectId: "ynab-47641",
  storageBucket: "ynab-47641.appspot.com",
  messagingSenderId: "166507618318",
  appId: "1:166507618318:web:2586479d23433cfc855c5f",
  measurementId: "G-WL97FFD4EH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
export const auth = getAuth();
const provider = new GoogleAuthProvider();

export const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.info({ user });
    // alert(`Welcome ${user.displayName}!`);
    return user;
  } catch (error) {
    console.error(error);
    // alert(error.message);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);

    return { errorCode, errorMessage, email, credential };
  }
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.info("Sign-out successful.");
      alert("Sign-out successful.");
    })
    .catch((error) => {
      // An error happened.
      console.error(error);
      alert(error.message);
    });
};

const TRACKER_COLLECTION = "tracker";
export const getTrackingData = async (date) => {
  try {
    const rows = [];
    const querySnapshot = date
      ? await getDoc(doc(db, TRACKER_COLLECTION, date))
      : await getDocs(collection(db, TRACKER_COLLECTION));

    if (date) {
      const row = querySnapshot.data();
      const key = querySnapshot.id;
      rows.push(
        new Row({
          date: key,
          ...row,
        })
      );

      return rows;
    } else {
      querySnapshot.forEach((doc) => {
        const row = doc.data();
        const key = doc.id;
        rows.push(
          new Row({
            date: key,
            ...row,
          })
        );
      });

      return rows;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return [];
  }
};

export const updateTrackingData = async (date, data) => {
  // const trackingDateRef = db.collection(TRACKER_COLLECTION).doc(date);
  const trackingRef = doc(db, TRACKER_COLLECTION, date);
  const snapshot = await getDoc(trackingRef);

  if (snapshot.exists()) {
    return updateDoc(trackingRef, data);
  }

  return setDoc(trackingRef, data);
};

export { onAuthStateChanged as onAuthChange };
