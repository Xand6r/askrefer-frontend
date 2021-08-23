import { useState } from "react";

import Button from "@/components/button";
import "@/styles/input.scss";
import "./styles.scss";

const CTA_TEXT = "Complete";
const INITIAL_STATE = {
    name: "",
    email: "",
    url: "",
};

export default function Index({ onSubmit }) {
    const [state, setState] = useState(INITIAL_STATE);
    const changeState = (e) => {
        const { name, value } = e.target;
        setState((state) => ({
            ...state,
            [name]: value,
        }));
    };
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
                <Button text={CTA_TEXT} onClick={onSubmit} />
            </form>
        </div>
    );
}
