//svg 
import { ReactComponent as House } from "app/assets/icons/house.svg";
import { ReactComponent as HouseFill } from "app/assets/icons/house-fill.svg";
import { ReactComponent as ChatFill } from "app/assets/icons/chat-square-dots-fill.svg";
import { ReactComponent as Chat } from "app/assets/icons/chat-square-dots.svg";
import { ReactComponent as Lock } from "app/assets/icons/lock-fill.svg";
import { ReactComponent as Protected } from "app/assets/icons/protected.svg";
import { ReactComponent as Person } from "app/assets/icons/person-fill.svg";
import { ReactComponent as PersonCircle } from "app/assets/icons/person-circle.svg";
import { ReactComponent as Text } from "app/assets/icons/text-fill.svg";
import { ReactComponent as ArrowDown } from "app/assets/icons/arrow-down.svg";


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
      case "lock-fill":
        return <Lock width={size} height={size} fill={color} />;
      case "protected":
        return <Protected width={size} height={size} fill={color} />;
      case "person-fill":
        return <Person width={size} height={size} fill={color} />;
      case "person-circle":
        return <PersonCircle width={size} height={size} fill={color} />;
      case "text-fill":
        return <Text width={size} height={size} fill={color} />;
      case "arrow-down":
        return <ArrowDown width={size} height={size} fill={color} />;
      default:
        return <House width={size} height={size} fill={color} />;
    }
  }
};

export default Icon;
