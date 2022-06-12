// import { useCallback, useEffect, useState } from 'react';

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";
import {
  addDoc,
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
} from "firebase/firestore";
import { db } from "app/hooks/firebase";
import { RootState } from "store";
import moment from "moment";
import { Input, Table } from "reactstrap";
import { useFirestoreQuery } from "app/hooks/commonHook";
import "./index.scss";
import { ChatItem, Icon, InputField } from "app/components";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import _ from "lodash";

const Schema = Yup.object().shape({
  msg: Yup.string().required("required"),
});

type FormItem = {
  msg: string;
};

export const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((rootState: RootState) => rootState.auth);
  const [newMessage, setNewMessage] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setActiveRoute("chat"));
  }, [dispatch]);
  const _q = query(
    collection(db, "messages"),
    orderBy("createdAt"),
    limit(100)
  );
  const messages = useFirestoreQuery(_q);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // debounce scroll

  const handleScroll = _.debounce((e) => {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight;
    const clientHeight = e.target.clientHeight;
    console.log(scrollTop + clientHeight, scrollHeight);
    if (scrollTop + clientHeight + 200 < scrollHeight) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, 100);

  // const handleScroll = (e: any) => {
  //   const scrollTop = e.target.scrollTop;
  //   const scrollHeight = e.target.scrollHeight;
  //   const clientHeight = e.target.clientHeight;
  //   console.log(scrollTop + clientHeight, scrollHeight);
  //   if (scrollTop + clientHeight + 200 < scrollHeight) {
  //     setVisible(true);
  //   }else{
  //     setVisible(false);
  //   }
  // };

  // useEffect(() => {

  //   const _q = query(collection(db, "messages"), orderBy("createdAt"), limit(100));
  //   const unsubscribe = onSnapshot(_q, (snapshot) => {
  //     const data = snapshot.docs.map(
  //       (doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       })
  //     )
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
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const onSubmit = async (
    values: FormItem,
    actions: FormikHelpers<FormItem>
  ) => {
    const { msg } = values;
    const trimmed = msg.trim();
    if (trimmed.length > 0) {
      const _q = collection(db, "messages");

      const message = {
        uid: user!.uid,
        displayName: user!.displayName,
        photoURL: user!.photoURL,
        message: trimmed,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, "messages"), message);
    }
    actions.resetForm();
    // console.log("values", values);
    // submit to firebase
  };

  return (
    <div className="d-flex justify-content-center chatroom-wrapper px-4 pt-3 pb-5">
      <div className="chatroom rounded overflow-hidden shadow d-flex flex-column position-relative">
        <div className="room-title border-bottom text-center py-3 shadow">
          Realtime Chat Room
        </div>
        <div
          onClick={() => {
            scrollRef.current.scrollTo({
              top: scrollRef.current.scrollHeight,
              behavior: "smooth",
            });
          }}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateX(100%)",
          }}
          className="position-absolute scroll-to pointer transition"
        >
          <Icon svg name="arrow-down" size={30} color={"white"} />
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="room-content hideScroll"
        >
          {messages.map((item, index) => (
            <ChatItem
              key={index}
              name={item.displayName}
              message={item.message}
              self={user?.uid === item?.uid}
              avatar={item.photoURL}
              uid={item.uid}
              createdAt={item.createdAt}
            />
          ))}
        </div>
        <div className="border-top pt-3">
          <Formik
            initialValues={{
              msg: "",
            }}
            validationSchema={Schema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form className="d-flex w-100 px-4">
                <div className="col">
                  <InputField
                    style={{
                      backgroundColor: "rgba(54, 57, 63, 0.8)",
                      border: "none",
                      caretColor: "white",
                      color: "white",
                    }}
                    name="msg"
                    placeholder="Input something..."
                    type="text"
                    showError={false}
                  />
                </div>

                <div className="">
                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    // disabled={loginLoading}
                  >
                    SEND
                  </button>
                </div>
                <div className="mt-4 text-center"></div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
