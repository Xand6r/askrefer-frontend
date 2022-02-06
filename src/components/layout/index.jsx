import React, { useCallback, useEffect, useState } from "react";
import DesktopLoading from '@/pages/desktop';
import "./styles.scss";

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(true);
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

  if (!isMobile) {
    return (
      <>
        <div className="layout-app-wrapper">{children}</div>
      </>
    );
  } else {
    // TODO include a popup that were comin to mobile soon
    return (
      <div className="layout-app-wrapper">
        <DesktopLoading />
      </div>
    );
  }
};

export default Layout;
