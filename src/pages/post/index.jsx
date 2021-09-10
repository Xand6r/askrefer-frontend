import { useState } from "react";

import Overlay from "@/components/overlay";
import Button from "@/components/button";
import { isUrlValid, showErrorToast } from "@/utilities";

import Kyc from "./components/kyc";
import "./styles.scss";

const INITIAL_STATE = {
    desire: "",
    details: "",
    url: "",
    duration: 1,
};

const TAB_NAMES = [1, 2, 4, 8];

const CTA_TEXT = "Proceed";
const TITLE_GUIDE = "Describe who you’re looking for with as few words as possible";
const MORE_GUIDE = "Share a bit more context in 1-2 sentences";
const EXTERNAL_GUIDE = "Add a weblink or URL to an external page with more information";
const DURATION_GUIDE = "Specify how long should your request should be active for"

function Tab({ name, selected }) {
    const className = `select-tab ${selected ? "--selected" : ""}`;
    return (
        <div className={className}>
            <h5>{name}</h5>
        </div>
    );
}

export default function Index() {
    const [state, setState] = useState(INITIAL_STATE);
    const [openOverlay, setOpenOverlay] = useState(false);

    const updateState = (name, value) => {
        setState((state) => ({
            ...state,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { desire, details, url } = state;

        if (!desire) {
            return showErrorToast("Please supply what you are looking for.");
        }
        if (!details) {
            return showErrorToast(
                "Please supply more details to better explain your request."
            );
        }
    };

    const buttonIsDisabled = !(state.desire && state.details );

    const formatState = () => ({
        title: state.desire,
        details: state.details,
        durationInWeeks: state.duration,
        url: formatURL(state.url),
    });

    const formatURL = (url) => {
        if(!url) return ""
        if(url.startsWith("http://") || url.startsWith("https://") ){
            return url
        }
        return `http://${url}`
    }

    const gotoSecondState = () => {
        const { desire, details, url, duration } = state;
        setOpenOverlay(true);
    };

    return (
        <div id="post-page">
            <div className="textarea-group">
                <h4 className="label">
                    I’m looking for…
                    <i data-tip={TITLE_GUIDE} class="fas fa-info-circle fonticon"></i>
                </h4>
                <textarea
                    name="desire"
                    id=""
                    rows="1"
                    maxLength="50"
                    onChange={(e) => updateState(e.target.name, e.target.value)}
                    value={state.desire}
                ></textarea>
            </div>

            <div className="textarea-group">
                <h4 className="label" htmlFor="details">
                    Tell us more
                    <i data-tip={MORE_GUIDE} class="fas fa-info-circle fonticon"></i>
                </h4>
                <textarea
                    name="details"
                    id=""
                    cols="30"
                    rows="10"
                    onChange={(e) => updateState(e.target.name, e.target.value)}
                    value={state.details}
                ></textarea>
            </div>

            <div className="textarea-group">
                <h4 className="label" htmlFor="url">
                    External page (optional)
                    <i data-tip={EXTERNAL_GUIDE} class="fas fa-info-circle fonticon"></i>
                </h4>
                <textarea
                    name="url"
                    id=""
                    cols="30"
                    rows="10"
                    maxLength="100"
                    onChange={(e) => updateState(e.target.name, e.target.value)}
                    value={state.url}
                ></textarea>
            </div>

            <div className="select-group">
                <h4>
                    Duration
                    <i data-tip={DURATION_GUIDE} class="fas fa-info-circle fonticon"></i>
                </h4>
                <div className="select-group__tabs">
                    {TAB_NAMES.map((oneName) => (
                        <div onClick={() => updateState("duration", oneName)}>
                            <Tab
                                selected={state.duration === oneName}
                                name={`${oneName} ${
                                    oneName == 1 ? "Week" : " Weeks"
                                }`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div onClick={validateForm} className="submit-button">
                <Button
                    text={CTA_TEXT}
                    onClick={gotoSecondState}
                    disabled={buttonIsDisabled}
                />
            </div>
            <Overlay
                open={openOverlay}
                toggleOpen={() => openOverlay && setOpenOverlay(false)}
                component={() => <Kyc postState={formatState()} />}
            />
        </div>
    );
}
