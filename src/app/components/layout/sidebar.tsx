import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import { groupRoutes, userRoutes } from "app/routes/routing";
import { Accordion } from "react-bootstrap";
import Hamburger from "hamburger-react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/all";

export interface Props {
  className?: string;
  isCollapsed: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<Props> = ({ className, toggle, isCollapsed }) => {
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
    // const route = userRoutes.filter(
    //   (route) => route.path === location.pathname
    // )[0];

    // setDefaultActiveAccordion(Object.keys(groupRoutes).indexOf(route.group));
  }, [location]);

  React.useEffect(() => {
    const masterTl = gsap.timeline({ repeat: -1 }).pause();
    gsap.to(".cursor", {
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
      <div className={`sidebar-body`}>
        <div className="sidebar-body-item d-flex flex-column j  ustify-content-start">
          <Accordion
            defaultActiveKey={[defaultActiveAccordion.toString()]}
            flush
            alwaysOpen
          >
            {Object.keys(groupRoutes).map((group, index) => (
              <Accordion.Item
                key={index}
                className={`border-bottom-light`}
                eventKey={index.toString()}
              >
                <Accordion.Header
                  className={`${isCollapsed ? "px-1" : "px-4"}  py-3`}
                >
                  <div className={`header ${isCollapsed ? "hide" : "show"}`}>
                    {group}
                  </div>
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
