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
import { useMediaQuery } from "react-responsive";

const Schema = Yup.object().shape({
  msg: Yup.string().required("required"),
});

type FormItem = {
  msg: string;
};

export const ChatPage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
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
  const [paddingBottom, setPaddingBottom] = useState<string>(
    isMobile ? "7rem" : "1rem"
  );
  const [rows, setRows] = useState<number>(1);

  useEffect(() => {
    scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // debounce scroll

  // add window scroll event listener
  useEffect(() => {
    const windowScroll = _.debounce((e) => {
      // console.log(window.scrollY);
      // console.log(document.body.scrollHeight);
      if (isMobile) {
        const scrollTop = window.scrollY;
        const scrollHeight = document.body.scrollHeight;
        const clientHeight = window.innerHeight;
        // console.log(scrollTop + clientHeight, scrollHeight);
        if (scrollTop + clientHeight + 200 < scrollHeight) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }, 100);

    window.addEventListener("scroll", windowScroll);
    return () => {
      window.removeEventListener("scroll", windowScroll);
    };
  }, []);

  const handleScroll = _.debounce((e) => {
    if (!isMobile) {
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight;
      const clientHeight = e.target.clientHeight;
      // console.log(scrollTop + clientHeight, scrollHeight);
      if (scrollTop + clientHeight + 200 < scrollHeight) {
        setVisible(true);
      } else {
        setVisible(false);
      }
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

  const handleRows = (rows: number) => {
    const _rows = rows > 5 ? 5 : rows;
    setRows(_rows);
    if (isMobile) {
      setPaddingBottom(`${_rows * 1.5 + 5.5}rem`);
    }
    setTimeout(() => {
      isMobile
      ? window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        })
      : scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
    }, 50);
  };

  return (
    <div className="d-flex justify-content-center chatroom-wrapper px-sm-4 pt-sm-3 pb-sm-5">
      <div className="chatroom shadow d-flex flex-column position-relative">
        <div className="room-title d-none d-sm-block border-bottom text-center py-3 shadow">
          Realtime Chat Room
        </div>
        <div
          onClick={() => {
            isMobile
              ? window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              : scrollRef.current.scrollTo({
                  top: scrollRef.current.scrollHeight,
                  behavior: "smooth",
                });
          }}
          style={{
            borderRadius: "50%",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateX(100%)",
          }}
          className={`${
            isMobile ? "position-fixed" : "position-absolute"
          } scroll-to pointer bg-dark transition mb-5 mb-sm-0 shadow`}
        >
          <Icon svg name="arrow-down" size={30} color={"white"} />
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="room-content hideScroll pt-5 pt-sm-1"
          style={{
            paddingBottom: paddingBottom,
          }}
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
        <div className="border-top pt-3 pb-5 pb-sm-3 input-fixed">
          <Formik
            initialValues={{
              msg: "",
            }}
            validationSchema={Schema}
            onSubmit={onSubmit}
          >
            {({ values }) => (
              <Form
                className="d-flex w-100 px-4"
                onChange={() => {
                  handleRows(values.msg?.split("\n").length);
                }}
              >
                <div className="col">
                  <InputField
                    style={{
                      backgroundColor: "rgba(54, 57, 63, 0.8)",
                      border: "none",
                      caretColor: "white",
                      color: "white",
                      resize: "none",
                    }}
                    name="msg"
                    placeholder="Input something..."
                    type="textarea"
                    showError={false}
                    rows={rows}
                  />
                </div>

                <div className="d-flex align-items-center">
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
