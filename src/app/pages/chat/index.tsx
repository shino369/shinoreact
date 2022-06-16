import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Link } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";
import { useMediaQuery } from "react-responsive";

// react suite
import ReadyRoundIcon from "@rsuite/icons/ReadyRound";
import PeoplesIcon from "@rsuite/icons/Peoples";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import SearchIcon from "@rsuite/icons/Search";
import CopyIcon from "@rsuite/icons/Copy";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";

// form
import { Input, Table } from "reactstrap";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

// firebase
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "app/hooks/firebase";

// library
import moment from "moment";
import _ from "lodash";

// hook
import { useFirestoreQuery } from "app/hooks/commonHook";

// style
import "./index.scss";

// component
import { ChatItem, Icon, InputField } from "app/components";
import ConfimrDialog from "app/components/dialog/confirmDialog";
import { toast } from "react-toastify";

const Schema = Yup.object().shape({
  msg: Yup.string().required("required"),
});

type FormItem = {
  msg: string;
};

const ICON_COLOR = "#fff";
const CHAT_TOP_HEIGHT = "3.5rem";
const ICON_SIZE = 15;

interface PendingAction {
  action: string;
  id: string;
}

export const ChatPage = () => {
  const { user } = useSelector((rootState: RootState) => rootState.auth);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const [newMessage, setNewMessage] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>();
  const [showRooms, setShowRooms] = useState<boolean>(!isMobile);
  const [activeRoom, setActiveRoom] = useState<string>("public");
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomDialog, setNewRoomDialog] = useState<boolean>(false);
  const [joinRoomDialog, setJoinRoomDialog] = useState<boolean>(false);

  const [paddingBottom, setPaddingBottom] = useState<string>(
    isMobile ? "7rem" : "1rem"
  );
  const [rows, setRows] = useState<number>(1);

  const [querying, setQuerying] = useState<any>(
    query(collection(db, "messages"), orderBy("createdAt"), limit(100))
  );
  const headerRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);

  // change query when activeRoom change
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

  /*
  fake data to prevent heavy read of firestore in testing
  [
    {
      displayName: "test",
      id: "gkjshgkjsnh",
      photoURL: "",
      createdAt: "",
      uid: "safsgsakfasj",
      message: "safakgalgalj",
    },
  ]; 
  */

  useEffect(() => {
    dispatch(setActiveRoute("chat"));
  }, [dispatch]);

  // scroll to bottom when new message come
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

  // get rooms list
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

  // refresh list when activeRoom change
  useEffect(() => {
    getTotalRooms();
  }, [activeRoom, getTotalRooms]);

  // scroll to bottom button effect (body in mobile)
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

  // scroll to bottom button effect (container in breakpoint > sm)
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

  // add new room
  const handleAddNewRoom = useCallback(
    async (room: any) => {
      const newRoom = await addDoc(collection(db, "rooms"), {
        name: room,
        members: [user!.uid],
      });
      // add subcollection messages to newRoom
      await addDoc(collection(db, "rooms", newRoom.id, "messages"), {
        uid: user!.uid,
        displayName: user!.displayName,
        photoURL: user!.photoURL,
        message: "Welcome to the room",
        createdAt: Timestamp.now(),
      });

      setNewRoomDialog(false);
      setActiveRoom(newRoom.id);
    },
    [user]
  );

  const handleJoinRoom = useCallback(
    async (room: any) => {
      const roomRef = doc(db, "rooms", room);
      const roomData = await getDoc(roomRef);
      if (roomData.exists()) {
        const members = roomData.data().members;
        if (members.includes(user!.uid)) {
          setActiveRoom(room);
          setJoinRoomDialog(false);
        } else {
          // add user into members
          await updateDoc(roomRef, {
            members: [...members, user!.uid],
          });
          setActiveRoom(room);
        }
      } else {
        toast.error("Room not found");
      }
    },
    [user]
  );

  // handle form submit new message
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

  // auto grow textarea
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

  // delete message
  const deleteChatItem = useCallback(
    async (id: string) => {
      if (activeRoom === "public") {
        const res = await deleteDoc(doc(db, "messages", id));
      } else {
        const res = await deleteDoc(
          doc(db, "rooms", activeRoom, "messages", id)
        );
      }

      // console.log(res);
    },
    [activeRoom]
  );

  // after confirm dialog
  const handleOptions = () => {
    if (pendingAction && pendingAction.action === "DELETE") {
      deleteChatItem(pendingAction.id);
    }
    setPendingAction(undefined);
    setIsOpen(false);
  };

  return (
    <div className="d-flex justify-content-center chatroom-wrapper px-sm-4 pt-sm-3 pb-sm-5">
      <div
        className={`${
          isMobile ? "d-none" : ""
        } start-0 h-100 d-flex align-items-start justify-content-start bg-room overflow-hidden`}
      >
        <div
          className={`p-0 d-flex flex-column h-100 justify-content-start position-relative`}
        >
          <div
            className="d-flex align-items-center"
            style={{
              minHeight: CHAT_TOP_HEIGHT,
            }}
          >
            <div
              onClick={() => {
                setShowRooms(!showRooms);
              }}
              className="d-sm-none btn ms-1 mt-1 bg-dark pointer hover-opacity p-0 d-flex justify-content-center align-items-center"
              style={{
                borderRadius: "50%",
                width: 30,
                height: 30,
                zIndex: 20,
              }}
            >
              <PeoplesIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={ICON_COLOR}
              />
            </div>
            <div
              onClick={() => {
                setNewRoomDialog(true);
              }}
              className={`${
                !showRooms ? "d-none" : ""
              } btn ms-1 bg-dark mt-1 pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
              style={{
                borderRadius: "50%",
                width: 30,
                height: 30,
                zIndex: 20,
              }}
            >
              <PlusRoundIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={ICON_COLOR}
              />
            </div>
            <div
              onClick={() => {
                setJoinRoomDialog(true);
              }}
              className={`${
                !showRooms ? "d-none" : ""
              } btn ms-1 bg-dark mt-1 pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
              style={{
                borderRadius: "50%",
                width: 30,
                height: 30,
                zIndex: 20,
              }}
            >
              <SearchIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={ICON_COLOR}
              />
            </div>
          </div>

          <div
            className="transition me-1 overflow-scroll"
            style={{
              // transform: showRooms ? "translateX(0)" : "translateX(-8rem)",
              width: "8rem",
              fontSize: "0.75rem",

              left: "0px",
              zIndex: 10,
            }}
          >
            {[{ name: "public", id: "public" }, ...rooms].map((item, index) => (
              <div key={index} className="mb-1 text-white p-0 text-start w-100">
                <div
                  onClick={() => {
                    if (activeRoom !== item.id) {
                      setActiveRoom(item.id);
                    }
                    isMobile && setShowRooms(false);
                  }}
                  className="px-2 bg-chat pointer d-flex w-100 justify-content-between align-items-center"
                >
                  <div className="col">{item.name}</div>
                  <div className="col-2 py-2">
                    <ArrowRightLineIcon
                      width={20}
                      height={20}
                      fill={ICON_COLOR}
                    />
                  </div>
                </div>
                {item.id !== "public" && (
                  <div className="px-2 d-flex align-items-center">
                    <div className="text-break col">{item.id}</div>
                    <div
                      onClick={() => {
                        // copy text to clipboard
                        navigator.clipboard.writeText(item.id);
                      }}
                      className="col-2 d-flex justify-content-end pointer"
                    >
                      <CopyIcon
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        fill={ICON_COLOR}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`chatroom shadow d-flex flex-column position-relative ${
          isMobile ? "" : "overflow-hidden"
        }`}
      >
        <div
          onClick={() => {
            setShowRooms(!showRooms);
          }}
          className={`${
            showRooms && isMobile ? "" : "d-none"
          } backdrop position-absolute w-100 h-100`}
          style={{ zIndex: 1010 }}
        />
        <div
          className={`${
            isMobile ? "position-fixed" : "d-none"
          } start-0 h-100 d-flex align-items-start justify-content-start`}
          style={{ zIndex: 1020 }}
        >
          <div
            className={`p-0 d-flex ${
              isMobile
                ? "flex-column align-items-center"
                : "d-flex align-items-start"
            } h-100 justify-content-start position-relative`}
          >
            <div className="d-flex align-items-center">
              <div
                onClick={() => {
                  setShowRooms(!showRooms);
                }}
                className="btn ms-1 mt-1 bg-dark pointer hover-opacity p-0 d-flex justify-content-center align-items-center"
                style={{
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  zIndex: 20,
                }}
              >
                <PeoplesIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={ICON_COLOR}
                />
              </div>
              <div
                onClick={() => {
                  setNewRoomDialog(true);
                }}
                className={`${
                  !showRooms ? "d-none" : ""
                } btn ms-1 bg-dark mt-1 pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
                style={{
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  zIndex: 20,
                }}
              >
                <PlusRoundIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={ICON_COLOR}
                />
              </div>
              <div
                onClick={() => {
                  setJoinRoomDialog(true);
                }}
                className={`${
                  !showRooms ? "d-none" : ""
                } btn ms-1 bg-dark mt-1 pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
                style={{
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  zIndex: 20,
                }}
              >
                <SearchIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  fill={ICON_COLOR}
                />
              </div>
            </div>
            <div
              className="transition shadow pe-1 bg-primary position-absolute h-100"
              style={{
                transform: showRooms ? "translateX(0)" : "translateX(-8rem)",
                width: "8rem",
                fontSize: "0.75rem",
                paddingTop: "4rem",
                left: "0px",
                zIndex: 10,
              }}
            >
              {[{ name: "public", id: "public" }, ...rooms].map(
                (item, index) => (
                  <div
                    key={index}
                    className="mb-1 text-white p-0 text-start w-100"
                  >
                    <div
                      onClick={() => {
                        if (activeRoom !== item.id) {
                          setActiveRoom(item.id);
                        }
                        isMobile && setShowRooms(false);
                      }}
                      className="px-2 bg-chat pointer d-flex w-100 justify-content-between align-items-center"
                    >
                      <div className="col">{item.name}</div>
                      <div className="col-2 py-2">
                        <ArrowRightLineIcon
                          width={20}
                          height={20}
                          fill={ICON_COLOR}
                        />
                      </div>
                    </div>
                    {item.id !== "public" && (
                      <div className="px-2 d-flex align-items-center">
                        <div className="text-break col">{item.id}</div>
                        <div
                          onClick={() => {
                            // copy text to clipboard
                            navigator.clipboard.writeText(item.id);
                          }}
                          className="col-2 d-flex justify-content-end pointer"
                        >
                          <CopyIcon
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            fill={ICON_COLOR}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div
          ref={headerRef}
          className="room-title d-none d-sm-flex justify-content-center align-items-center border-bottom text-center shadow"
          style={{
            height: CHAT_TOP_HEIGHT,
            fontSize: "1rem",
          }}
        >
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
          <Icon svg name="arrow-down" size={20} color={"white"} />
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
              <Form className="d-flex w-100 px-4" onChange={() => {}}>
                <div className="col">
                  <InputField
                    onInputChange={(e: any) => {
                      e !== "" &&
                        e.length > 0 &&
                        handleRows(e.split("\n").length);
                    }}
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
                    <ReadyRoundIcon width={30} height={30} fill={ICON_COLOR} />
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
          handleAddNewRoom(e);
        }}
      />
      <ConfimrDialog
        open={joinRoomDialog}
        title={"Join room"}
        message={"Please input Room ID to join a room."}
        withInput
        onCancel={() => {
          setJoinRoomDialog(false);
        }}
        onConfirm={(e) => {
          handleJoinRoom(e);
        }}
      />
    </div>
  );
};
