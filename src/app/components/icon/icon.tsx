//svg 
import { ReactComponent as House } from "app/assets/icons/house.svg";
import { ReactComponent as HouseFill } from "app/assets/icons/house-fill.svg";
import { ReactComponent as ChatFill } from "app/assets/icons/chat-square-dots-fill.svg";
import { ReactComponent as Chat } from "app/assets/icons/chat-square-dots.svg";


export interface Props {
  name: string;
  color: string;
  size: number;
  button?: boolean;
  btnClassName?: string;
  iconClassName?: string;
  svg?: boolean;
  extname?: string;
  onClick?: () => void;
}

const Icon: React.FC<Props> = ({
  name,
  size,
  color,
  iconClassName,
  button,
  btnClassName,
  svg,
  extname = 'svg',
  onClick,
}) => {
  // use img to export svg

  if(!svg){
    if (button) {
      return (
        <button className={`${btnClassName} btn`} onClick={onClick}>
          <img
            src={require(`app/assets/icons/${name}.${extname}`)}
            alt={name}
            width={size}
            height={size}
            className={`${iconClassName}`}
          />
        </button>
      );
    }
    return (
      <img
        src={require(`app/assets/icons/${name}.${extname}`)}
        width={size}
        height={size}
        alt={name}
        className={`${iconClassName}`}
      />
    );
  }else{
    switch(name){
      case "house":
        return <House width={size} height={size} fill={color} />;
      case "house-fill":
        return <HouseFill width={size} height={size} fill={color} />;
      case "chat-fill":
        return <ChatFill width={size} height={size} fill={color} />;
      case "chat":
        return <Chat width={size} height={size} fill={color} />;
      default:
        return <House width={size} height={size} fill={color} />;
    }
  }
};

export default Icon;
