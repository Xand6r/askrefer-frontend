import { useState, useRef } from "react";

import Overlay from "@/components/overlay";
import Button from "@/components/button";
import { isUrlValid, showErrorToast } from "@/utilities";

import Kyc from "./components/kyc";
import "./styles.scss";

const INITIAL_STATE = {
  desire: "",
  details: "",
  url: "",
  duration: 1000, //set an arbitrarily large deadline, because we no longer use deadlines
};

const TAB_NAMES = [1, 2, 4, 8];

const CTA_TEXT = "Proceed";
const TITLE_GUIDE =
  "Describe who you’re looking for with as few words as possible";
const MORE_GUIDE = "Share a bit more context in 1-2 sentences";
const EXTERNAL_GUIDE =
  "Add a weblink or URL to an external page with more information";
const DURATION_GUIDE =
  "Specify how long should your request should be active for";

function Tab({ name, selected }) {
  const className = `select-tab ${selected ? "--selected" : ""}`;
  return (
    <div className={className}>
      <h5>{name}</h5>
    </div>
  );
}

export default function Index() {
  const [state, setState] = useState(INITIAL_STATE);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateState = (name, value) => {
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { desire, details, url } = state;

    if (!desire) {
      return showErrorToast("Please supply what you are looking for.");
    }
    if (!details) {
      return showErrorToast(
        "Please supply more details to better explain your request."
      );
    }
  };

  console.log({ file });
  const buttonIsDisabled = !(state.desire && state.details);

  const formatState = () => ({
    title: state.desire,
    details: state.details,
    durationInWeeks: state.duration,
    url: formatURL(state.url),
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
        updateState(data.url);
      })
      .catch((err) => console.log(err));
  };

  const inputRef = useRef(null);

  return (
    <div id="post-page">
      <div className="textarea-group">
        <h4 className="label">
          I’m looking for…
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
          Tell us more
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
          External page (optional)
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

      <div className="select-group">
        <h4>
          Duration
          <div data-tip={DURATION_GUIDE} className="tooltip-wrapper">
            <i class="fas fa-info-circle fonticon"></i>
          </div>
        </h4>
        <div className="select-group__tabs">
          {TAB_NAMES.map((oneName) => (
            <div onClick={() => updateState("duration", oneName)}>
              <Tab
                selected={state.duration === oneName}
                name={`${oneName} ${oneName == 1 ? "Week" : " Weeks"}`}
              />
            </div>
          ))}
        </div>
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
