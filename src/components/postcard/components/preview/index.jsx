import { useState } from "react";

import Button from "@/components/button";
import "@/styles/input.scss";
import "./styles.scss";
import {
  showErrorToast,
  showSuccessToast,
  validateEmail,
  validateLinkedIn,
} from "@/utilities";
import { LINKEDIN_REGEXP } from "@/utilities/constants";
import { postReq } from "@/api";
import { useHistory } from "react-router";

const CTA_TEXT = "Proceed";
const INITIAL_STATE = {
  name: "",
  email: "",
  url: "",
  code: "",
};

export default function Index({ onSubmit, setError }) {
  const history = useHistory();
  const [state, setState] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [post, setPost] = useState(null);

  const changeState = (e) => {
    const { name, value } = e.target;
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const authenticateUser = () => {
    if (loading) return;
    setLoading(true);

    if (stage) {
      // verify if the code is equal to the actual code
      // <ALEX></ALEX>
      if (post.key === state.code) {
        setTimeout(() => {
          setLoading(false);
          onSubmit(post.data, state);
        }, 1500);
      } else {
        setTimeout(() => {
          showErrorToast("Incorrect code!");
          setLoading(false);
        }, 1000);
      }
      return;
    }
    const referralId = window.location.href.split("/").reverse()[0];
    const completeState = {
      email: state.email,
      referralId,
    };

    postReq("/post/validateaccess", {
      ...completeState,
    })
      .then(({ data: response }) => {
        const { status, data, message, error } = response;
        if (error) {
          setError(error);
        }
        if (status === "ERROR") {
          return showErrorToast(message, {
            autoClose: 5000,
          });
        }
        if (data.accessControlMode === "public") {
          return onSubmit(data, state);
        }
        setStage(1);
        setPost(response);
      })
      .catch((err) => {
        showErrorToast(
          err.response?.data.error || "There was an unknown error"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateState = () => {
    const { email, name } = state;
    if (!email) {
      return showErrorToast(
        "Please fill in an email we can use to contact you!"
      );
    }
    if (!validateEmail(email)) {
      return showErrorToast("Please fill in a valid email address");
    }
    if (!name) {
      return showErrorToast("Please fill in a valid name");
    }
  };

  const allFieldsFilled =
    state.email && state.name && validateEmail(state.email);
  // validateLinkedIn(state.url);
  const buttonIsDisabled = !allFieldsFilled || loading;

  return (
    <div id="preview-form" className="slider-form">
      <div className="header-group">
        <h1 className="slider-form__header">Welcome!</h1>

        {!stage ? (
          <h6 className="slider-form__subheader">
            AskRefer is tool to securely indicate your interest in an opportunity, or refer it to someone else who might be a better fit.<br /><br />
            <i>Before proceeding, we need to double-check that you’re approved to view this opportunity. Please enter your details below.</i>
          </h6>
        ) : (
          <h6 className="slider-form__subheader">
            Please check your email for a five digit code to access the post
          </h6>
        )}
      </div>

      <form action="javascript:void(0)">
        {!stage ? (
          <>
            <div className="input__group">
              <label htmlFor="">Name</label>
              <span className="input__group__subtitle">
                This will only be visible to approved viewers of your Ask{" "}
              </span>
              <input
                type="text"
                name="name"
                onChange={changeState}
                value={state.name}
                placeholder="Hint: Elon Musk"
              />
            </div>
            <div className="input__group">
              <label htmlFor="">Email</label>
              <span className="input__group__subtitle">
                This won’t be shared publicly, and will only be used to update
                you on your search
              </span>
              <input
                type="text"
                name="email"
                onChange={changeState}
                value={state.email}
                placeholder="Hint: elon.musk@spacex.com "
              />
            </div>
            <div className="input__group">
              <label htmlFor="">LinkedIn (optional)</label>
              <span className="input__group__subtitle">
                Adding your LinkedIn profile helps improve engagement on your
                search
              </span>
              <input
                type="text"
                name="url"
                onChange={changeState}
                value={state.url}
                placeholder="Hint: https://linkedin.com/in/rocketman"
              />
            </div>
          </>
        ) : (
          <div className="input__group">
            <label htmlFor="">Code</label>
            <input
              type="text"
              name="code"
              onChange={changeState}
              value={state.code}
            />
          </div>
        )}
        <div onClick={validateState}>
          <Button
            text={CTA_TEXT}
            onClick={authenticateUser}
            loading={loading}
            disabled={buttonIsDisabled}
          />
        </div>
      </form>
    </div>
  );
}
