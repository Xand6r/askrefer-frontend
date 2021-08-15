import React, { useCallback, useEffect, useState } from "react";
import "./styles.scss";

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(true);
  console.log(children)
  const handleResizeScreen = useCallback(() => {
    if (window.innerWidth < 767) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 767) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [window]);

  //-----------------------------------------------------------------
  //Fire a function anything window is resized
  //-----------------------------------------------------------------
  useEffect(() => {
    window.addEventListener("resize", handleResizeScreen);
    return () => window.removeEventListener("resize", handleResizeScreen);
  });

  if (isMobile) {
    return (
      <>
        <div className="layout-app-wrapper">{children}</div>
      </>
    );
  } else {
    // TODO include a popup that were comin to mobile soon
    return (
      <div className="layout-app-wrapper">
        <div className="marvel-device iphone8plus black">
          <div className="top-bar"></div>
          <div className="sleep"></div>
          <div className="volume"></div>
          <div className="camera"></div>
          <div className="sensor"></div>
          <div className="speaker"></div>
          <div className="screen">{children}</div>
          <div className="home"></div>
          <div className="bottom-bar"></div>
        </div>
      </div>
    );
  }
};

export default Layout;
