import { useState, useRef } from "react";
import Toggle from "react-toggle";
import { TagsInput } from "react-tag-input-component";

import PostCard from "@/components/postcard";
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
  public: true,
  allowedEmails: [],
};

const KYC_INITIAL_STATE = {
  name: "",
  email: "",
  url: "",
};

const CTA_TEXT = "Proceed";

export default function Index() {
  const [state, setState] = useState(INITIAL_STATE);
  const [kycState, setKycState] = useState(KYC_INITIAL_STATE);
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
    allowedEmails: state.allowedEmails,
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
    if(file){
      await uploadImage();
    }
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
      <div className="post-title">
        <h2>Create an Ask</h2>
        <h5>
          Tell us who you’re looking for and attach any supporting documents
        </h5>
      </div>
      <div className="textarea-group">
        <h4 className="label">Title</h4>
        <textarea
          name="desire"
          id=""
          rows="1"
          maxLength="50"
          onChange={(e) => updateState(e.target.name, e.target.value)}
          value={state.desire}
          placeholder="Hint: A top tier VC with space technology experience"
        ></textarea>
      </div>

      <div className="textarea-group">
        <h4 className="label" htmlFor="details">
          Summary
        </h4>
        <textarea
          name="details"
          id=""
          cols="30"
          rows="10"
          onChange={(e) => updateState(e.target.name, e.target.value)}
          value={state.details}
          placeholder="Hint: Our company, SpaceX, is raising a $500M round. We’re targeting a huge market, have great traction, and have already secured two term sheets. We’re searching for spacetech investors who might be a good fit"
        ></textarea>
      </div>

      <div className="textarea-group">
        <h4 className="label" htmlFor="url">
          PDF attachment
        </h4>
        <div
          className={`upload-wrapper __${file && "active"}`}
          onClick={() => {
            inputRef.current.click();
          }}
        >
          {!file ? <h5>Supporting documents if available (PDF only)</h5> : ""}
        </div>
        {/* hidden input for  file upload shadow */}
        <input
          onChange={(e) => {
            const file = e.target.files[0];
            const { type } = file;
            if (type === "application/pdf") {
              setFile(file);
            } else {
              showErrorToast(`Invalid file type: ${type}, please upload a csv`);
            }
          }}
          style={{ display: "none" }}
          type="file"
          ref={inputRef}
        />
        <div className="filename">{file?.name}</div>
      </div>

      <div className="textarea-group">
        <div className="access-control-wrapper">
          <h4 className="" htmlFor="details">
            Who can view my Ask?
          </h4>
          <div>
            <Toggle
              defaultChecked={state.public}
              icons={false}
              onChange={() => {
                updateState("public", !state.public);
              }}
            />
            <span>public access - {state.public ? "on" : "off"}</span>
          </div>
        </div>
        {!state.public ? (
          <TagsInput
            value={state.allowedEmails}
            onChange={(val) => updateState("allowedEmails", val)}
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
        component={() => <Kyc backup={kycState} setBackup={setKycState} postState={formatState()} />}
      />
    </div>
  );
}
