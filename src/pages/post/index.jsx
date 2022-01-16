import { useState, useRef } from "react";
import Toggle from "react-toggle";
import { TagsInput } from "react-tag-input-component";

import Overlay from "@/components/overlay";
import Button from "@/components/button";
import { showErrorToast } from "@/utilities";

import Kyc from "./components/kyc";
import "./styles.scss";

const INITIAL_STATE = {
  desire: "",
  details: "",
  url: "",
  duration: 1000, //set an arbitrarily large deadline, because we no longer use deadlines
  public: false,
  allowedEmails: [],
};

const CTA_TEXT = "Proceed";
const TITLE_GUIDE =
  "Describe who you’re looking for with as few words as possible";
const MORE_GUIDE = "Share a bit more context in 1-2 sentences";
const ACCESS_CONTROL_MODE = "You can either make the post public or input a number of mails to share it to"
const EXTERNAL_GUIDE = "Upload a pdf with more information";

export default function Index() {
  const [state, setState] = useState(INITIAL_STATE);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(["papaya"]);

  const updateState = (name, value) => {
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { desire, details } = state;

    if (!desire) {
      return showErrorToast("Please supply what you are looking for.");
    }
    if (!details) {
      return showErrorToast(
        "Please supply more details to better explain your request."
      );
    }
  };

  const buttonIsDisabled = !(state.desire && state.details);

  const formatState = () => ({
    title: state.desire,
    details: state.details,
    durationInWeeks: state.duration,
    url: formatURL(state.url), //make sure urls not preceeded by http/https are rectified so as not to cause errors
    accessControlMode: state.public ? "public" : "private",
    allowedEmails: state.allowedEmails
  });

  const formatURL = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `http://${url}`;
  };

  const gotoSecondState = async () => {
    setLoading(true);
    //upload an image to cloundinary
    await uploadImage();
    setLoading(false);
    setOpenOverlay(true);
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "askrefer");
    data.append("cloud_name", "xand6r");

    await fetch("https://api.cloudinary.com/v1_1/xand6r/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        updateState("url", data.url);
      })
      .catch((err) => console.log(err));
  };

  const inputRef = useRef(null);

  return (
    <div id="post-page">
      <div className="textarea-group">
        <h4 className="label">
          Title
          <div data-tip={TITLE_GUIDE} className="tooltip-wrapper">
            <i class="fas fa-info-circle fonticon"></i>
          </div>
        </h4>
        <textarea
          name="desire"
          id=""
          rows="1"
          maxLength="50"
          onChange={(e) => updateState(e.target.name, e.target.value)}
          value={state.desire}
        ></textarea>
      </div>

      <div className="textarea-group">
        <h4 className="label" htmlFor="details">
          Summary
          <div data-tip={MORE_GUIDE} className="tooltip-wrapper">
            <i class="fas fa-info-circle fonticon"></i>
          </div>
        </h4>
        <textarea
          name="details"
          id=""
          cols="30"
          rows="10"
          onChange={(e) => updateState(e.target.name, e.target.value)}
          value={state.details}
        ></textarea>
      </div>

      <div className="textarea-group">
        <h4 className="label" htmlFor="url">
          PDF attachment
          <div data-tip={EXTERNAL_GUIDE} className="tooltip-wrapper">
            <i class="fas fa-info-circle fonticon"></i>
          </div>
        </h4>
        <div
          className={`upload-wrapper __${file && "active"}`}
          onClick={() => {
            inputRef.current.click();
          }}
        ></div>
        {/* hidden input for  file upload shadow */}
        <input
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
          type="file"
          ref={inputRef}
        />
        <div className="filename">{file?.name}</div>
      </div>

      <div className="textarea-group">
        <h4 className="label" htmlFor="details">
          Grant public access
          <div data-tip={ACCESS_CONTROL_MODE} className="tooltip-wrapper">
            <i class="fas fa-info-circle fonticon"></i>
          </div>
          <Toggle
            defaultChecked={state.public}
            icons={false}
            onChange={() => {
              updateState("public", !state.public);
            }}
          />
        </h4>
        {!state.public ? (
          <TagsInput
            value={state.allowedEmails}
            onChange={(val) => updateState('allowedEmails', val)}
            name="fruits"
            placeHolder="Invite people by mail"
            seprators={["Enter", " ", ","]}
          />
        ) : (
          <></>
        )}
      </div>

      <div onClick={validateForm} className="submit-button">
        <Button
          text={CTA_TEXT}
          onClick={gotoSecondState}
          disabled={buttonIsDisabled}
          loading={loading}
        />
      </div>
      <Overlay
        open={openOverlay}
        toggleOpen={() => openOverlay && setOpenOverlay(false)}
        component={() => <Kyc postState={formatState()} />}
      />
    </div>
  );
}
