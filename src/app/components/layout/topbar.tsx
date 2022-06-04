import Hamburger from "hamburger-react";

// style
import "./topbar.scss";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";

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
  //   let location = useLocation();
  return (
    <div className="d-flex w-100 abs-top-left topbar align-items-center">
      <div className={`${isCollapsed ? "" : "menu"}`}>
        <Hamburger toggled={!isCollapsed} toggle={toggle} />
      </div>
    </div>
  );
};

export default Topbar;
