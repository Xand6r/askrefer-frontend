import { useState } from "react";
import PostCard from "@/components/postcard";
import Overlay from "@/components/overlay";

import Button from "@/components/button";
import "@/styles/input.scss";

import "./styles.scss";
import { copyToClipboard, showErrorToast } from "@/utilities";
import { LINKEDIN_REGEXP } from "@/utilities/constants";
import { postReq } from "@/api";

const CTA_TEXT = "Preview Ask";

export default function Index({ postState, backup, setBackup }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [openOverlay, setOpenOverLay] = useState(false);
  const [state, setState] = useState({ name: "", email: "", url: "" });

  const changeState = (e) => {
    const { name, value } = e.target;
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  useState(() => {
    setState(backup);
  }, []);

  const renderIconAndText = () => {
    return (
      <span>
        <i style={{ marginRight: "10px" }} class="fas fa-copy"></i>
        Copy Referral Link
      </span>
    );
  };

  const submitPost = async () => {
    const payload = {
      post: postState,
      user: {
        fullName: state.name,
        email: state.email,
        linkedIn: state.url,
      },
    };
    return postReq("/post/create", payload)
      .then(({ data: response }) => {
        const { referralLink } = response;
        setLink(referralLink);
        copyToClipboard(referralLink);
        setOpenOverLay(false);
      })
      .catch((err) => {
        showErrorToast(
          err.response?.data.error || "There was an unknown error"
        );
      });
  };

  const copyReferralLink = () => {
    const message = "Your referral link has been copied to your clipboard.";
    copyToClipboard(link, message);
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
    state.name &&
    state.email &&
    (state.url ? LINKEDIN_REGEXP.exec(state.url) : true);

  const buttonIsDisabled = !allFieldsFilled;

  return (
    <div id="kyc-form" className="slider-form">
      <div className="header-group">
        <h1 className="slider-form__header">
          {!link
            ? "Tell us more about you"
            : "Great! Now let’s share your request"}
        </h1>

        <h6 className="slider-form__subheader">
          {!link
            ? "This allows AskRefer to update you on the progress of your request"
            : "Copy and share your referral link or share across LinkedIn or WhatsApp"}
        </h6>
      </div>

      <form action="javascript:void(0)">
        {!link ? (
          <>
            <div className="input__group">
              <label htmlFor="">Name</label>
              <span className="input__group__subtitle">
                This will only be visible to approved viewers of your Ask{" "}
              </span>
              <input
                type="text"
                name="name"
                placeholder=""
                onChange={changeState}
                value={state.name}
                disabled={loading || link}
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
                placeholder=""
                onChange={changeState}
                value={state.email}
                disabled={loading || link}
              />
            </div>
            <div className="input__group">
              <label htmlFor="">Linkedin</label>
              <span className="input__group__subtitle">
                Adding your LinkedIn profile helps improve engagement on your
                search
              </span>
              <input
                type="text"
                name="url"
                onChange={changeState}
                value={state.url}
                disabled={loading || link}
              />
            </div>
          </>
        ) : (
          ""
        )}
        <div onClick={validateFields}>
          {!link ? (
            <Button
              text={CTA_TEXT}
              onClick={() => {
                setOpenOverLay(true);
                // have to add a wierd time out, or else i have to click the button multiple times, wierd right?
                // i dont understand why, also too lazy to investigate, good luck!
              }}
              disabled={buttonIsDisabled}
            />
          ) : (
            <div className="link">
              <>
                <a
                  id="linkedin"
                  className="share-button"
                  target="_blank"
                  title="Share on LinkedIn"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}
                >
                  <i class="fab fa-linkedin"></i>
                  <h4>Share on LinkedIn</h4>
                </a>
                <a
                  id="whatsapp"
                  className="share-button"
                  data-action="share/whatsapp/share"
                  href={`whatsapp://send?text=Hi! I’m looking for a ${postState.title.toLowerCase()}.  Can you help? ${link}`}
                  target="_blank"
                >
                  <i class="fab fa-whatsapp"></i>
                  <h4>Share on Whatsapp</h4>
                </a>
                <Button text={renderIconAndText()} onClick={copyReferralLink} />
              </>
            </div>
          )}
        </div>
      </form>
      <Overlay
        open={openOverlay}
        toggleOpen={() => openOverlay && setOpenOverLay(false) && setBackup(state)}
        component={() => (
          <PostCard
            post={{
              ...postState,
              owner: {
                fullName: state.name,
                url: state.url,
                email: state.email,
              },
            }}
            user={{}}
            preview
            onClose={() => openOverlay && setOpenOverLay(false) && setBackup(state)}
            onProceed={submitPost}
            open={openOverlay}
          />
        )}
      />
    </div>
  );
}
