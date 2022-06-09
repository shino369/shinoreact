import React, { useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { authRoutes, userRoutes } from "./routes/routing";
import { CommonWrapper, Sidebar, Spinner, Topbar } from "./components";
import { useMediaQuery } from "react-responsive";
import { ProtectedRoute } from "./routes";
import useFirebase from "./hooks/firebase";
import { ToastContainer } from "react-toastify";
import { TOAST_TIME } from "./config";
import 'react-toastify/dist/ReactToastify.css';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    // height: 100%;
    // width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #root {
    // min-height: 100%;
    // min-width: 100%;
  }

  p,
  label {
    font-family: "Segoe UI", Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

  .fixed-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: fit-content;
    height: 100vh;
    z-index: 1030;
    overflow: hidden;
  }

  .topbar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3.5rem;
    background-color: rgba(255,255,255,0.7);
    // backdrop-filter: blur(5px);
    -webkit-box-shadow: 13px 1px 15px -4px rgb(0 0 0 / 20%);
    box-shadow: 13px 1px 15px -4px rgb(0 0 0 / 20%);
    z-index: 1020;
    transition: all 0.2s ease-in-out;
    --webkit-transition: all 0.2s ease-in-out;
  }

  .route-wrapper {
    transition: all 0.2s ease-in-out;
    --webkit-transition: all 0.2s ease-in-out;
  }

  .nowrap: {
    flex-wrap: nowrap;
    transition: all 0.2s ease-in-out;
    --webkit-transition: all 0.2s ease-in-out;
  }

  .common-wrapper{
    flex-grow: 1;
    width: 100%;
    padding-top: 3.5rem;
    // height: 100vh;
    // overflow-y: scroll;
  }
  @media screen and (min-width: 576px) {
    .main-ps-5rem{
        padding-left: 5rem;
    }
    
    .main-ps-20rem{
        padding-left: 20rem;
    }
  }
    
  .carousel .control-next.control-arrow:before {
    border-left: 8px solid #000 !important;
  }
  .carousel .control-prev.control-arrow:before {
    border-right: 8px solid #000 !important;
  }

  .hover-opacity {
    &:hover {
      opacity: 0.7;
    }
  }

`;

function App() {
  useFirebase()
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const isIpad = useMediaQuery({
    query: `(min-width: 576px) and (max-width: 768px)`,
  });
  const [isCollapsed, setIsCollapsed] = React.useState(
    isMobile || isIpad ? true : false
  );

  useEffect(() => {
    // console.log(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && !isCollapsed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isCollapsed, isMobile]);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="fixed-sidebar">
        <Sidebar
          isCollapsed={isCollapsed}
          toggle={() => {
            setIsCollapsed(!isCollapsed);
          }}
          close={() => {
            isMobile && setIsCollapsed(true);
          }}
        />
      </div>
      <Topbar
        isCollapsed={isCollapsed}
        toggle={() => {
          setIsCollapsed(!isCollapsed);
        }}
      />

      <div
        className={`col d-flex bg-white route-wrapper ${
          isCollapsed ? "main-ps-5rem" : "main-ps-20rem"
        }`}
      >
        <CommonWrapper className="common-wrapper">
          <Routes>
            {userRoutes.map((route, index) => (
              <Route
                path={route.path}
                key={index}
                element={
                  <ProtectedRoute
                    component={route.component}
                    protectedRoute={route.group === "protected"}
                  />
                }
              />
            ))}
            {authRoutes.map((route, index) => (
              <Route
                path={route.path}
                key={index}
                element={
                  <ProtectedRoute
                    component={route.component}
                    protectedRoute={route.group === "protected"}
                  />
                }
              />
            ))}
          </Routes>
        </CommonWrapper>
      </div>
      <Spinner />
      <ToastContainer
        position="top-right"
        autoClose={TOAST_TIME}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
