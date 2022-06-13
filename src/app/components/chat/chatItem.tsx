import CustomDropdown from "../form/dropdown";
import "./chatItem.scss";

interface Props {
  name: string;
  uid: string;
  self: boolean;
  message: string;
  avatar: string;
  createdAt: string;
  onPress: (item: string) => void;
}

const ChatItem: React.FC<Props> = ({
  name,
  uid,
  self = true,
  message,
  avatar,
  createdAt,
  onPress,
}) => {
  return self ? (
    <div className="mb-2 me-2">
      <div className={`d-flex mb-2 justify-content-end align-items-center`}>
        <div className="date col text-end me-2">{createdAt}</div>
        <CustomDropdown
          data={["DELETE"]}
          icon={"options"}
          size={15}
          color={"#fff"}
          onPress={(item:string) =>{ onPress(item); }}
        />
      </div>
      <div className={`d-flex mb-2 justify-content-end`}>
        <div className="chat-bubble">{message}</div>
      </div>
    </div>
  ) : (
    <div className="mb-2">
      <div className={`d-flex mb-2 align-items-center`}>
        <div className="chat-avatar">
          <img
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              marginRight: "0.5rem",
            }}
            src={avatar}
            alt="avatar"
          />
        </div>
        <div>
          <div className="name text-white">{name}</div>
          <div className="date col text-start">{createdAt}</div>
        </div>
      </div>
      <div className="chat-bubble">{message}</div>
    </div>
  );
};

export default ChatItem;
