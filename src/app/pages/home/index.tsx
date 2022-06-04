// import { useCallback, useEffect, useState } from 'react';
import styled from "styled-components";
import "./index.scss";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export const HomePage = () => {
  return (
    <div className="p-4">
      <div className="page-header mb-2">
        <strong>Welcome to SHINO REACT</strong>
      </div>
      <div className="">
        <p>This page is a personal page host in Github Page.</p>
        <p>
          Made with react, simply use as a demo for 
          <span className="ms-1 high-light">job seeking</span>.
        </p>
        <p
          className="remark"
          style={{
            fontSize: "0.8rem",
          }}
        >
          {
            "( Perhaps there maybe further development or features in the future. No one knows. )"
          }
        </p>
        <p className="opactiy-5">
          If you are using mobile device, please click the menu icon to toggle nav sidebar
        </p>
      </div>

      <hr />

      <div className="d-flex justify-content-center">
        <img
          width={"100%"}
          height={"auto"}
          style={{
            maxWidth: "500px",
          }}
          src="https://c.tenor.com/a5MVWtIRNFUAAAAC/genba-neko.gif"
          alt=""
        />
      </div>
    </div>
  );
};

// const styles = {
//   header: {
//     fontSize: "3em",
//   },
// };
