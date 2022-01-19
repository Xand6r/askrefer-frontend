import moment from "moment";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

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
const DEFAULT_SKELETON_HEIGHT = "50px";

export default function Index({ post, user }) {
  const [showPdf, setShowPdf] = useState(false);
  const [state, setState] = useState(INITIAL_STATE);
  const [yes, setYes] = useState(false);
  const [maybe, setMaybe] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [refLink, setrefLink] = useState("");
  const [stats, setStats] = useState(null);

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

  console.log({ stats });
  // get the stats of the owner of this page
  useEffect(() => {
    if (!Boolean(state.email) || stats) return;
    (async function fetchStatistics() {
      const { email } = state;
      const { data: stats } = await postReq("/user/statistics", { email });
      setStats(stats);
    })();
  }, [state]);

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
      <div className="top-nav" />
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
            <h6>{state.title}</h6>
          </div>
        </div>

        {/* section for the stats */}
        {stats ? (
          <div>
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

            <div className="action_details">
              <div onClick={generateReferral} className="action_button --maybe">
                <h5>Share</h5>
              </div>
              <div
                onClick={() => !loadingLink && setYes(true)}
                className="action_button --yes"
              >
                <h5>Shortlist me</h5>
              </div>
            </div>
          </div>
        ) : (
          <Skeleton style={{ height: DEFAULT_SKELETON_HEIGHT }} />
        )}
        {/* section for the stats */}

        {/* section for the actual post */}
        <div className="desire_details_wrapper">
          <div className="desire_details">
            <h4>More details</h4>
            <h5>{state.text}</h5>
          </div>
        </div>
        {/* section for the actual post */}

        {/* section for action to be taken */}
        {/* section for action to be taken */}

        {/* section to display pdfs */}
        {/* section to display pdfs */}
      </div>

      {/* <div className="top_section">
        <div className="post_content">
          <h5>
            {state.text}
            {state.url && state.url.endsWith('.pdf') ? (
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
        
      </div> */}
      {/* for yes */}
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
      <PdfViewer
        url={state.url}
        open={showPdf}
        onClose={() => setShowPdf(false)}
      />
      {/* for vieweing pdf */}
    </div>
  );
}
