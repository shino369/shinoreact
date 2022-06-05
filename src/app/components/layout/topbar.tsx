import Hamburger from "hamburger-react";

// style
import "./topbar.scss";
import { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import React from "react";
import { userRoutes } from "app/routes/routing";

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
  let location = useLocation();
  const [recent, setRecent] = React.useState<string>();

  useEffect(() => {
    setRecent(
      userRoutes
        .filter((route) => route.path === location.pathname)[0]
        .name.toUpperCase()
    );
  }, [location]);

  return (
    <div
      className={`d-flex w-100 topbar align-items-center ${
        isCollapsed ? "ps-5rem" : "ps-20rem"
      }`}
    >
      <div className={``}>
        <Hamburger toggled={!isCollapsed} toggle={toggle} />
      </div>
      <div className="ms-2">{recent}</div>
    </div>
  );
};

export default Topbar;
