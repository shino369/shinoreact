import React from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { userRoutes } from "./routes/routing";
import { Icon, Sidebar } from "./components";

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
`;

function App() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <BrowserRouter>
      <div className="d-flex row mx-0  h-100">
        <Sidebar isCollapsed={isCollapsed} toggle={() => {}} />
        <div className={`col bg-white route-wrapper`}>
          <Icon button onClick={()=>setIsCollapsed(!isCollapsed)} btnClassName="m-1 abs-top-left" name="menu" color="white" size={24} />
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
