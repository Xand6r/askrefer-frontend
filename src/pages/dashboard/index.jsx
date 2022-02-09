import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useClickAway } from "react-use";

import Error404 from "@/pages/notFound";
import { postReq, getReq } from "@/api";
import {
  decodeToken,
  validateEmail,
  showErrorToast,
  showSuccessToast,
} from "@/utilities";
import Overlay from "@/components/overlay";

// import required components
import DayBarChart from "./components/dayBar";
import UserBarChart from "./components/referrerBar";
import ConfirmDelete from "./components/confirmDelete";
import PostEditWindow from "./components/editPost";
// import required components

import "./styles.scss";
import CircularProgressSpinner from "@/components/blueLoader";
import axios from "axios";

const DEFAULT_OPTIONS = [];

export default function Index({ match }) {
  const [posts, setPosts] = useState(DEFAULT_OPTIONS);
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [openConfirmOverlay, setOpenConfirmOverlay] = useState(null);
  const [openEditOverlay, setOpenEditOverlay] = useState(null);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const selectedPost = allPosts.find((p) => p._id === value.value);

  // state for the graphs
  const [viewsByDay, setViewsByDay] = useState([]);
  const [viewsByUser, setViewsByUser] = useState([]);
  const [appliedCandidates, setAppliedCandidates] = useState([]);

  useClickAway(dropdownRef, () => setShowDropdown(false));

  const triggerError = () => {
    setError(true);
  };

  const removeApplicant = (applicantId) => {
    setAppliedCandidates(
      appliedCandidates.filter((a) => a.email !== applicantId)
    );
  };

  const rejectApplicant = async (link, userId) => {
    console.log(link);
    axios
      .get(link)
      .then((res) => {
        showSuccessToast(
          "You have sucesfully rejected this applicant, they will be notified"
        );
        removeApplicant(userId);
      })
      .catch((err) => {
        console.log(err);
        showErrorToast(
          "There was an error rejecting this candidate:",
          err.message
        );
      });
  };

  const acceptApplicant = async (link, userId) => {
    axios
      .get(link)
      .then((res) => {
        showSuccessToast(
          "You have sucesfully accepted this applicant, they will be notified"
        );
        removeApplicant(userId);
      })
      .catch((err) => {
        console.log(err);
        showErrorToast(
          "There was an error accepting this candidate:",
          err.message
        );
      });
  };
  const fetchViewsByDay = async (postId) => {
    await postReq("/dashboard/viewsbyday", {
      postId,
    })
      .then(({ data }) => {
        setViewsByDay(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchViewsByUser = async (postId) => {
    await postReq("/dashboard/viewsbyowner", {
      postId,
    })
      .then(({ data }) => {
        setViewsByUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAppliedCandidates = async (postId) => {
    await getReq(`/dashboard/applicants/${postId}`, {
      postId,
    })
      .then(({ data }) => {
        setAppliedCandidates(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(appliedCandidates);

  const closeDownPost = () => {
    if (loading) return;
    setLoading(true);
    getReq(`/post/close/${value.value}`)
      .then(({ data }) => {
        setLoading(false);
        setOpenConfirmOverlay(false);
        fetchInitialPost();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onEdit = () => {
    setOpenEditOverlay(true);
  };

  const onClose = () => {
    setOpenConfirmOverlay(true);
  };
  /**
   * Run this function everytime the selected post is changed
   * Fetch all the required statistics for the selected post
   */
  useEffect(() => {
    (async function () {
      if (!value || !value.value) return;
      try {
        const { value: postId } = value;
        setPostsLoading(true);
        // fetch all of the views by day
        await fetchViewsByDay(postId);
        // fetch all the views by user
        await fetchViewsByUser(postId);
        // fetch all shortlisted candidates
        await fetchAppliedCandidates(postId);
        setPostsLoading(false);
      } catch (err) {
        console.log("err");
        setPostsLoading(false);
      }
    })();
  }, [value]);

  /**
   * decode the token from the url parameter
   * Fetch all the active posts associated with this user from the backend
   * and default selection to the first post
   */
  const fetchInitialPost = () => {
    const userToken = match.params.token;
    const { email } = decodeToken(userToken);
    if (!email || !validateEmail(email)) {
      triggerError();
    }
    if (postsLoading) return;
    setPostsLoading(true);
    //make important requests to get all the active posts of this user
    postReq("/dashboard/activeposts", {
      email,
    })
      .then(({ data }) => {
        const mappedData = data.map((datum) => ({
          value: datum._id,
          label: datum.title,
        }));
        setPosts(mappedData);
        setValue(mappedData[0]);
        setAllPosts(data);
      })
      .catch((err) => {
        showErrorToast(err.message);
      })
      .finally(() => {
        setPostsLoading(false);
      });
  };
  useEffect(() => {
    try {
      fetchInitialPost();
    } catch (err) {
      triggerError();
    }
  }, []);

  if (error) {
    return <Error404 />;
  }

  return (
    <div id="dashboard-page">
      <div className="header__tab">
        <div className="header__select">
          <Select
            isLoading={postsLoading}
            placeholder="Select your post"
            options={posts}
            isDisabled={postsLoading}
            onChange={(newValue) => setValue(newValue)}
            value={value}
          />
        </div>
        <div className="header__dropdown">
          <i
            onClick={() => setShowDropdown(true)}
            class="fa fa-2x fa-bars"
            aria-hidden="true"
          ></i>
          {showDropdown && (
            <div ref={dropdownRef} className="options__dropdown">
              <div onClick={onEdit} className="dd-item">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                <span>Edit Post</span>
              </div>
              <div onClick={onClose} className="dd-item">
                <i class="fa fa-trash" aria-hidden="true"></i>
                <span>Delete Post</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* based on the selected item fetch the statistics */}

      {/* fetch the details for the views by day breakdown */}
      {postsLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgressSpinner />
        </div>
      ) : (
        <>
          {viewsByDay.length ? (
            <DayBarChart
              columnName="views"
              columnLabel="views per day"
              chartLabel="Total views of posts per day"
              data={viewsByDay}
            />
          ) : (
            ""
          )}
          {/* fetch the details for the views by day breakdown */}

          {/* fetch the details for the views by referrer breakdown */}
          {viewsByUser.length ? (
            <div style={{ marginTop: "20px" }}>
              <UserBarChart
                columnName="views"
                columnLabel="views per referrrer"
                chartLabel="Views of posts per referrrer"
                data={viewsByUser}
              />
            </div>
          ) : (
            ""
          )}
          {/* fetch the details for the views by referrer breakdown */}

          {/* display error messages */}
          {!viewsByDay.length && !viewsByUser.length && (
            <p style={{ textAlign: "center" }}>This Job has no views yet</p>
          )}

          {/* render details about the user who have applied  */}
          {appliedCandidates.length ? (
            <div className="candidates__applied">
              <p>Shortlist candidates</p>
              {/* render list of all available candidates to shortlist */}
              <div className="all__candidates">
                {appliedCandidates.map((oac) => (
                  <div className="one__candidate">
                    <span
                      className={
                        oac.url
                          ? "active__candidate candidate__name"
                          : "candidate__name"
                      }
                      onClick={() => {
                        oac.url && window.open(oac.url, "_blank");
                      }}
                    >
                      {oac.fullName}
                    </span>
                    <div className="candidate__actions">
                      <span
                        onClick={() =>
                          acceptApplicant(oac.acceptURL, oac.email)
                        }
                        className="actions__accept"
                      >
                        Accept
                      </span>
                      <span
                        onClick={() =>
                          rejectApplicant(oac.rejectURL, oac.email)
                        }
                        className="actions__reject"
                      >
                        Reject
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              This Job has no applicants yet
            </p>
          )}
          {/* render details about the user who have applied  */}
        </>
      )}

      {/* include the popup component */}
      <Overlay
        component={() => (
          <ConfirmDelete onSubmit={closeDownPost} loading={loading} />
        )}
        open={openConfirmOverlay}
        toggleOpen={() =>
          openConfirmOverlay &&
          !loading &&
          setOpenConfirmOverlay(!openConfirmOverlay)
        }
      />
      {/* include the popup component */}

      {/* include overlay for editing posts */}
      <Overlay
        component={() => (
          <PostEditWindow
            onClose={() => setOpenEditOverlay(false)}
            postState={selectedPost}
            onSuccess={fetchInitialPost}
          />
        )}
        open={openEditOverlay}
        toggleOpen={() =>
          openEditOverlay && !loading && setOpenEditOverlay(!openEditOverlay)
        }
      />
      {/* include overlay for editing posts */}
    </div>
  );
}
