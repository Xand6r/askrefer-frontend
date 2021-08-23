import { useState, useRef, useEffect } from "react";

import Button from "@/components/button";
import "@/styles/input.scss";
import "./styles.scss";
import {
    copyToClipboard,
    showErrorToast,
    showSuccessToast,
    validateEmail,
} from "@/utilities";
import { postReq } from "@/api";
import CircularProgressSpinner from "@/components/loader";

const CTA_TEXT = "Complete";
const INITIAL_STATE = {
    email: "",
    url: "",
};

export default function Index({ onSubmit, link }) {
    const inputRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setState({
            ...state,
            url: link,
        });
    }, [link]);

    const changeState = (e) => {
        const { name, value } = e.target;
        setState((state) => ({
            ...state,
            [name]: value,
        }));
    };

    function copyURLToClipboard() {
        copyToClipboard(state.url, "Link copied to clipboard");
    }

    const validateInputs = () => {
        if (!state.email) {
            return showErrorToast("Please input your email before you submit");
        }

        if (!validateEmail(state.email)) {
            return showErrorToast("Please enter a valid email address");
        }
    };

    function attachUserToURL() {
        if (loading) return;
        setLoading(true);
        const referralId = link.split("/").reverse()[0];
        postReq("/referral/attach", {
            email: state.email,
            referralKey: referralId,
        })
            .then((res) => {
                onSubmit();
            })
            .catch((err) => {
                showErrorToast("There was an unknown error:", err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const buttonDisabled =
        !state.email || !validateEmail(state.email) || loading || !state.url;

    return (
        <div id="refer-form" className="slider-form">
            <div className="header-group">
                <h1 className="slider-form__header">Awesome!</h1>

                <h6 className="slider-form__subheader">
                    Share this Url with them
                </h6>
            </div>

            <form action="javascript:void(0)">
                <div className="input__group --refer">
                    <label htmlFor="">Url link</label>
                    <div className="refer_input__wrapper">
                        <input
                            type="text"
                            name="name"
                            placeholder="loading ... "
                            value={state.url}
                            ref={inputRef}
                            disabled
                        />
                        <div
                            onClick={copyURLToClipboard}
                            className="copy-button"
                        >
                            {state.url ? (
                                <h5>Tap to copy</h5>
                            ) : (
                                <CircularProgressSpinner />
                            )}
                        </div>
                    </div>
                </div>
                <div className="input__group">
                    <label htmlFor="">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Add your email to be notified if it's a match"
                        onChange={changeState}
                        value={state.email}
                    />
                </div>
                <div onClick={validateInputs}>
                    <Button
                        text={CTA_TEXT}
                        onClick={attachUserToURL}
                        disabled={buttonDisabled}
                        loading={loading}
                    />
                </div>
            </form>
        </div>
    );
}
