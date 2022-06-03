import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import { groupRoutes, userRoutes } from "app/routes/routing";
import { Accordion } from "react-bootstrap";
import Hamburger from 'hamburger-react'

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

  React.useEffect(() => {
    setActiveRoute(location.pathname);
    // const route = userRoutes.filter(
    //   (route) => route.path === location.pathname
    // )[0];

    // setDefaultActiveAccordion(Object.keys(groupRoutes).indexOf(route.group));
  }, [location]);

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
        <div className={`d-flex w-100 header align-items-center justify-content-between  ${isCollapsed ? "hide" : "show"}`}>sidebar
        <div className="side-menu"><Hamburger toggled={!isCollapsed} toggle={toggle} /></div>
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
