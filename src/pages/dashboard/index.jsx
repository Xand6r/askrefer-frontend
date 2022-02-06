import React, { useState, useEffect } from "react";
import Select from "react-select";

import Error404 from "@/pages/notFound";
import { postReq, getReq } from "@/api";
import { decodeToken, validateEmail, showErrorToast } from "@/utilities";

// import required components
import StackedBar from "./components/stackedbar";
// import required components

import "./styles.scss";

const DEFAULT_OPTIONS = [];

export default function Index({ match }) {
  const [posts, setPosts] = useState(DEFAULT_OPTIONS);
  const [error, setError] = useState(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [value, setValue] = useState(null);

  // state for the graphs
  const [viewsByDay, setViewsByDay] = useState([]);

  const triggerError = () => {
    setError(true);
  };

  const fetchViewsByDay = (postId) => {
    postReq("/dashboard/views", {
      postId,
    })
      .then(({ data }) => {
        setViewsByDay(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Run this function everytime the selected post is changed
   * Fetch all the required statistics for the selected post
   */
  useEffect(() => {
    if (!value || !value.value) return;
    // fetch all of the views by day
    fetchViewsByDay(value.value);
  }, [value]);

  /**
   * decode the token from the url parameter
   * Fetch all the active posts associated with this user from the backend
   * and default selection to the first post
   */
  useEffect(() => {
    try {
      const userToken = match.params.token;
      const { email } = decodeToken(userToken);
      if (!email || !validateEmail(email)) {
        triggerError();
      }
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
        })
        .catch((err) => {
          showErrorToast(err.message);
        })
        .finally(() => {
          setPostsLoading(false);
        });
    } catch (err) {
      triggerError();
    }
  }, []);

  if (error) {
    return <Error404 />;
  }

  console.log(value);

  return (
    <div id="dashboard-page">
      <div className="header__tab">
        <Select
          isLoading={postsLoading}
          placeholder="Select your post"
          options={posts}
          isDisabled={postsLoading}
          onChange={(newValue) => setValue(newValue)}
          value={value}
        />
      </div>

      {/* based on the selected item fetch the statistics */}

      {/* fetch the details for the views by day breakdown */}
      {viewsByDay.length ? (
        <StackedBar
          columnName="views"
          columnLabel="Total views per day"
          data={viewsByDay}
        />
      ) : (
        ""
      )}
      {/* fetch the details for the views by day breakdown */}

      {/* based on the selected item fetch the statistics */}
    </div>
  );
}
