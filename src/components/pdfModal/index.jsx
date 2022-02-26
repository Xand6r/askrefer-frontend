import React from "react";
import { useClickAway } from "react-use";
import { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import CloseIcon from "@/assets/svgs/closeIcon.svg";
import "./styles.scss";
import CircularProgressSpinner from "@/components/blueLoader";

const PdfViewer = ({ url, onClose, open }) => {
  const pdfRef = useRef(null);
  useClickAway(pdfRef, onClose);

  if (!open) return <></>;
  return (
    <div className="pdf__viewercontainer">
      <img src={CloseIcon} onClick={onClose} className="close__icon" />
      <div className="pdf__wrapper" ref={pdfRef}>
        <div className="pdf__loader">
          <CircularProgressSpinner />
        </div>
        <div className="viewer__wrapper">
          <iframe
            src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
            frameBorder="0"
            scrolling="auto"
            height="100%"
            width="100%"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
