// import { useCallback, useEffect, useState } from 'react';

import { useAnimation } from "app/hooks/custom";
import { Link } from "react-router-dom";
import "./index.scss";

const techstach: any = {
  languages: ["typescript", "javascript", "css3", "html6", "java", "c++"],
  frameworks: [
    "react (hook)",
    "react native",
    "angular 2+",
    "springboot",
    "J2EE(Servlet)",
    "Mybatis Plus",
  ],
//   libraries: ["redux", "rxjs", "ajax", "gsap", "react-router"],
  databases: ["ms sql server", "postgresql"],
};

export const AboutPage = () => {
  useAnimation();
  return (
    <div className="p-4 position-relative">
      <div className="page-header mb-2 gs_reveal gs_reveal_fromLeft">
        <strong>About Me</strong>
      </div>
      <div className="gs_reveal gs_reveal_fromLeft">
        <div className="d-flex">
          <div>
            <p>
              <span className="high-light">Anthony wong</span>
            </p>
            <p>Junior frontend developer. Currently live in Hong Kong.</p>
            <p>Graduated from City University of Hong Kong in 2021,</p>
            <p>major in Information Engineering, minor in Japanese Studies.</p>
            <br />
            <p>
              Love Japanese cultures. Favourite mascot is 現場猫 {"(GENBANEKO)"}
            </p>
          </div>

          <div className="myIcon">
            <div className=" position-relative">
              <img
                className="shadow ms-4"
                width={"200px"}
                height={"200px"}
                style={{
                  transform: "rotate(10deg)",
                }}
                src="https://pbs.twimg.com/media/EQh9aLXUcAAUc_G.jpg"
                alt=""
              />
              <img
                width={"40px"}
                height={"60px"}
                style={{
                  top: 0,
                  right: 0,
                }}
                src="https://cdn.picpng.com/paperclip/paperclip-paper-clip-office-clip-98456.png"
                alt=""
                className="position-absolute"
              />
            </div>
          </div>
        </div>
        <hr />
        </div>
        <div className="parallax"></div>
        <p>Tech stack:</p>
        {Object.keys(techstach).map((key, index) => {
          return (
            <div key={index}>
              <div className="my-2 text-capitalize">{key}:</div>
              <ul className="list-group" style={{ width: "200px" }}>
                {techstach[key].map((item: any, index: number) => {
                  return (
                    <li
                      className={`${
                        index % 2 === 0 && "list-group-item-dark"
                      } list-group-item`}
                      key={index}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* <p
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
          If you are using mobile device, please click the menu icon to toggle
          nav sidebar
        </p> */}
      

      <hr />
    </div>
  );
};
