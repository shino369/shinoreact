// import { useCallback, useEffect, useState } from 'react';

import { useAnimation } from "app/hooks/custom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import ContentLoader from "react-content-loader";

const techstach: any = {
  languages: ["typescript", "javascript", "java", "c++"],
  frameworks: [
    "react (hook)",
    "react native",
    "angular 2+",
    "springboot",
    "J2EE(Servlet)",
    "mybatis plus",
  ],
  libraries: [
    "redux",
    "rxjs",
    "ajax",
    "react-router",
    "react-navigation",
    "react-hook-form",
  ],
  databases: ["ms sql server", "postgresql"],
};

const project: any[] = [
  {
    name: "3Tech OwlEye",
    description:
      "OwlEye Smart Control and Monitoring System.Designed to monitor equipment at telecom tower sites remotely, OwlEye modular system is capable of controlling all kinds of passive infrastructure devices, from diesel generator sets, rectifiers, solar panels, air-conditioning, batteries, access control, security CCTV and more. The high-performance system also supports data capturing and transmission, video and remote control functions.",
    external: "https://www.3tech.net/index.php?c=category&id=8",
    techStack: [
      "typescript",
      "javascript",
      "angular",
      "rxjs",
      "java",
      "springboot",
      "mybatis plus",
      "postgresql",
    ],
  },
  {
    name: "The Hong Kong Club Library System (revamp)",
    description:
      "revamp the Hong Kong Club Library System by implementing online cms(admin) and online items borrowing(user).",
    external: "https://www.thehongkongclub.hk/public/library.html",
    techStack: ["typescript", "javascript", "angular", "rxjs"],
  },
  {
    name: "賽馬會「照顧達人」計劃 (Jockey Club All Brilliant Carers Project) mobile app",
    description:
      "provide functions for newsfeed, elderly jobs finding and events registration.",
    external: "https://carer.org.hk/",
    techStack: [
      "typescript",
      "javascript",
      "react native",
      "redux",
      "react-navigation",
      "react-hook-form",
    ],
  },
  {
    name: "JDC Lab 創飾平台 mobile app",
    description:
      "provide functions for newsfeed, ordering and purchasing customized jewellery.",
    external: "https://jdclab.com/",
    techStack: [
      "typescript",
      "javascript",
      "react native",
      "redux",
      "react-navigation",
      "react-hook-form",
    ],
  },
];

export const AboutPage = () => {
  useAnimation();
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<any[]>(project);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSelectedProject(
        selectedStack.length === 0
          ? project
          : project.filter((f) =>
              f.techStack.some((s: any) => selectedStack.includes(s))
            )
      );
      setLoading(false);
    }, 1000);
  }, [selectedStack]);

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
      <hr />

      <p className="label">Tech stack:</p>
      <span
        className={`${
          selectedStack.length === 0 ? "bg-primary" : "bg-light text-dark"
        } badge rounded-pill py-2 px-3 mx-1 my-1 text-capitalize unselectable pointer hover-opacity border`}
        onClick={() => {
          setSelectedStack([]);
          setSelectedProject(project);
          console.log(selectedStack);
          console.log(selectedProject);
        }}
      >
        {"All"}
      </span>
      {Object.keys(techstach).map((key, index) => {
        return (
          <div key={index}>
            <div className="my-2 text-capitalize">{key}:</div>

            {techstach[key].map((item: string, index: number) => {
              return (
                <span
                  className={`${
                    selectedStack.includes(item)
                      ? "bg-primary"
                      : "bg-light text-dark"
                  } badge rounded-pill py-2 px-3 mx-1 my-1 text-capitalize unselectable pointer hover-opacity border`}
                  key={index}
                  onClick={() => {
                    selectedStack.includes(item)
                      ? setSelectedStack(
                          selectedStack.filter((f) => f !== item)
                        )
                      : setSelectedStack([...selectedStack, item]);
                  }}
                >
                  {item}
                </span>
              );
            })}
          </div>
        );
      })}

      <hr />
      <p className="label">Commercial Projects Participated:</p>
      {selectedStack.map((s: any, index: number) => (
        <div
          key={index}
          className="badge py-2 px-3 me-2 mb-2 rounded-pill text-white border bg-secondary"
        >
          {s}
          <span
            className="ms-2"
            onClick={() => {
              setSelectedStack(selectedStack.filter((f) => f !== s));
            }}
          >
            x
          </span>
        </div>
      ))}

      {loading ? (
        <div>
          <ContentLoader
            speed={2}
            width={400}
            height={150}
            viewBox="0 0 400 150"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="15" rx="5" ry="5" width="300" height="10" />
            <rect x="0" y="45" rx="5" ry="5" width="220" height="10" />
            <rect x="0" y="75" rx="5" ry="5" width="220" height="10" />
            <rect x="0" y="105" rx="5" ry="5" width="300" height="10" />
          </ContentLoader>
        </div>
      ) : (
        selectedProject?.map((item: any, index: number) => {
          return (
            <div key={index}>
              <div className="d-flex">
                <div className="my-2 col-3 me-2">
                  <a href={item.external} target="_blank" rel="noreferrer">
                    {item.name}
                  </a>
                </div>
                <div className="my-2 col">{item.description}</div>
              </div>
              <hr />
            </div>
          );
        })
      )}
    </div>
  );
};
