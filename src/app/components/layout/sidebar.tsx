import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./sidebar.scss";

export interface Props {
  className: string;
  toggle: () => void;
}

const Sidebar: React.FC<Props> = ({ className, toggle }) => {
  let location = useLocation();
  const [activeRoute, setActiveRoute] = React.useState(location.pathname);

  React.useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  return (
    <div className={`${className} sidebar`}>
      <div className="sidebar-header d-flex justify-content-between">
        <div className="sidebar-header-logo"></div>
        <div>sidebar</div>
        <button className="btn btn-primary" onClick={toggle}>
          click
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-body-item d-flex flex-column justify-content-center pt-2">
          <NavLink
            style={{
              textDecoration: "none",
              textAlign: "center",
              color: "white",
              marginBottom: "2rem",
            }}
            to={"/home"}
          >
            home  {activeRoute === "/home" && (<span>{'<<<'}</span>)}
          </NavLink>
          <NavLink
            style={{
              textDecoration: "none",
              textAlign: "center",
              color: "white",
            }}
            to={"/home/detail"}
          >
            detail {activeRoute === "/home/detail" && (<span>{'<<<'}</span>)}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
