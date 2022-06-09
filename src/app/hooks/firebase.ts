import { firebaseConfig } from "app/assets/firebase";
import { initializeApp } from "firebase/app";

const useFirebase = () => {
  initializeApp(firebaseConfig);
};
export default useFirebase;