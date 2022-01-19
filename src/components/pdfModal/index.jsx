import React from "react";
import { useClickAway } from "react-use";
import { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import CloseIcon from "@/assets/svgs/closeIcon.svg";

const PdfViewer = ({ url, onClose, open }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const pdfRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoaded(true);
  }
  useClickAway(pdfRef, onClose);
  console.log({url})

  const nextPage = () => setPageNumber((p) => p + 1);
  const previousPage = () => setPageNumber((p) => p - 1);
  const isNextPage = pageNumber < numPages;
  const isPreviousPage = pageNumber > 1;

  if (!open) return <></>;
  return (
    <div className="pdf__viewercontainer">
      <img src={CloseIcon} onClick={onClose} className="close__icon" />
      <div ref={pdfRef}>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        {numPages && (
          <div className="pagination__wrapper">
            <div className="navigation">
              {isPreviousPage && <span style={{zIndex: 10000}} onClick={previousPage}>previous page</span>}
              {isNextPage && <span style={{zIndex: 10000}} onClick={nextPage}>next page</span>}
            </div>
            <div className="pages">
              Page {pageNumber} of {numPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
