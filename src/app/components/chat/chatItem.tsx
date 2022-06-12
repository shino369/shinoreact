import "./chatItem.scss";

interface Props {
  name: string;
  uid: string;
  self: boolean;
  message: string;
  avatar: string;
  createdAt: string;
}

const ChatItem: React.FC<Props> = ({
  name,
  uid,
  self = true,
  message,
  avatar,
  createdAt,
}) => {
  return self ? (
    <div className="mb-2 me-2">
      <div className={`d-flex mb-2 justify-content-end`}>
        <div className="date col text-end">{createdAt}</div>
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
