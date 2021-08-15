import { useState, useRef } from "react";

import Button from "@/components/button";
import "@/styles/input.scss";
import "./styles.scss";
import { copyToClipboard } from "@/utilities";

const CTA_TEXT = "Complete";
const INITIAL_STATE = {
    name: "",
    email: "",
    url: "https://askrefer-frontend.herokuapp.com/referral/123",
};

export default function Index({ onSubmit }) {
    const inputRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);

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
                            placeholder="This is the name viewed will see next to the ask."
                            // onChange={changeState}
                            value={state.url}
                            ref={inputRef}
                            disabled
                        />
                        <div onClick={copyURLToClipboard} className="copy-button">
                            <h5>Tap to copy</h5>
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
                <Button text={CTA_TEXT} onClick={onSubmit} />
            </form>
        </div>
    );
}
