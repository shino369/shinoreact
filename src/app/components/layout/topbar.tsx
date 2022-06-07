import Hamburger from "hamburger-react";

// style
import "./topbar.scss";
// import { useLocation } from "react-router-dom";
import React from "react";
import { RootState } from "store";
import { useSelector } from "react-redux";

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
  const { activeRoute } = useSelector((rootState: RootState) => rootState.activeRoute)

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
      className={`d-flex w-100 topbar align-items-center ${
        isCollapsed ? "ps-5rem" : "ps-20rem"
      }`}
    >
      <div className={``}>
        <Hamburger toggled={!isCollapsed} toggle={toggle} />
      </div>
      <div className="current ms-2">{activeRoute.toUpperCase()}</div>
    </div>
  );
};

export default Topbar;
