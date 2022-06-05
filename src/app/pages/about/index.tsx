// import { useCallback, useEffect, useState } from 'react';

import { useAnimation } from "app/hooks/custom";
import { Link } from "react-router-dom";

export const AboutPage = () => {
  useAnimation();
  return (
    <div className="p-4">
      <div className="page-header mb-2 gs_reveal gs_reveal_fromLeft">
        <strong>About Me</strong>
      </div>
      <div className="gs_reveal gs_reveal_fromLeft">
        <p><span className="high-light">Anthony wong</span></p>
        <p>Junior frontend application developer.</p>
        <p>Graduated from City University of Hong Kong. Major in Information Engineering, with a minor in Japanese Studies.</p>
        <p>
          Tech stack: 
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
    </div>
  );
};
