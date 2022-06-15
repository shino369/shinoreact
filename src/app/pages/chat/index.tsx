// import { useCallback, useEffect, useState } from 'react';

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";
import ReadyRoundIcon from "@rsuite/icons/ReadyRound";
import PeoplesIcon from "@rsuite/icons/Peoples";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
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
import ConfimrDialog from "app/components/dialog/confirmDialog";

const Schema = Yup.object().shape({
  msg: Yup.string().required("required"),
});

type FormItem = {
  msg: string;
};

interface PendingAction {
  action: string;
  id: string;
}

export const ChatPage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const dispatch = useDispatch();
  const { user } = useSelector((rootState: RootState) => rootState.auth);
  const [newMessage, setNewMessage] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>();
  const [showRooms, setShowRooms] = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState<string>("public");
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomDialog, setNewRoomDialog] = useState<boolean>(false);
  const scrollRef = useRef<any>(null);
  const [paddingBottom, setPaddingBottom] = useState<string>(
    isMobile ? "7rem" : "1rem"
  );
  const [rows, setRows] = useState<number>(1);

  const [querying, setQuerying] = useState<any>(
    query(collection(db, "messages"), orderBy("createdAt"), limit(100))
  );

  useEffect(() => {
    if (activeRoom === "public") {
      setQuerying(
        query(collection(db, "messages"), orderBy("createdAt"), limit(100))
      );
    } else {
      setQuerying(
        query(
          collection(db, "rooms", activeRoom, "messages"),
          orderBy("createdAt"),
          limit(100)
        )
      );
    }
  }, [activeRoom]);

  const messages = useFirestoreQuery(querying);

  useEffect(() => {
    dispatch(setActiveRoute("chat"));
  }, [dispatch]);

  useEffect(() => {
    isMobile
      ? window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        })
      : scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
  }, [messages]);

  const getTotalRooms = useCallback(async () => {
    const q = query(
      collection(db, "rooms"),
      where("members", "array-contains", user!.uid)
    );
    const querySnapshot = await getDocs(q);
    let roomTotal: any = [];
    querySnapshot.forEach((doc) => {
      roomTotal.push({ id: doc.id, ...doc.data() });
    });
    setRooms(roomTotal);
  }, [user]);

  useEffect(() => {
    getTotalRooms();
  }, [activeRoom, getTotalRooms]);

  useEffect(() => {
    const windowScroll = _.debounce((e) => {
      if (isMobile) {
        const scrollTop = window.scrollY;
        const scrollHeight = document.body.scrollHeight;
        const clientHeight = window.innerHeight;
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

  const handleAddNewRoom = useCallback(async (room: any) => {
    const newRoom = await addDoc(collection(db, "rooms"), {
      name: room,
      members: [user!.uid],
    });
    // add subcollection messages to newRoom
    await addDoc(collection(db, "rooms", newRoom.id, "messages"), {
      uid: user!.uid,
      displayName: user!.displayName,
      photoURL: user!.photoURL,
      message: 'Welcome to the room',
      createdAt: Timestamp.now(),
    });

    setNewRoomDialog(false);
    setActiveRoom(newRoom.id);
  }
  , [user]);
    

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

  const onSubmit = async (
    values: FormItem,
    actions: FormikHelpers<FormItem>
  ) => {
    const { msg } = values;
    const trimmed = msg.trim();
    if (trimmed.length > 0) {
      const _q =
        activeRoom === "public"
          ? collection(db, "messages")
          : collection(db, "rooms", activeRoom, "messages");

      const message = {
        uid: user!.uid,
        displayName: user!.displayName,
        photoURL: user!.photoURL,
        message: trimmed,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(_q, message);
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

  const deleteChatItem = useCallback(async (id: string) => {
    const res = await deleteDoc(doc(db, "messages", id));
    // console.log(res);
  }, []);

  const handleOptions = () => {
    if (pendingAction && pendingAction.action === "DELETE") {
      deleteChatItem(pendingAction.id);
    }
    setPendingAction(undefined);
    setIsOpen(false);
  };

  return (
    <div className="d-flex justify-content-center chatroom-wrapper px-sm-4 pt-sm-3 pb-sm-5">
      <div className="chatroom shadow d-flex flex-column position-relative">
        <div
          onClick={() => {
            setShowRooms(!showRooms);
          }}
          className={`${
            showRooms ? "" : "d-none"
          } backdrop position-absolute w-100 h-100`}
          style={{ backdropFilter: "blur(2px)", zIndex: 1010 }}
        />
        <div
          className="position-fixed start-0 h-100 d-flex align-items-start justify-content-start"
          style={{ zIndex: 1020 }}
        >
          <div className="p-0 d-flex flex-column h-100 justify-content-start align-items-center position-relative">
            <div
              onClick={() => {
                setShowRooms(!showRooms);
              }}
              className="btn ms-1 mt-2 bg-dark pointer hover-opacity p-0 d-flex justify-content-center align-items-center"
              style={{ borderRadius: "50%", width: 30, height: 30, zIndex: 20 }}
            >
              <PeoplesIcon width={15} height={15} fill={"#fff"} />
            </div>
            <div
              onClick={() => {
                setNewRoomDialog(true);
              }}
              className="btn ms-1 bg-dark mt-1 pointer hover-opacity p-0 d-flex justify-content-center align-items-center"
              style={{ borderRadius: "50%", width: 30, height: 30, zIndex: 20 }}
            >
              <PlusRoundIcon width={15} height={15} fill={"#fff"} />
            </div>
            <div
              className="transition bg-primary position-absolute h-100"
              style={{
                transform: showRooms ? "translateX(0)" : "translateX(-1000px)",
                width: "8rem",
                fontSize: "0.75rem",
                paddingTop: "4rem",
                left: "0px",
                zIndex: 10,
              }}
            >
              {[{ name: "public", id: "public" }, ...rooms].map(
                (item, index) => (
                  <button
                    onClick={() => {
                      setActiveRoom(item.id);
                      setShowRooms(false);
                    }}
                    key={index}
                    className="my-2 bg-primary text-white px-3 py-1"
                  >
                    {item.name}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
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
              onPress={(action) => {
                setPendingAction({ action: action, id: item.id });
                setIsOpen(true);
              }}
            />
          ))}
        </div>
        <div
          className="border-top pt-3 pb-5 pb-sm-3 input-fixed"
          style={{ zIndex: 30 }}
        >
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
                    className="btn p-0"
                    style={{ borderRadius: "50%", border: "none" }}
                    type="submit"
                    // disabled={loginLoading}
                  >
                    <ReadyRoundIcon width={40} height={40} fill={"#fff"} />
                  </button>
                </div>
                <div className="mt-4 text-center"></div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ConfimrDialog
        open={isOpen}
        title={"Confirm delete?"}
        message={"Deleted content cannot be recovered."}
        onCancel={() => {
          setPendingAction(undefined);
          setIsOpen(false);
        }}
        onConfirm={() => {
          handleOptions();
        }}
      />
      <ConfimrDialog
        open={newRoomDialog}
        title={"Add new room"}
        message={"Please input room name."}
        withInput
        onCancel={() => {
          setNewRoomDialog(false);
        }}
        onConfirm={(e) => {
          handleAddNewRoom(e)
        }}
      />
    </div>
  );
};
