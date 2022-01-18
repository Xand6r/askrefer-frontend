import { useState, useRef, useEffect } from "react";
import { useClickAway } from "react-use";

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

export default function Index({ onSubmit, link, post, user }) {
    const inputRef = useRef();
    const dropdownRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [attached, setAttached] = useState(false);

    useEffect(() => {
        setState({
            ...user,
            url: link,
        });
    }, [link]);

    const closeDropdown = () => {
        setShowDropdown(false);
    };

    useClickAway(dropdownRef, closeDropdown);

    const renderDropdown = () => {
        if(!state.email ){
            return showErrorToast("Please fill in your email adress first!");
        }
        if(!validateEmail(state.email)){
            return showErrorToast("Please fill in a valid email adress!");
        }
        if (state.url) {
            setShowDropdown(true);
        }
    };

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

    function attachUserToURL(user) {
        setLoading(true);
        setAttached(true)
        const referralId = link.split("/").reverse()[0];
        postReq("/referral/attach", {
            email: user.email,
            referralKey: referralId,
        })
            .then((res) => {
                console.log(res);
                console.log("Attacked")
                setAttached(true)
            })
            .catch((err) => {
                console.log(
                    err.response?.data.error || "There was an unknown error attaching user to link"
                );
                setAttached(false)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if(!link || attached || loading) return;
        attachUserToURL(user);
    },[link]);

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
                        <div onClick={renderDropdown} className="copy-button">
                            {state.url ? (
                                <h5>Tap to share</h5>
                            ) : (
                                <CircularProgressSpinner />
                            )}
                            {showDropdown ? (
                                <div
                                    ref={dropdownRef}
                                    className="share-dropdown"
                                >
                                    <h5
                                        onClick={copyURLToClipboard}
                                        className="item"
                                    >
                                        <i
                                            style={{ marginRight: "10px" }}
                                            class="fas fa-copy"
                                        ></i>
                                        copy link
                                    </h5>
                                    <h5 className="item">
                                        <a
                                            id="whatsapp"
                                            className="share-button"
                                            data-action="share/whatsapp/share"
                                            href={`whatsapp://send?text=Hi! My friend is looking for ${post.title}. Can you help? ${state.url}`}
                                            target="_blank"
                                        >
                                            <i
                                                style={{ marginRight: "10px" }}
                                                class="fab fa-whatsapp"
                                            ></i>
                                            whatsapp
                                        </a>
                                    </h5>
                                    <h5 className="item">
                                        <a
                                            id="linkedin"
                                            className="share-button"
                                            target="_blank"
                                            title="Share on LinkedIn"
                                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}
                                        >
                                            <i
                                                style={{ marginRight: "10px" }}
                                                class="fab fa-linkedin"
                                            ></i>
                                            linkedin
                                        </a>
                                    </h5>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className="input__group">
                    <label htmlFor="">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Add your email to be notified if it's a match"
                        onChange={changeState}
                        value={state.email}
                    />
                </div>
                <div className="input__group">
                    <label htmlFor="">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Add your name"
                        onChange={changeState}
                        value={state.name}
                    />
                </div> */}
                <div onClick={validateInputs}>
                    <Button
                        text={CTA_TEXT}
                        onClick={onSubmit}
                        disabled={buttonDisabled}
                        loading={loading}
                    />
                </div>
            </form>
        </div>
    );
}
