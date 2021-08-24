import { useState } from "react";

import Overlay from "@/components/overlay";
import Button from "@/components/button";
import { isUrlValid, showErrorToast, showSuccessToast } from "@/utilities";

import Kyc from "./components/kyc";
import "./styles.scss";

const INITIAL_STATE = {
    desire: "",
    details: "",
    url: "",
    duration: 1,
};

const TAB_NAMES = [1, 2, 3, 4];

const CTA_TEXT = "Create Askrefer Url";

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
        if (url && !isUrlValid(url)) {
            return showErrorToast(
                "Please enter a valid url of the form http://domainname.domain"
            );
        }
    };

    const buttonIsDisabled = !(state.desire && state.details && state.url && !isUrlValid(state.url));

    const formatState = () => ({
        title: state.desire,
        details: state.details,
        durationInWeeks: state.duration,
        url: state.url,
    });

    const gotoSecondState = () => {
        const { desire, details, url, duration } = state;
        setOpenOverlay(true);
    };

    return (
        <div id="post-page">
            <div className="textarea-group">
                <h4 className="label">I am Looking for ...</h4>
                <textarea
                    name="desire"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="A new board member"
                    onChange={(e) => updateState(e.target.name, e.target.value)}
                    value={state.desire}
                ></textarea>
            </div>

            <div className="textarea-group">
                <h4 className="label" htmlFor="details">
                    More Details
                </h4>
                <textarea
                    name="details"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Enter more details"
                    onChange={(e) => updateState(e.target.name, e.target.value)}
                    value={state.details}
                ></textarea>
            </div>

            <div className="textarea-group">
                <h4 className="label" htmlFor="url">
                    Url for external info (If available)
                </h4>
                <textarea
                    name="url"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Enter Url"
                    onChange={(e) => updateState(e.target.name, e.target.value)}
                    value={state.url}
                ></textarea>
            </div>

            <div className="select-group">
                <h4>Duration</h4>
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
