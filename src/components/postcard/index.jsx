import moment from "moment";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import Button from "@/components/button";
import { getReq, postReq } from "@/api";
import PdfViewer from "@/components/pdfModal";
import Overlay from "@/components/overlay";
import { showSuccessToast } from "@/utilities";
import { getAvatarDetails, gotoURL, showErrorToast } from "@/utilities";

import Match from "./components/match";
import Refer from "./components/refer";
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
  email: "",
};

const TIMEOUT_DURATION = 1500;
const DEFAULT_SKELETON_HEIGHT = "100px";

export default function Index({
  post,
  user,
  preview,
  onClose,
  onProceed,
  open,
}) {
  const [showPdf, setShowPdf] = useState(false);
  const [state, setState] = useState(INITIAL_STATE);
  const [yes, setYes] = useState(false);
  const [maybe, setMaybe] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [refLink, setrefLink] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const {
      createdAt,
      details,
      expiryDate,
      title,
      url,
      _id,
      referralId,
      owner: { fullName = "", url: userUrl = "", email },
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
      email,
    });
  }, []);

  // get the stats of the owner of this page
  useEffect(() => {
    if (!Boolean(state.email) || stats || (preview && !open)) return;
    (async function fetchStatistics() {
      const { email } = state;
      const { data: stats } = await postReq("/user/statistics", { email });
      setStats(stats);
    })();
  }, [state, open]);
  const avatarDetails = getAvatarDetails(state.fullName);

  const onViewMore = () => {
    setShowPdf(true);
  };

  const createPost = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onProceed();
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
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
  const isPdf = state.url && state.url.endsWith("pdf");
  // moment
  return (
    <div id="post-card">
      <div className="top-nav">
        {preview && <CloseIcon onClose={onClose} />}
      </div>
      <div className="content-body">
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
            <h3
              onClick={gotoOwnerReference}
              style={{ cursor: state.userUrl ? "pointer" : "text" }}
              className="poster_details__text"
            >
              {state.fullName}
            </h3>
            <h6>Is looking for {state.title}</h6>
          </div>
        </div>

        {/* section for the stats */}
        <div>
          {stats ? (
            <div className="stats_details">
              <div className="one_detail">
                <h2> {stats.postcount} </h2>
                <h5>Posts</h5>
              </div>

              <div className="one_detail">
                <h2> {stats.referralCount} </h2>
                <h5>Referrals</h5>
              </div>

              <div className="one_detail">
                <h2> {stats.totalAccepted} </h2>
                <h5>Hires</h5>
              </div>
            </div>
          ) : (
            <Skeleton style={{ height: DEFAULT_SKELETON_HEIGHT }} />
          )}

          <div className="action_details">
            <div
              onClick={() => !preview && !loadingLink && setYes(true)}
              className="action_button --yes"
            >
              <h5>I’m interested. Please shortlist me</h5>
            </div>
            <div
              onClick={() => !preview && generateReferral()}
              className="action_button --maybe"
            >
              <h5>I can refer someone else</h5>
            </div>
          </div>
        </div>
        {/* section for the stats */}

        {/* section for the actual post */}
        <div className="desire_details_wrapper">
          <div className="desire_details">
            <h4>More details</h4>
            <h5>{state.text}</h5>
          </div>
        </div>
        {/* section for the actual post */}

        {/* section to display pdf attachments*/}
        {isPdf ? (
          <div className="attachment_details_wrapper">
            <div className="attachment_details">
              <h4>Attached Media</h4>
              <div onClick={onViewMore} className="attachments">
                <div className="pdf__dummy">
                  <i class="fas fa-4x fa-file-pdf"></i>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* section to display pdfs */}
      </div>

      <Overlay
        open={yes}
        toggleOpen={() => yes && setYes(false)}
        component={() => (
          <Match
            user={user}
            postId={state.postId}
            link={refLink}
            onSubmit={onSubmitYes}
          />
        )}
      />
      {/* for maybe */}
      <Overlay
        open={maybe}
        toggleOpen={() => maybe && setMaybe(false)}
        component={() => (
          <Refer
            user={user}
            link={refLink}
            post={state}
            onSubmit={onSubmitMaybe}
          />
        )}
      />
      {/* for vieweing pdf */}
      {state.url && (
        <PdfViewer
          url={state.url}
          open={showPdf}
          onClose={() => setShowPdf(false)}
        />
      )}
      {/* for vieweing pdf */}
      {/* wrapper for button to submit when in preview mode */}
      {preview && open ? (
        <div className="endpreview__button">
          <Button
            text="Publish Ask"
            onClick={createPost}
            disabled={loading}
            loading={loading}
          />
        </div>
      ) : (
        ""
      )}
      {/* wrapper for button to submit when in preview mode */}
    </div>
  );
}

const CloseIcon = ({ onClose }) => (
  <div onClick={onClose} className="close__icon">
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 5.05578L11.5558 0L13 1.44422L7.94422 6.5L13 11.5558L11.5558 13L6.5 7.94422L1.44422 13L0 11.5558L5.05578 6.5L0 1.44422L1.44422 0L6.5 5.05578Z"
        fill="#000"
      />
    </svg>
  </div>
);
