export interface Props {
  name: string;
  color: string;
  size: number;
  button?: boolean;
  btnClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const Icon: React.FC<Props> = ({
  name,
  size,
  color,
  iconClassName,
  button,
  btnClassName,
  onClick,
}) => {
  // use img to export svg
  if (button) {
    return (
      <button className={`${btnClassName} btn`} onClick={onClick}>
        <img
          src={require(`app/assets/icons/${name}.svg`)}
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
      src={require(`app/assets/icons/${name}.svg`)}
      width={size}
      height={size}
      alt={name}
      className={`${iconClassName}`}
    />
  );
};

export default Icon;
