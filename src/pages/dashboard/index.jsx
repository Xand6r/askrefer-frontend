import React, { useState, useEffect } from "react";
import Select from "react-select";

import Error404 from "@/pages/notFound";
import { postReq, getReq } from "@/api";
import { decodeToken, validateEmail, showErrorToast } from "@/utilities";

// import required components
import DayBarChart from "./components/dayBar";
import UserBarChart from "./components/referrerBar";
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
  const [viewsByUser, setViewsByUser] = useState([]);

  const triggerError = () => {
    setError(true);
  };

  const fetchViewsByDay = (postId) => {
    postReq("/dashboard/viewsbyday", {
      postId,
    })
      .then(({ data }) => {
        setViewsByDay(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchViewsByUser = (postId) => {
    postReq("/dashboard/viewsbyowner", {
      postId,
    })
      .then(({ data }) => {
        setViewsByUser(data);
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
    const { value: postId } = value;
    // fetch all of the views by day
    fetchViewsByDay(postId);
    // fetch all the views by user
    fetchViewsByUser(postId);
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
      {viewsByUser.length ? (
        <div style={{marginTop: "20px"}}>
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
      {/* based on the selected item fetch the statistics */}
    </div>
  );
}
