import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import Error404 from "@/pages/notFound";
import { showErrorToast } from "@/utilities";
import PostCard from "@/components/postcard";
import interviewImage from "@/assets/svgs/interview.svg";
import Button from "@/components/button";
import Preview from "@/components/postcard/components/preview";
import Overlay from "@/components/overlay";

import { getReq } from "@/api";

import ExpiredPage from "./components/expired";
import "./styles.scss";

const CTA_TEXT = "Post an Ask";
const DEFAULT_SKELETON_HEIGHT = "225px";

export default function Index(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(true);

  const paramId = props.match.params.id;


  const gotoCreatePost = () => {
    history.push("/post");
  };

  if (error === "NOT_FOUND") {
    return <Error404 />;
  }

  if (error === "EXPIRED") {
    return <ExpiredPage />;
  }

  return (
    <div id="referral-page">
      {loading ? (
        <Skeleton style={{ height: DEFAULT_SKELETON_HEIGHT }} />
      ) : (
        <PostCard post={post} />
      )}
      {/* <img src={interviewImage} alt="poster" className="poster-image" /> */}
      <div className="post-ask">
        <Button text={CTA_TEXT} onClick={gotoCreatePost} />
      </div>

      {/* section for the identity verification footer */}
      <Overlay
        open={previewOpen}
        toggleOpen={() => previewOpen  && setPreviewOpen(false)}
        component={() => (
          <Preview
            onSubmit={(post) => {
              setPost({ ...post, referralId: paramId });
              setLoading(false);
              setPreviewOpen(false)
            }}
            setError={setError}
          />
        )}
      />
    </div>
  );
}
