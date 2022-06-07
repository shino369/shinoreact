// import { useCallback, useEffect, useState } from 'react';

import { useAnimation } from "app/hooks/custom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import ContentLoader from "react-content-loader";
import { Categories, projectDetail, ProjectDetail, techstach } from "app/model";
import { useDispatch } from "react-redux";
import { setActiveRoute } from "store/activeRoute";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

export const AboutPage = () => {
  useAnimation();
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectDetail[]>(projectDetail);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // const { activeRoute } = useSelector((rootState: RootState) => rootState.activeRoute)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveRoute("about me"));
  }, [dispatch]);

  useEffect(() => {
    // console.log('called')
    setLoading(true);
    setTimeout(() => {
      if (selectedStack.length > 0) {
        setSelectedProject(
          selectedStack.length === 0
            ? projectDetail
            : projectDetail.filter((f) =>
                f.techStack.some((s: any) => selectedStack.includes(s))
              )
        );
      }else{
        setSelectedProject(projectDetail);
      }
      setLoading(false);
    }, 600);
  }, [selectedStack]);

  useEffect(() => {
    gsap.killTweensOf(".result");
    const animateFrom = (elem: any, _direction?: number) => {
      const direction = _direction || 1;
      var x = 0,
        y = direction * 1000;
      if (elem.classList.contains("result_fromLeft")) {
        x = -100;
        y = 0;
      } else if (elem.classList.contains("result_fromRight")) {
        x = 100;
        y = 0;
      }
      elem.style.transform = "translate(" + x + "px, " + y + "px)";
      // elem.style.opacity = "0";
      gsap.fromTo(
        elem,
        { x: x, y: y,  },
        {
          duration: 1.25,
          x: 0,
          y: 0,
        
          ease: "expo",
          overwrite: "auto",
        }
      );
    };

    const hide = (elem: any) => {
      gsap.set(elem, { });
    };

    gsap.utils.toArray(".result").forEach((elem: any) => {
      hide(elem); // assure that the element is hidden when scrolled into view

      ScrollTrigger.create({
        once: true,
        trigger: elem,
        onEnter: () => {
          animateFrom(elem);
        },
        // onEnterBack: () => {
        //   animateFrom(elem, -1)
        // },
        // onLeave: () => {
        //   hide(elem)
        // }, // assure that the element is hidden when scrolled into view
      });
    });

    return () => gsap.killTweensOf(".result");
  }, [selectedProject]);

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
            <div>
              {"Junior frontend developer. Currently live in Hong Kong.\nGraduated from City University of Hong Kong in 2021,\nmajor in Information Engineering, minor in Japanese Studies.\nLove Japanese cultures. Favourite mascot is 現場猫 (GENBANEKO)"
                .split("\n")
                .map((f, i) => (
                  <p key={i}>{f}</p>
                ))}
            </div>
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
          selectedStack.length === 0 ? "bg-secondary" : "bg-light text-dark"
        } badge rounded-pill py-2 px-3 mx-1 my-1 text-capitalize unselectable pointer hover-opacity border`}
        onClick={() => {
          setSelectedStack([]);
          // console.log(selectedStack);
          // console.log(selectedProject);
        }}
      >
        {"All"}
      </span>
      {Object.keys(techstach).map((key, index) => {
        return (
          <div key={index}>
            <div className="my-2 text-capitalize">{key}:</div>

            <div>
              {techstach[key as Categories].map(
                (item: string, index: number) => {
                  return (
                    <span
                      className={`${
                        selectedStack.includes(item)
                          ? "bg-secondary"
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
                }
              )}
            </div>
          </div>
        );
      })}

      <hr />

      <div className="overflow-hidden px-2 gs_reveal">
        <p className="label">Commercial Projects Participated:</p>
        {selectedStack.map((s: any, index: number) => (
          <div
            onClick={() => {
              setSelectedStack(selectedStack.filter((f) => f !== s));
            }}
            key={index}
            className="badge py-2 px-3 me-2 mb-2 rounded-pill text-white border bg-secondary text-capitalize"
          >
            {s}
            <span className="ms-2">x</span>
          </div>
        ))}

        {loading ? (
          <div>
            <ContentLoader
              speed={2}
              width={300}
              height={150}
              viewBox="0 0 400 150"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="0" y="15" rx="5" ry="5" width="280" height="10" />
              <rect x="0" y="45" rx="5" ry="5" width="180" height="10" />
              <rect x="0" y="75" rx="5" ry="5" width="180" height="10" />
              <rect x="0" y="105" rx="5" ry="5" width="200" height="10" />
            </ContentLoader>
          </div>
        ) : (
          selectedProject?.map((item: ProjectDetail, index: number) => {
            return (
              <div
                className="hover-opacity project-item pointer text-white p-4 mb-4 shadow result result_fromRight"
                onClick={() => {
                  navigate(`/project/${item.id}`);
                }}
                key={index}
              >
                <div className="d-flex">
                  <div className="d-none align-items-center d-sm-flex my-2 col-2 me-2">
                    <img
                      src={item.icon}
                      alt=""
                      width="100%"
                      height="auto"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                  <div className="my-2 col overflow-hidden">
                    <div className="d-flex d-sm-none mb-4 justify-content-center">
                      <img src={item.icon} alt="" width="200px" height="auto" />
                    </div>
                    <div className="mb-2">
                      <strong>{item.name}</strong>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-nowrap overflow-scroll pb-2 hideScroll"
                    >
                      {item.techStack.map((s: any, index: number) => (
                        <div
                          key={index}
                          className="badge rounded-pill bg-light border me-1 text-dark text-capitalize"
                        >
                          {s}
                        </div>
                      ))}
                    </div>

                    <div>{item.description}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
