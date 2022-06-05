import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import { groupRoutes, userRoutes } from "app/routes/routing";
import { Accordion } from "react-bootstrap";
import Hamburger from "hamburger-react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/all";
import Icon from "../icon/icon";

export interface Props {
  className?: string;
  isCollapsed: boolean;
  toggle: () => void;
  close: () => void;
}

const Sidebar: React.FC<Props> = ({
  className,
  toggle,
  isCollapsed,
  close,
}) => {
  let location = useLocation();
  const [activeRoute, setActiveRoute] = React.useState(location.pathname);
  const [defaultActiveAccordion, setDefaultActiveAccordion] = React.useState(
    Object.keys(groupRoutes).indexOf(
      userRoutes.filter((route) => route.path === location.pathname)[0].group
    )
  );

  gsap.registerPlugin(TextPlugin);
  const word: string[] = ["WELCOME", "I'M ANTHONY WONG", "A DEVELOPER"];

  React.useEffect(() => {
    setActiveRoute(location.pathname);
    close();
    // const route = userRoutes.filter(
    //   (route) => route.path === location.pathname
    // )[0];

    // setDefaultActiveAccordion(Object.keys(groupRoutes).indexOf(route.group));
  }, [location]);

  React.useEffect(() => {
    const masterTl = gsap.timeline({ repeat: -1 }).pause();
    const typing = gsap.to(".cursor", {
      opacity: 0,
      ease: "power2.inOut",
      repeat: -1,
    });

    word.forEach((word: string) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
      tl.to(".typing", {
        duration: 1,
        text: word,
        onComplete: () => {},
      });
      masterTl.add(tl);
    });

    masterTl.play();

    return () => {
      masterTl.kill();
      typing.kill();
    };
  }, []);

  return (
    <div
      className={`${
        isCollapsed ? "collapsed" : "expanded"
      } bg-primary sidebar px-0`}
    >
      <div
        className={`sidebar-header border-right d-flex justify-content-start ${
          isCollapsed ? "px-1" : "ps-4 pe-2"
        } py-2`}
      >
        <div className="sidebar-header-logo"></div>
        <div
          className={`d-flex w-100 header align-items-center justify-content-between  ${
            isCollapsed ? "hide" : "show"
          }`}
        >
          <div className="outer-wrapper d-flex">
            <div className="wrapper">
              <span className="box"></span>
              <span className="hello">shinoreact: ~$</span>
            </div>
            <div className="wrapper wrapper-2 ms-2">
              <div>
                <span className="typing"></span>
                <span className="cursor">_</span>
              </div>
            </div>
          </div>
          <div className="side-menu">
            <Hamburger toggled={!isCollapsed} toggle={toggle} />
          </div>
        </div>
      </div>
      <div className={`sidebar-body hideScroll`}>
        <div className="sidebar-body-item d-flex flex-column j  ustify-content-start">
          {userRoutes
            .filter((f) => f.group.length === 0)
            .map((route, i) => (
              <NavLink
                key={i}
                style={{
                  textDecoration: "none",
                }}
                to={route.path}
              >
                <div
                  className={`${isCollapsed ? "px-1" : "px-4"} ${
                    activeRoute === route.path ? "active" : ""
                  } label text-uppercase py-3 d-flex align-items-center position-relative`}
                >
                  <div
                    className={`position-absolute d-flex justify-content-center transition ${
                      isCollapsed ? "opacity-1" : "opacity-0"
                    }`}
                    style={{
                      transform: `translateX(${isCollapsed ? "0" : "-10px"})`,
                      width: `calc(100% - ${isCollapsed ? "0.5rem" : "3rem"})`,
                    }}
                  >
                    <Icon svg name={route.icon} size={24} color={"white"} />
                  </div>

                  <div

                    className={`${isCollapsed ? "hide" : "show"} label-text`}
                  >
                    {route.name}
                  </div>
                </div>
              </NavLink>
            ))}
          <Accordion
            defaultActiveKey={[defaultActiveAccordion.toString()]}
            flush
            alwaysOpen
          >
            {Object.keys(groupRoutes).map((group, index) => (
              <Accordion.Item
                key={index}
                className={`border-bottom-light ${
                  index === 0 ? "border-top-light" : ""
                }`}
                eventKey={index.toString()}
              >
                <Accordion.Header
                  className={`${isCollapsed ? "px-1" : "px-4"}  py-3 position-relative`}
                >
                  <div className={`header ${isCollapsed ? "hide" : "show"}`}>
                    {isCollapsed ? '': group}
                  </div>
                  {isCollapsed && (
                    <div className={`header position-absolute w-100 text-center transition ${isCollapsed ? "opacity-1" : "opacity-0"}`}>
                      {group[0]}
                    </div>
                  )}
                </Accordion.Header>
                <Accordion.Body>
                  {groupRoutes[group].map((route, i) => (
                    <NavLink
                      key={i}
                      style={{
                        textDecoration: "none",
                      }}
                      to={route.path}
                    >
                      <div
                        className={`${isCollapsed ? "px-1" : "px-4"} ${
                          activeRoute === route.path ? "active" : ""
                        } label text-uppercase py-3`}
                      >
                        <div
                          className={`${
                            isCollapsed ? "hide" : "show"
                          } label-text`}
                        >
                          {route.name}
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
