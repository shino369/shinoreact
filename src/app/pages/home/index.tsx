import React from "react";
// import styled from "styled-components";
import "./index.scss";
// import { Link } from "react-router-dom";
// import { useMediaQuery } from "react-responsive";
import { interval } from "rxjs";
import { useObservable } from "app/hooks/useObservable";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

export const HomePage = () => {
  // const dance$ = React.useMemo(() => interval(400), []);
  // const dance = useObservable(dance$, 0);
  // const [random, setRandom] = React.useState(0);
  const [dance, setDance] = React.useState(0);

  React.useEffect(() => {
    const dance$ = interval(800);
    const dnaceSub = dance$.subscribe((v) => {
      // setRandom(Math.floor(Math.random() * 100))
      setDance(v);
    });

    gsap.registerPlugin(ScrollTrigger);
    const animateFrom = (elem: any, _direction?: number) => {
      const direction = _direction || 1;
      var x = 0,
        y = direction * 1000;
      if (elem.classList.contains("gs_reveal_fromLeft")) {
        x = -100;
        y = 0;
      } else if (elem.classList.contains("gs_reveal_fromRight")) {
        x = 100;
        y = 0;
      }
      elem.style.transform = "translate(" + x + "px, " + y + "px)";
      elem.style.opacity = "0";
      gsap.fromTo(
        elem,
        { x: x, y: y, autoAlpha: 0 },
        {
          duration: 1.25,
          x: 0,
          y: 0,
          autoAlpha: 1,
          ease: "expo",
          overwrite: "auto",
        }
      );
    };

    const hide = (elem: any) => {
      gsap.set(elem, { autoAlpha: 0 });
    };

    gsap.utils.toArray(".gs_reveal").forEach((elem: any) => {
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

    return () => {
      dnaceSub.unsubscribe();
      // gsap.globalTimeline.clear()
      gsap.killTweensOf('.gs_reveal')
      // gsap.globalTimeline.getChildren().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="p-4">
      <div className="page-header mb-2 gs_reveal gs_reveal_fromLeft">
        <strong>Welcome to SHINO REACT</strong>
      </div>
      <div className="gs_reveal gs_reveal_fromLeft">
        <p>This page is a personal page host in Github Page.</p>
        <p>
          Made with react, simply use for 
          <span className="ms-1 high-light">demo purpose</span>.
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
          If you are using mobile device, please click the menu icon to toggle
          nav sidebar
        </p>
      </div>

      <hr />

      <div className="d-flex justify-content-center position-relative">
        {/* <div className="position-absolute d-flex px-5 w-100 h-25 justify-content-center">
          <div style={{maxWidth: '800px'}} className={`w-100 h-100 d-flex ${"justify-content-between"}`}>
            <div
              className={`transition ${
                dance % 2 === 0 ? "opacity-0" : "opacity-1"
              } px-4 py-2 border rounded-pill text-center scale-1-5 bubble`}
            >
              Hello
            </div>

            <div
              className={`transition ${
                dance % 2 === 0 ? "opacity-1" : "opacity-0"
              } px-4 py-2 border rounded-pill text-center bg-primary text-white scale-1-5 bubble`}
            >
              World!
            </div>
          </div>
        </div> */}

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
