import { useState } from "react";
import { useHistory } from "react-router";

import Button from "@/components/button";
import "@/styles/input.scss";

import "./styles.scss";
import { copyToClipboard, showErrorToast, showSuccessToast } from "@/utilities";
import { LINKEDIN_REGEXP, REDIRECT_DELAY } from "@/utilities/constants";
import { postReq } from "@/api";

const CTA_TEXT = "Generate Ask";

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

    const renderIconAndText = () => {
        return (
            <span>
                <i style={{ marginRight: "10px" }} class="fas fa-copy"></i>
                Copy Referral Link
            </span>
        );
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
        const message =
            "Your referral link has been copied to your clipboard.";
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
                <h1 className="slider-form__header">
                    {!link
                        ? "Tell us more about you"
                        : "Copy and share your link"}
                </h1>

                <h6 className="slider-form__subheader">
                    {!link
                        ? "AskRefer will update you on the progress of your Ask."
                        : "Copy your referral link or share it across linkedin and whatsapp."}
                    {!link ? (
                        <span> This would not be shared with the Viewers</span>
                    ) : (
                        ""
                    )}
                </h6>
            </div>

            <form action="javascript:void(0)">
                {!link ? (
                    <>
                        <div className="input__group">
                            <label htmlFor="">Name</label>
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
                            <input
                                type="text"
                                name="url"
                                placeholder="We use this to verify your identity."
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
                            onClick={submitPost}
                            loading={loading}
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
                                    href={`whatsapp://send?text=Hi, I’m looking for ${postState.title}; can you help? ${link}`}
                                    target="_blank"
                                >
                                    <i class="fab fa-whatsapp"></i>
                                    <h4>Share on Whatsapp</h4>
                                </a>
                                <Button
                                    text={renderIconAndText()}
                                    onClick={copyReferralLink}
                                />
                            </>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
