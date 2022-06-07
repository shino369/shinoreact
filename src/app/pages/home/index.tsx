import React, { useEffect } from "react";
import "./index.scss";
import { useAnimation } from "app/hooks/custom";
import { HighlightCode } from "app/components";
import { useDispatch } from "react-redux";
import { setActiveRoute } from "store/activeRoute";

export const HomePage = () => {
  useAnimation();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setActiveRoute('home'))
  },[dispatch])
  
  const code = `
  const foo = () => { 
    const [bar, setBar] = useState<string>('foo');
    return bar;

    // the text animation makes use of gsap
  }
  `;

  // const [maxWidth, setMaxWidth] = React.useState<number>(1000);
  // const ref = React.useRef<any>(null);
  // const handleResize = () => {
  //   setMaxWidth(ref.current.offsetWidth);
  // };
  // React.useEffect(() => {
  //   console.log("width", ref.current ? ref.current.offsetWidth : 0);

  //   if (ref.current) window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [ref]);

  return (
    <div className="p-4">
      <div className="page-header mb-2 gs_reveal gs_reveal_fromLeft">
        <strong>Welcome</strong>
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
      <HighlightCode className="code-snippet" language="typescript">
        {code}
      </HighlightCode>

      <div className="d-flex justify-content-center position-relative">
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
