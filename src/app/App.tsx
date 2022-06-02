import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { userRoutes } from "./routes/routing";
import { Sidebar } from "./components";

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    /* height: 100%;
    width: 100%; */
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #root {
    /* min-height: 100%;
    min-width: 100%; */
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
  const [isCollapse, setIsCollapse] = React.useState(false);

  return (
    <BrowserRouter>
      <div className="d-flex row h-100">
        <Sidebar
          className={`${isCollapse ? 'col-1' : 'col-3'} bg-primary`}
          toggle={() => setIsCollapse(!isCollapse)}
        />
        <div className={`col bg-white`}>
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
