// import { useCallback, useEffect, useState } from 'react';
import styles from "./index.module.scss";

import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ProjectDetail, projectDetail } from "app/model";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export const ProjectDetailPage = () => {
  const location = useLocation();
  const paths = location.pathname.split("/");
  const [id, setId] = useState<number>(parseInt(paths[paths.length - 1]));
  const [project, setProject] = useState<ProjectDetail | undefined>(undefined);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    setProject(
      projectDetail.filter((item) => item.id === id).length > 0
        ? projectDetail.filter((item) => item.id === id)[0]
        : undefined
    );
  }, [id]);

  const scroll = (scrollOffset: any) => {
    scrollRef.current.scrollLeft += scrollOffset;
  };

  if (project) {
    return (
      <div className="p-4">
        <div className="d-flex flex-column align-items-center overflow-hidden">
          <img
            src={project.icon}
            width="300"
            height="auto"
            alt=""
            className="mb-2"
          />
          <div className="mb-4 w-100" style={{ maxWidth: "800px" }}>
            <div className="mb-2 text-center">{project.name}</div>
            <div className="mb-2 ">
              {project.techStack.map((item, index) => (
                <span
                  className="badge rounded-pill bg-secondary border me-2 mb-2 py-2 px-3 text-capitalize"
                  key={index}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mb-2">{project.detail}</div>
            <div className="text-truncate mb-2">
              External:
              <a
                className="ms-2"
                href={project.external}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.external}
              </a>
            </div>
            {project.images.length > 0 && (
              <div
                className={styles.carobg}
                style={{ maxHeight: "400px", maxWidth: "800px" }}
              >
                <div>
                  <Carousel showThumbs={false} className="w-100 h-100">
                    {project.images.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          height: "400px",
                          backgroundImage: `url(${item})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    ))}
                  </Carousel>
                </div>
              </div>
            )}
          </div>
          <Link to="/about">go back</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center p-4">
        <div>project id: {id} not found</div>
        <Link to="/">go back to home</Link>
        <img
          width="100%"
          height="auto"
          src="https://pbs.twimg.com/media/FUlBaMiVIAAsi6-?format=jpg"
          alt=""
        />
      </div>
    );
  }
};
