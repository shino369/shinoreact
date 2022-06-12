import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  Query,
  DocumentData,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setAuthenticated, setUser } from "store/auth";
import moment from "moment";

export function useFirestoreQuery(query: Query<DocumentData>) {
    const [docs, setDocs] = useState<any[]>([]);
  
    // Re-run data listener only if query has changed
    useEffect(() => {
      
      const unsubscribe = onSnapshot(query, (snapshot) => {

  //     // snapshot.docChanges().forEach((change) => {
  //     //   if (change.type === "added") {
  //     //     console.log("New: ", change.doc.data());
  //     //   }
  //     //   if (change.type === "modified") {
  //     //     console.log("Modified: ", change.doc.data());
  //     //   }
  //     //   if (change.type === "removed") {
  //     //     console.log("Removed: ", change.doc.data());
  //     //   }
  //     //   const msg = change.doc.data();
  //     //   setMessages((prev) => [...prev, msg]);
  //     // });


        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: moment(doc.data()?.createdAt?.toDate()).format(
            "YY-MM-DD HH:mm"
          ) || "",
        }));
        // Update state
        setDocs(data);
        // console.log(data);
      });
  
      // Detach listener
      return unsubscribe;
    }, []);
  
    return docs;
  }
  
  export function useAuthState() {
    const dispatch = useDispatch();
    const auth = getAuth();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(setAuthenticated(true));
          dispatch(setUser(user));
        } else {
          dispatch(setAuthenticated(false));
          dispatch(setUser(null));
          localStorage.clear();
        }
      });
  
      return () => {
        unsubscribe();
      };
    }, [auth, dispatch]);
  
  }
  
  export function useLocalStorage(key: string, initialValue: any) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });
  
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: (arg0: any) => any) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };
  
    return [storedValue, setValue];
  }
  
  