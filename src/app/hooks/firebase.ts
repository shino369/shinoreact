import { firebaseConfig } from "app/assets/firebase";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const useFirebase = () => {
  initializeApp(firebaseConfig);
};
export default useFirebase;

const db = getFirestore(initializeApp(firebaseConfig))

export {db}