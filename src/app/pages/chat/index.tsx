import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Link } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";
import { useMediaQuery } from "react-responsive";
import ImageUploading, { ImageListType } from "react-images-uploading";

// react suite
import ReadyRoundIcon from "@rsuite/icons/ReadyRound";
import PeoplesIcon from "@rsuite/icons/Peoples";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import SearchIcon from "@rsuite/icons/Search";
import CopyIcon from "@rsuite/icons/Copy";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import ExitIcon from "@rsuite/icons/Exit";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import WarningRoundIcon from "@rsuite/icons/WarningRound";

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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
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
  msg: Yup.string(),
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

interface Room {
  id: string;
  name: string;
}

interface ModalAction {
  action: string;
  isOpen: boolean;
}

export const ChatPage = () => {
  const { user } = useSelector((rootState: RootState) => rootState.auth);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const [newMessage, setNewMessage] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>();
  const [showRooms, setShowRooms] = useState<boolean>(!isMobile);
  const [activeRoom, setActiveRoom] = useState<Room>({
    id: "public",
    name: "public",
  });
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [modalAction, setModalAction] = useState<ModalAction>({
    action: "",
    isOpen: false,
  });

  const [paddingBottom, setPaddingBottom] = useState<string>(
    isMobile ? "7rem" : "8rem"
  );
  const [rows, setRows] = useState<number>(1);

  const [querying, setQuerying] = useState<any>(
    query(collection(db, "messages"), orderBy("createdAt"), limit(100))
  );

  const [images, setImages] = useState<any>([]);

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const headerRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);

  const storage = getStorage();

  // change query when activeRoom change
  useEffect(() => {
    if (activeRoom.id === "public") {
      setQuerying(
        query(collection(db, "messages"), orderBy("createdAt"), limit(100))
      );
    } else {
      setQuerying(
        query(
          collection(db, "rooms", activeRoom.id, "messages"),
          orderBy("createdAt"),
          limit(100)
        )
      );
    }
  }, [activeRoom]);

  const messages = useFirestoreQuery(querying);

  // get rooms list and set active user
  const getTotalRooms = useCallback(
    async (msgs: any) => {
      const roomQ = query(
        collection(db, "rooms"),
        where("members", "array-contains", user!.uid)
      );
      const querySnapshotRoom = await getDocs(roomQ);
      let roomTotal: any = [];
      querySnapshotRoom.forEach((doc) => {
        roomTotal.push({ id: doc.id, ...doc.data() });
      });

      if (activeRoom.id !== "public") {
        const roomDetail = roomTotal.find(
          (room: any) => room.id === activeRoom.id
        );
        const userQ = query(
          collection(db, "users"),
          where("uid", "in", roomDetail.members)
        );
        const querySnapshotUser = await getDocs(userQ);
        let members: any = [];
        querySnapshotUser.forEach((doc) => {
          members.push({ id: doc.id, ...doc.data() });
        });
        setActiveMembers(members);
        console.log(members);
      } else if (activeRoom.id === "public") {
        // remove duplicate from message by uid
        const unique = _.uniqBy(msgs, "uid").map((f: any) => ({
          photoURL: f.photoURL,
          displayName: f.displayName,
          uid: f.uid,
        }));
        setActiveMembers(unique);
      }

      setRooms(roomTotal);
      console.log("triggered");
    },
    [activeRoom]
  );

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

    getTotalRooms(messages);
  }, [messages, getTotalRooms]);

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

      setModalAction({ action: "", isOpen: false });
      setActiveRoom({ id: newRoom.id, name: room });
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
          setActiveRoom({ id: roomData.id, name: roomData.data().name });
          setModalAction({ action: "", isOpen: false });
        } else {
          // add user into members
          await updateDoc(roomRef, {
            members: [...members, user!.uid],
          });
          setActiveRoom({ id: roomData.id, name: roomData.data().name });
          setModalAction({ action: "", isOpen: false });
        }
      } else {
        toast("ERROR 404: Room not found", {
          theme: "colored",
          position: isMobile ? "top-center" : "top-right",
          className: "opacity-toast text-white",
        });
      }
    },
    [user]
  );

  const handleLeaveRoom = useCallback(async () => {
    if (activeRoom.id !== "public") {
      const roomRef = doc(db, "rooms", activeRoom.id);
      const newMemberList = activeMembers.filter(
        (mem) => mem.uid !== user!.uid
      );
      await updateDoc(roomRef, { members: newMemberList });
    }
    setActiveRoom({ id: "public", name: "Public" });
    setModalAction({ action: "", isOpen: false });
  }, [activeMembers]);

  // handle form submit new message
  const onSubmit = async (
    values: FormItem,
    actions: FormikHelpers<FormItem>
  ) => {
    // handle image
    const imageURL: string[] = [];
    if (images.length > 0) {
      const load = toast.loading(`Uploading image...`, {
        theme: "colored",
        position: "top-right",
        className: "opacity-toast text-white",
      });
      for (let i = 0; i < images.length; i++) {
        const metadata = {
          contentType: images[i].file.type,
        };
        const storageRef = ref(storage, "images/" + images[i].file.name);
        const uploadTask = uploadBytesResumable(storageRef, images[i].file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                console.log("User doesnt have permission to access the object");
                break;
              case "storage/canceled":
                console.log("User canceled the upload");
                break;
              case "storage/unknown":
                console.log("Unknown error occurred");
                break;
            }
          },
          async () => {
            // Upload completed successfully, now we can get the download URL
            await getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                imageURL.push(downloadURL);

                if (imageURL.length === images.length) {
                  console.log("all uploads done");
                  console.log(imageURL);
                  // handle text message
                  const { msg } = values;
                  const trimmed = msg?.trim();

                  const _q =
                    activeRoom.id === "public"
                      ? collection(db, "messages")
                      : collection(db, "rooms", activeRoom.id, "messages");

                  const message = {
                    uid: user!.uid,
                    displayName: user!.displayName,
                    photoURL: user!.photoURL,
                    message: trimmed || "",
                    imageURL: imageURL,
                    createdAt: Timestamp.now(),
                  };

                  const docRef = await addDoc(_q, message);

                  actions.resetForm();
                  setImages([]);
                  toast.update(load, {render: 'Images Uploaded successfully', type: 'default', className: 'opacity-toast text-white', autoClose: 2000, isLoading: false}); 
                }
              }
            );
          }
        );
      }
    } else {
      const { msg } = values;
      const trimmed = msg.trim();
      if (trimmed.length > 0) {
        const _q =
          activeRoom.id === "public"
            ? collection(db, "messages")
            : collection(db, "rooms", activeRoom.id, "messages");

        const message = {
          uid: user!.uid,
          displayName: user!.displayName,
          photoURL: user!.photoURL,
          message: trimmed,
          imageURL: imageURL,
          createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(_q, message);
      }
      actions.resetForm();
      setImages([]);
    }

    // console.log("values", values);
    // submit to firebase
  };

  // auto grow textarea
  const handleRows = (rows: number) => {
    const _rows = rows > 5 ? 5 : rows;
    setRows(_rows);
    isMobile
      ? setPaddingBottom(`${_rows * 1.5 + 5.5}rem`)
      : setPaddingBottom(`${_rows * 1.5 + 6.5}rem`);

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
      if (activeRoom.id === "public") {
        const res = await deleteDoc(doc(db, "messages", id));
      } else {
        const res = await deleteDoc(
          doc(db, "rooms", activeRoom.id, "messages", id)
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
    setModalAction({ action: "", isOpen: false });
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
                setModalAction({ action: "add", isOpen: true });
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
                setModalAction({ action: "join", isOpen: true });
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
            className="transition me-1 overflow-auto border-bottom-chat"
            style={{
              // transform: showRooms ? "translateX(0)" : "translateX(-12rem)",
              width: "12rem",
              fontSize: "0.75rem",
              height: "calc(50% - 3.5rem)",
              left: "0px",
              zIndex: 10,
            }}
          >
            {[{ name: "public", id: "public" }, ...rooms].map((item, index) => (
              <div key={index} className="mb-1 text-white p-0 text-start w-100">
                <div
                  onClick={() => {
                    if (activeRoom.id !== item.id) {
                      setActiveRoom({ id: item.id, name: item.name });
                    }
                    isMobile && setShowRooms(false);
                  }}
                  className="px-2 bg-chat pointer d-flex w-100 justify-content-between align-items-center"
                >
                  <div className="col">{item.name}</div>
                  <div className="col-2 py-2 d-flex justify-content-center">
                    <ArrowRightLineIcon
                      width={20}
                      height={20}
                      fill={ICON_COLOR}
                    />
                  </div>
                </div>
                {item.id !== "public" && (
                  <div className="px-2 d-flex align-items-center py-2">
                    <div className="text-break col">{item.id}</div>
                    <div
                      onClick={() => {
                        // copy text to clipboard
                        navigator.clipboard.writeText(item.id);
                        toast("Room ID Copied to clipboard", {
                          theme: "colored",
                          position: "top-right",
                          className: "opacity-toast text-white",
                        });
                      }}
                      className="col-2 d-flex justify-content-center pointer"
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
          <div className="text-white" style={{ flexGrow: 1 }}>
            <div
              className="my-2 ms-2 d-flex align-items-center justify-content-between"
              style={{ fontSize: "0.75rem" }}
            >
              Member :
              <div>
                <div
                  onClick={() => {
                    setModalAction({ action: "leave", isOpen: true });
                  }}
                  className={`${
                    activeRoom.id === "public" ? "d-none" : ""
                  } btn me-1 bg-dark pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
                  style={{
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    zIndex: 20,
                  }}
                >
                  <ExitIcon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    fill={ICON_COLOR}
                  />
                </div>
              </div>
            </div>
            <div>
              {activeMembers.map((item, index) => (
                <img
                  key={index}
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    marginLeft: "0.5rem",
                  }}
                  src={item.photoURL}
                  alt="avatar"
                />
              ))}
            </div>
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
                style={{
                  zIndex: 20,
                  minHeight: "30px",
                }}
                className={`rounded-pill pointer badge p-2 mt-1 ms-1 shadow ${
                  showRooms ? "d-none" : "bg-dark"
                }`}
              >
                {activeRoom.name}
              </div>
              <div
                onClick={() => {
                  setModalAction({ action: "add", isOpen: true });
                }}
                className={`${
                  !showRooms ? "d-none" : ""
                } btn ms-1 bg-chat mt-1 pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
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
                  setModalAction({ action: "join", isOpen: true });
                }}
                className={`${
                  !showRooms ? "d-none" : ""
                } btn ms-1 bg-chat mt-1 pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
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
              className="transition pe-1 shadow bg-primary position-absolute h-100"
              style={{
                transform: showRooms ? "translateX(0)" : "translateX(-12rem)",
                width: "12rem",
                fontSize: "0.75rem",
                paddingTop: "4rem",
                left: "0px",
                zIndex: 10,
              }}
            >
              <div className="h-50 border-bottom-chat overflow-auto">
                {[{ name: "public", id: "public" }, ...rooms].map(
                  (item, index) => (
                    <div
                      key={index}
                      className="mb-1 text-white p-0 text-start w-100"
                    >
                      <div
                        onClick={() => {
                          if (activeRoom.id !== item.id) {
                            setActiveRoom({ id: item.id, name: item.name });
                          }
                          isMobile && setShowRooms(false);
                        }}
                        className="px-2 bg-chat pointer d-flex w-100 justify-content-between align-items-center"
                      >
                        <div className="col">{item.name}</div>
                        <div className="col-2 py-2 d-flex justify-content-center">
                          <ArrowRightLineIcon
                            width={20}
                            height={20}
                            fill={ICON_COLOR}
                          />
                        </div>
                      </div>
                      {item.id !== "public" && (
                        <div className="px-2 d-flex align-items-center py-2">
                          <div className="text-break col">{item.id}</div>
                          <div
                            onClick={() => {
                              // copy text to clipboard
                              navigator.clipboard.writeText(item.id);
                              toast("Room ID Copied to clipboard", {
                                theme: "colored",
                                position: "top-center",
                                className: "opacity-toast text-white",
                              });
                            }}
                            className="col-2 d-flex justify-content-center pointer"
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
              <div className="text-white" style={{ flexGrow: 1 }}>
                <div className="my-2 ms-2 d-flex justify-content-between align-items-center">
                  Member :
                  <div>
                    <div
                      onClick={() => {
                        setModalAction({ action: "leave", isOpen: true });
                      }}
                      className={`${
                        activeRoom.id === "public" ? "d-none" : ""
                      } btn me-1 bg-chat pointer hover-opacity p-0 d-flex justify-content-center align-items-center`}
                      style={{
                        borderRadius: "50%",
                        width: 30,
                        height: 30,
                        zIndex: 20,
                      }}
                    >
                      <ExitIcon
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        fill={ICON_COLOR}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {activeMembers.map((item, index) => (
                    <img
                      key={index}
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: "50%",
                        marginLeft: "0.5rem",
                      }}
                      src={item.photoURL}
                      alt="avatar"
                    />
                  ))}
                </div>
              </div>
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
          {activeRoom.name}
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
              parentLength={messages.length}
              itemIndex={index}
              name={item.displayName}
              message={item.message}
              self={user?.uid === item?.uid}
              avatar={item.photoURL}
              imageURL={item.imageURL}
              uid={item.uid}
              createdAt={item.createdAt}
              onPress={(action) => {
                setPendingAction({ action: action, id: item.id });
                setModalAction({ action: "delete", isOpen: true });
              }}
              scrollToBottom={() => {
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
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onImageChange}
                    maxNumber={undefined}
                    onError={(e) => {
                      toast.error(
                        e?.maxFileSize
                          ? "image must be smaller than 2MB"
                          : "Unsupported format",
                        {
                          theme: "colored",
                          position: isMobile ? "top-center" : "top-right",
                          className: "opacity-toast text-white",
                        }
                      );
                    }}
                    maxFileSize={2 * 1024 * 1024}
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      errors,
                    }) => (
                      // write your building UI
                      <div
                        className={`${
                          isMobile ? "" : "position-relative"
                        } upload__image-wrapper d-flex`}
                      >
                        <div
                          className={`${
                            isMobile ? "" : "me-4"
                          } d-flex overflow-auto end-0 position-fixed`}
                          style={{
                            bottom: paddingBottom,
                            maxWidth: isMobile
                              ? "100vw"
                              : scrollRef?.current?.offsetWidth,
                          }}
                        >
                          {imageList.map((image, index) => (
                            <div key={index} className="image-item d-flex">
                              <img
                                src={image.dataURL}
                                alt=""
                                height="100"
                                className="me-2"
                              />
                              <button
                                className="btn p-0 me-2 align-self-start"
                                style={{ borderRadius: "50%", border: "none" }}
                                onClick={() => onImageRemove(index)}
                              >
                                <WarningRoundIcon
                                  width={15}
                                  height={15}
                                  fill={ICON_COLOR}
                                />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className={`btn p-0 me-2`}
                          style={{ borderRadius: "50%", border: "none" }}
                          onClick={onImageUpload}
                        >
                          <FileUploadIcon
                            width={30}
                            height={30}
                            fill={ICON_COLOR}
                          />
                        </button>
                      </div>
                    )}
                  </ImageUploading>

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
        open={modalAction.isOpen}
        title={
          modalAction.action === "delete"
            ? "Confirm delete?"
            : modalAction.action === "add"
            ? "Add new room"
            : modalAction.action === "join"
            ? "Join room"
            : modalAction.action === "leave"
            ? "Leave room"
            : ""
        }
        withInput={["add", "join"].includes(modalAction.action)}
        message={
          modalAction.action === "delete"
            ? "Deleted content cannot be recovered."
            : modalAction.action === "add"
            ? "Please input room name."
            : modalAction.action === "join"
            ? "Please input Room ID to join a room."
            : modalAction.action === "leave"
            ? "Confirm to leave this room?"
            : ""
        }
        onCancel={() => {
          if (modalAction.action === "delete") {
            setPendingAction(undefined);
          }
          setModalAction({ action: "", isOpen: false });
        }}
        onConfirm={(e) => {
          switch (modalAction.action) {
            case "delete":
              handleOptions();
              break;
            case "add":
              handleAddNewRoom(e);
              break;
            case "join":
              handleJoinRoom(e);
              break;
            case "leave":
              handleLeaveRoom();
          }
        }}
      />
      {/* <ConfimrDialog
        open={modalAction.isOpen}
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
        open={modalAction.isOpen}
        title={"Join room"}
        message={"Please input Room ID to join a room."}
        withInput
        onCancel={() => {
          setJoinRoomDialog(false);
        }}
        onConfirm={(e) => {
          handleJoinRoom(e);
        }}
      /> */}
    </div>
  );
};
