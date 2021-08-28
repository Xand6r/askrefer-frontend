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

const CTA_TEXT = "Complete";
const INITIAL_STATE = {
    name: "",
    email: "",
    url: "",
};

export default function Index({ onSubmit, postId, link }) {
    const history = useHistory();
    const [state, setState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);

    const changeState = (e) => {
        const { name, value } = e.target;
        setState((state) => ({
            ...state,
            [name]: value,
        }));
    };

    const recommendSelf = () => {
        if (loading) return;
        setLoading(true);
        const referralId = window.location.href.split("/").reverse()[0];
        postReq("/referral/recommend", {
            referralKey: referralId,
            user: {
                fullName: state.name,
                email: state.email,
                linkedIn: state.url,
            },
        })
            .then(({ data: response }) => {
                const { error } = response;
                if (error === "ALREADY_APPLIED") {
                    showErrorToast(
                        "You have already applied for this role, thank you!"
                    );
                } else {
                    showSuccessToast("Your application was successfull, you will be contacted if you are a match!");
                }
                onSubmit();
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
        if (!url) {
            return showErrorToast(
                "Please fill in your linkedIn url we can use to validate your identity!"
            );
        }
        if (!validateLinkedIn(url)) {
            return showErrorToast("Please enter a valid linkedIn profile URL");
        }
    };

    const allFieldsFilled =
        state.name &&
        state.email &&
        state.url &&
        validateEmail(state.email) &&
        validateLinkedIn(state.url);
    const buttonIsDisabled = !allFieldsFilled || loading;

    return (
        <div id="kyc-form" className="slider-form">
            <div className="header-group">
                <h1 className="slider-form__header">Awesome!</h1>

                <h6 className="slider-form__subheader">
                    We will share your details with the original poster. They
                    will be in touch if it is a match.
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
                    />
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
        </div>
    );
}
