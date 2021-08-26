import { useState } from "react";
import { useHistory } from "react-router";

import Button from "@/components/button";
import "@/styles/input.scss";

import "./styles.scss";
import { copyToClipboard, showErrorToast, showSuccessToast } from "@/utilities";
import { LINKEDIN_REGEXP, REDIRECT_DELAY } from "@/utilities/constants";
import { postReq } from "@/api";

const CTA_TEXT = "Complete";

const INITIAL_STATE = {
    name: "",
    email: "",
    url: "https://www.linkedin.com/in/alex-ander-shuaibu-28889b17a/",
};

export default function Index({ postState }) {
    const [state, setState] = useState(INITIAL_STATE);
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const changeState = (e) => {
        const { name, value } = e.target;
        setState((state) => ({
            ...state,
            [name]: value,
        }));
    };

    const submitPost = () => {
        if (loading) return;
        setLoading(true);
        const payload = {
            post: postState,
            user: {
                fullName: state.name,
                email: state.email,
                linkedIn: state.url,
            },
        };
        postReq("/post/create", payload)
            .then(({ data: response }) => {
                const { referralLink } = response;
                setLink(referralLink);
                copyToClipboard(referralLink);
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

    const copyReferralLink = () => {
        showSuccessToast(
            "Your referral link has been copied to your clipboard. you will be redirected"
        );
        copyToClipboard(state.url, "Link copied to clipboard");
        setTimeout(() => {
            history.push("/");
        }, REDIRECT_DELAY);
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
        if (!url) {
            return showErrorToast(
                "Please fill in your linkedIn url we can use to validate your identity!"
            );
        }
        if (!LINKEDIN_REGEXP.exec(url)) {
            return showErrorToast("Please enter a valid linkedIn profile URL");
        }
    };

    const allFieldsFilled =
        state.name &&
        state.email &&
        state.url &&
        LINKEDIN_REGEXP.exec(state.url);
    const buttonIsDisabled = !allFieldsFilled || loading;
    return (
        <div id="kyc-form" className="slider-form">
            <div className="header-group">
                <h1 className="slider-form__header">About you</h1>

                <h6 className="slider-form__subheader">
                    This allows AskRefer to send you update on who is interested
                    in your ask.{" "}
                    <span>This would not be shared with the Viewers</span>
                </h6>
            </div>

            <form action="javascript:void(0)">
                <div className="input__group">
                    <label htmlFor="">Full name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="This is the name viewed will see next to the ask."
                        onChange={changeState}
                        value={state.name}
                        disabled={loading || link}
                    />
                </div>
                <div className="input__group">
                    <label htmlFor="">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="This is the email you will be contacted with."
                        onChange={changeState}
                        value={state.email}
                        disabled={loading || link}
                    />
                </div>
                <div className="input__group">
                    <label htmlFor="">Linkedin Url</label>
                    <input
                        type="text"
                        name="url"
                        placeholder="We use this to verify your identity."
                        onChange={changeState}
                        value={state.url}
                        disabled={loading || link}
                    />
                </div>
                <div onClick={validateFields}>
                    {!link ? (
                        <Button
                            text={CTA_TEXT}
                            onClick={submitPost}
                            loading={loading}
                            disabled={buttonIsDisabled}
                        />
                    ) : (
                        <Button
                            text="Copy Referral Link"
                            onClick={copyReferralLink}
                        />
                    )}
                </div>
            </form>
        </div>
    );
}
