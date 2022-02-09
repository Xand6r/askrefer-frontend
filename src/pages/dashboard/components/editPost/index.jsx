import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import Button from "@/components/button";
import "@/styles/input.scss";

import "./styles.scss";
import { copyToClipboard, showErrorToast } from "@/utilities";
import { LINKEDIN_REGEXP } from "@/utilities/constants";
import { postReq } from "@/api";

const CTA_TEXT = "Save";

const INITIAL_STATE = {
  details: "",
  title: "",
};

export default function Index({ postState, onSuccess, onClose }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [postId, setPostId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!postState) return;
    setState({
      title: postState.title,
      details: postState.details
    });
    setPostId(postState._id);
  }, [postState]);

  const changeState = (e) => {
    const { name, value } = e.target;
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const submitPost = () => {
    if (loading) return;
    if(!state.title){
      return showErrorToast("Please fill in a title");
    }
    if(!state.details){
      return showErrorToast("Please fill in more details");
    }
    setLoading(true);
    const payload = {
      postId: postId,
      newDetails: {
        title: state.title,
        details: state.details
    }
    };
    postReq("/post/edit", payload)
      .then(() => {
        showErrorToast("your ask has been sucesfully edited");
        onSuccess();
      })
      .catch((err) => {
        showErrorToast(
          err.response?.data.error || "There was an unknown error"
        );
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  const validateFields = () => {
    const { name, email, url } = state;
    if (!name) {
      return showErrorToast(
        "Please fill in a name we can use to identify you!"
      );
    }
    if (!email) {
      return showErrorToast(
        "Please fill in an email we can use to contact you!"
      );
    }
    if (url && !LINKEDIN_REGEXP.exec(url)) {
      return showErrorToast("Please enter a valid linkedIn profile URL");
    }
  };

  const allFieldsFilled =
    state.name && state.email && state.url
      ? LINKEDIN_REGEXP.exec(state.url)
      : true;
  const buttonIsDisabled = !allFieldsFilled || loading;

  return (
    <div id="kycf-form" className="slider-form">
      <div className="header-group">
        <h1 className="slider-form__header">Edit post</h1>

        <h6 className="slider-form__subheader">
          Edit the title and content of your post
        </h6>
      </div>

      <form action="javascript:void(0)">
          <>
            <div className="input__group">
              <label htmlFor="">Title</label>
              <input
                type="text"
                name="title"
                placeholder=""
                onChange={changeState}
                value={state.title}
                disabled={loading}
              />
            </div>
            <div className="textarea-group">
              <label htmlFor="">Summary</label>
              <textarea
                name="details"
                id=""
                rows="1"
                maxLength="50"
                placeholder=""
                onChange={changeState}
                value={state.details}
                disabled={loading}
              />
            </div>
          </>
        <div onClick={validateFields}>
          <Button
            text={CTA_TEXT}
            onClick={submitPost}
            loading={loading}
            disabled={buttonIsDisabled}
          />
        </div>
      </form>
    </div>
  );
}
