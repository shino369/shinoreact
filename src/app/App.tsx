import React, { useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { userRoutes } from "./routes/routing";
import { Icon, Sidebar } from "./components";
import Hamburger from 'hamburger-react'
import { useMediaQuery } from 'react-responsive';


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
    background-color: transparent;
    -webkit-box-shadow: 13px 1px 15px -4px rgb(0 0 0 / 20%);
    box-shadow: 13px 1px 15px -4px rgb(0 0 0 / 20%);
  }


  .nowrap: {
    flex-wrap: nowrap;
    transition: all 0.2s ease-in-out;
    --webkit-transition: all 0.2s ease-in-out;
  }
`;

function App() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

  useEffect(() => {console.log(isMobile)},[isMobile])

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="d-flex row mx-0 h-100 nowrap overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} toggle={() => {setIsCollapsed(!isCollapsed)}} />
        <div className={`col bg-white route-wrapper`}>
          <div className="d-flex w-100 abs-top-left topbar align-items-center">
            <div className={`${isCollapsed ? '':'menu'}`}><Hamburger toggled={!isCollapsed} toggle={()=>setIsCollapsed(!isCollapsed)} /></div>
            
            {/* <Icon
              button
              onClick={() => setIsCollapsed(!isCollapsed)}
              btnClassName=""
              name="menu"
              color="white"
              size={24}
            /> */}
          </div>

          <Routes>
            {userRoutes.map((route, index) => (
              <Route path={route.path} key={index} element={route.component} />
            ))}
          </Routes>
        </div>
      </div>

      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
