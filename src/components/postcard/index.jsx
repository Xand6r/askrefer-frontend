import moment from "moment";
import { getReq } from "@/api";
import { useClickAway } from "react-use";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import Match from "./components/match";
import Refer from "./components/refer";
import Overlay from "@/components/overlay";
import CloseIcon from "@/assets/svgs/closeIcon.svg";
import { showSuccessToast } from "@/utilities";
import { DATE_FORMAT } from "@/utilities/constants";
import { getAvatarDetails, gotoURL, showErrorToast } from "@/utilities";
import CircularProgressSpinner from "../loader";

import "./styles.scss";

const INITIAL_STATE = {
  fullName: "",
  title: "",
  text: "",
  url: "",
  expiryDate: "",
  creationDate: "",
  postId: "",
  referralId: "",
  userUrl: "",
};

const TIMEOUT_DURATION = 1500;

export default function Index({ post }) {
  const [showPdf, setShowPdf] = useState(false);
  const [state, setState] = useState(INITIAL_STATE);
  const [yes, setYes] = useState(false);
  const [maybe, setMaybe] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [refLink, setrefLink] = useState("");

  const history = useHistory();
  console.log({ post });

  useEffect(() => {
    const {
      createdAt,
      details,
      expiryDate,
      title,
      url,
      _id,
      referralId,
      owner: { fullName = "", url: userUrl = "" },
      owner,
    } = post;
    setState({
      ...state,
      fullName,
      title: title,
      text: details,
      url: url,
      expiryDate: expiryDate,
      creationDate: createdAt,
      referralId,
      postId: _id,
      userUrl,
    });
  }, []);

  const avatarDetails = getAvatarDetails(state.fullName);

  const onViewMore = () => {
    setShowPdf(true);
  };

  const today = moment();
  const creationDate = moment(state.creationDate);
  const expiryDate = moment(state.expiryDate);
  const timeDifferenceText = (dayDiff) => {
    const expiresIn =
      dayDiff === 0 ? "Today" : dayDiff === 1 ? "1 day" : `${dayDiff} days`;
    return expiresIn;
  };

  const goHome = () => {
    setTimeout(() => {
      history.push("/");
    }, TIMEOUT_DURATION);
  };

  const generateReferral = () => {
    const { referralId } = state;
    if (loadingLink) return;
    // generate a new link then set maybe
    setLoadingLink(true);
    setMaybe(true);
    getReq(`/referral/refer/${referralId}`)
      .then(({ data: response }) => {
        const { link } = response;
        setrefLink(link);
      })
      .catch((err) => {
        showErrorToast(
          err.response?.data.error || "There was an unknown error"
        );
      })
      .finally(() => {
        setLoadingLink(false);
      });
  };

  const onSubmitYes = () => {
    setYes(false);
    goHome();
  };

  const onSubmitMaybe = () => {
    showSuccessToast("We will be in touch. Thank you");
    setMaybe(false);
    goHome();
  };

  const onSubmitNo = () => {
    if (loadingLink) return;
    showSuccessToast("Maybe next time. Thank you");
    goHome();
  };

  const gotoOwnerReference = () => {
    if (!state.userUrl) return;
    window.open(state.userUrl, "_blank");
  };

  const expiresIn = timeDifferenceText(expiryDate.diff(creationDate, "day"));
  const postedAt = timeDifferenceText(today.diff(creationDate, "day"));

  // moment
  return (
    <div id="post-card">
      <div className="top_section">
        <div className="poster_details">
          <div
            style={{
              backgroundColor: avatarDetails.color,
              cursor: state.userUrl ? "pointer" : "text",
            }}
            onClick={gotoOwnerReference}
            className="poster_details__img"
          >
            <h4>{avatarDetails.initials}</h4>
          </div>
          <div className="extra_details">
            <h5
              onClick={gotoOwnerReference}
              style={{ cursor: state.userUrl ? "pointer" : "text" }}
              className="poster_details__text"
            >
              {state.fullName}
            </h5>
            <h6>Looking for {state.title}</h6>
          </div>
        </div>
        <div className="post_content">
          <h5>
            {state.text}
            {state.url ? (
              <span onClick={onViewMore}>
                <i class="fas fa-external-link-alt"></i>
              </span>
            ) : (
              <></>
            )}
          </h5>
        </div>
        <div className="auxilliary_content">
          <h6 className="auxilliary_content__posted">
            {postedAt} {postedAt === "Today" ? "" : "ago"}
          </h6>
        </div>
      </div>
      <div className="divider" />
      <div className="bottom_section">
        <div onClick={onSubmitNo} className="action_button --no">
          <h5>Nope, sorry</h5>
        </div>
        <div onClick={generateReferral} className="action_button --maybe">
          <h5>I know the guy</h5>
        </div>
        <div
          onClick={() => !loadingLink && setYes(true)}
          className="action_button --yes"
        >
          <h5>I am your guy</h5>
        </div>
      </div>
      {/* for yes */}
      <Overlay
        open={yes}
        toggleOpen={() => yes && setYes(false)}
        component={() => (
          <Match postId={state.postId} link={refLink} onSubmit={onSubmitYes} />
        )}
      />
      {/* for maybe */}
      <Overlay
        open={maybe}
        toggleOpen={() => maybe && setMaybe(false)}
        component={() => (
          <Refer link={refLink} post={state} onSubmit={onSubmitMaybe} />
        )}
      />
      {/* for vieweing pdf */}
      <PdfViewer
        url={state.url}
        open={showPdf}
        onClose={() => setShowPdf(false)}
      />
      {/* for vieweing pdf */}
    </div>
  );
}

const PdfViewer = ({ url, onClose, open }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pdfRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  useClickAway(pdfRef, onClose);

  if (!open) return <></>;
  return (
    <div className="pdf__viewercontainer">
      <img src={CloseIcon} onClick={onClose} className="close__icon" />
      <div ref={pdfRef}>
        <Document
          file="http://res.cloudinary.com/xand6r/image/upload/v1642348774/askrefer/ewztcdodhjvud7vcnm1o.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    </div>
  );
};
