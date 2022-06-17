import CustomDropdown from "../form/dropdown";
import "./chatItem.scss";

interface Props {
  name: string;
  uid: string;
  self: boolean;
  message: string;
  avatar: string;
  imageURL?: string[];
  createdAt: string;
  parentLength: number;
  itemIndex: number;
  onPress: (item: string) => void;
  scrollToBottom: () => void;
}

const ChatItem: React.FC<Props> = ({
  name,
  uid,
  self = true,
  message,
  avatar,
  imageURL,
  createdAt,
  parentLength,
  itemIndex,
  onPress,
  scrollToBottom,
}) => {
  const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  const renderText = (txt: string) =>
    txt.split(" ").map((part, index) =>
      URL_REGEX.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      ) : (
        part + " "
      )
    );

  return self ? (
    <div className="mb-2 me-2">
      <div className={`d-flex mb-2 justify-content-end align-items-center`}>
        <div className="date col text-end me-2">{createdAt}</div>
        <CustomDropdown
          data={["DELETE"]}
          icon={"options"}
          size={15}
          color={"#fff"}
          onPress={(item: string) => {
            onPress(item);
          }}
        />
      </div>
      <div className={`d-flex mb-2 justify-content-end`}>
        <div className="chat-bubble">
          <div className="message">{renderText(message)}</div>
          {imageURL && (
            <div className="image-container">
              {imageURL.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                  }}
                  onLoad={() => {
                    if (
                      imageURL.length === index + 1 &&
                      parentLength === itemIndex + 1
                    ) {
                      setTimeout(() => {
                        scrollToBottom();
                      }, 50);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
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
      <div className="chat-bubble">
        <div className="message">{renderText(message)}</div>
        {imageURL && (
          <div className="image-container">
            {imageURL.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={url}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.5rem",
                }}
                onLoad={() => {
                  if (
                    imageURL.length === index + 1 &&
                    parentLength === itemIndex + 1
                  ) {
                    setTimeout(() => {
                      scrollToBottom();
                    }, 50);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
