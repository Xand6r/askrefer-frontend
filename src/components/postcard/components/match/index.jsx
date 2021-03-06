import { useEffect, useState, useRef } from "react";
import Celebrate from "@/assets/svgs/happy.png";
import Button from "@/components/button";
import "@/styles/input.scss";
import "./styles.scss";
import { showErrorToast, showSuccessToast, validateEmail } from "@/utilities";
import { postReq } from "@/api";

const CTA_TEXT = "Complete";
const INITIAL_STATE = {
  name: "",
  email: "",
  url: "",
};

export default function Index({ onSubmit, user }) {
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const changeState = (e) => {
    const { name, value } = e.target;
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!user) return;
    setState({ ...user });
  }, [user]);

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "askrefer");
    data.append("cloud_name", "xand6r");

    return await fetch("https://api.cloudinary.com/v1_1/xand6r/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setState((state) => ({
          ...state,
          url: data.url,
        }));
      })
      .catch((err) => console.log(err));
  };

  const inputRef = useRef(null);

  const recommendSelf = async () => {
    if (loading) return;
    setLoading(true);
    const url = await uploadImage();
    const referralId = window.location.href.split("/").reverse()[0];
    postReq("/referral/recommend", {
      referralKey: referralId,
      user: {
        fullName: state.name,
        email: state.email,
        linkedIn: url ||state.url,
      },
    })
      .then(({ data: {response} }) => {
        const { error } = response;

        if (error === "ALREADY_APPLIED") {
          showErrorToast("You have already applied for this role, thank you!");
        } else {
          showSuccessToast(
            "Your application was successfull, you will be contacted if you are a match!"
          );
        }
        // onSubmit();
        setSubmitted(true);
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
    if (!validateEmail(email)) {
      return showErrorToast("Please fill in a valid email address");
    }
  };

  const allFieldsFilled = state.name && state.email;
  // state.url &&
  // validateEmail(state.email);
  // validateLinkedIn(state.url);
  const buttonIsDisabled = !allFieldsFilled || loading;

  return (
    <div id="kyc-form" className="slider-form">
      {!submitted ? (
        <>
          <div className="header-group">
            <h1 className="slider-form__header">Awesome!</h1>

            <h6 className="slider-form__subheader">
              We will share your details with the original poster. They will be
              in touch if it is a match.
            </h6>
          </div>

          <form action="javascript:void(0)">
            <div className="textarea-group">
              <h4 className="label" htmlFor="url">
                PDF attachment (Optional)
              </h4>
              <span className="input__group__subtitle">
                You can upload a document to signal qualification to fufill this ask.
              </span>
              <div
                className={`upload-wrapper __${file && "active"}`}
                onClick={() => {
                  inputRef.current.click();
                }}
              >
                {!file ? (
                  <h5>Supporting documents if available (PDF only)</h5>
                ) : (
                  ""
                )}
              </div>
              {/* hidden input for  file upload shadow */}
              <input
                onChange={(e) => {
                  const file = e.target.files[0];
                  const { type } = file;
                  if (type === "application/pdf") {
                    setFile(file);
                  } else {
                    showErrorToast(
                      `Invalid file type: ${type}, please upload a csv`
                    );
                  }
                }}
                style={{ display: "none" }}
                type="file"
                ref={inputRef}
              />
              <div className="filename">{file?.name}</div>
            </div>

            <div onClick={validateState}>
              <Button
                text={CTA_TEXT}
                onClick={recommendSelf}
                loading={loading}
                disabled={buttonIsDisabled}
              />
            </div>
          </form>
        </>
      ) : (
        <div className="postsubmit__section">
          <img src={Celebrate} />
          <div className="text__section">
            <i><b>Awesome!</b></i>, We will share your interest with the original
            poster, and they???ll be in touch if there???s a fit.
          </div>
        </div>
      )}
    </div>
  );
}
