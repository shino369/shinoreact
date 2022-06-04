import React, { useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { userRoutes } from "./routes/routing";
import { CommonWrapper, Icon, Sidebar, Topbar } from "./components";
import Hamburger from "hamburger-react";
import { useMediaQuery } from "react-responsive";

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
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

  .topbar {
    height: 3.5rem;
    background-color: rgba(255,255,255,0.7);
    backdrop-filter: blur(5px);
    -webkit-box-shadow: 13px 1px 15px -4px rgb(0 0 0 / 20%);
    box-shadow: 13px 1px 15px -4px rgb(0 0 0 / 20%);
  }


  .nowrap: {
    flex-wrap: nowrap;
    transition: all 0.2s ease-in-out;
    --webkit-transition: all 0.2s ease-in-out;
  }

  .common-wrapper{
    flex-grow: 1;
    padding-top: 3.5rem;
    height: 100vh;
    overflow-y: scroll;
  }
`;

function App() {
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
  const [isCollapsed, setIsCollapsed] = React.useState(isMobile ? true : false);

  useEffect(() => {
    console.log(isMobile);
  }, [isMobile]);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="d-flex row mx-0 h-100 nowrap overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          toggle={() => {
            setIsCollapsed(!isCollapsed);
          }}
        />
        <div className={`col d-flex bg-white route-wrapper px-0`}>
          <Topbar
            isCollapsed={isCollapsed}
            toggle={() => {
              setIsCollapsed(!isCollapsed);
            }}
          />
          <CommonWrapper className="common-wrapper">
            <Routes>
              {userRoutes.map((route, index) => (
                <Route
                  path={route.path}
                  key={index}
                  element={route.component}
                />
              ))}
            </Routes>
          </CommonWrapper>
        </div>
      </div>

      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
