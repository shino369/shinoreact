// import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import "./index.scss";
import { Link } from "react-router-dom";

export const HomePage = () => {

  return (
    <div className="p-4">
      <div className="page-header mb-2">
        <strong>Welcome to SHINO REACT</strong>
      </div>
      <p>This page is a personal page host in Github Page.</p>
      <p>Made with react, and simply use as a resume for <span className="high-light">job seeking</span>.</p>
      <p className="remark">{'( Perhaps there maybe further development or features in the future )'}</p>
    </div>
  );
};

// const styles = {
//   header: {
//     fontSize: "3em",
//   },
// };
