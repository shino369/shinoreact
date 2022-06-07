import Hamburger from "hamburger-react";

// style
import "./topbar.scss";
// import { useLocation } from "react-router-dom";
import React from "react";
import { RootState } from "store";
import { useSelector } from "react-redux";
import Icon from "../icon/icon";

export interface Props {
  className?: string;
  styles?: any;
  isCollapsed: boolean;
  toggle: () => void;
}

const Topbar: React.FC<Props> = ({
  className,
  styles,
  isCollapsed,
  toggle,
}: Props) => {
  // let location = useLocation();
  // const [recent, setRecent] = React.useState<string>();
  const { activeRoute } = useSelector(
    (rootState: RootState) => rootState.activeRoute
  );

  // useEffect(() => {
  //   // const paths = location.pathname.split('/')
  //   // // check if last is a number and change to :id
  //   // if (paths[paths.length - 1].match(/^\d+$/)) {
  //   //   paths[paths.length - 1] = `:id`
  //   // }

  //   // setRecent(
  //   //   userRoutes
  //   //     .filter((route) => route.path === paths.join('/'))[0]
  //   //     .name.toUpperCase()
  //   // );
  //   setRecent(activeRoute.toUpperCase())
  // }, [activeRoute]);

  return (
    <div
      className={`d-flex w-100 topbar align-items-center transition ${
        isCollapsed ? "ps-5rem" : "ps-20rem"
      }`}
    >
      <div className={``}>
        <Hamburger toggled={!isCollapsed} toggle={toggle} />
      </div>
      <div className="current ms-2">{activeRoute.toUpperCase()}</div>
      <div className="d-flex justify-content-end position-absolute end-0">
        {[
          { name: "github", url: "https://github.com/shino369" },
          { name: "linkedin", url: "https://www.linkedin.com/in/aw3939" },
          { name: "whatsapp", url: "https://wa.me/85252362806" },
          { name: "email", url: "mailto:anthonywong3939@gmail.com" },
        ].map((icon, index) => (
          <Icon
            button
            btnClassName="px-2 hover-opacity"
            onClick={() => {
              window.open(icon.url, '_blank')
            }}
            key={index}
            extname="png"
            name={icon.name}
            size={24}
            color={"white"}
          />
        ))}
      </div>
    </div>
  );
};

export default Topbar;
