import { getAvatarDetails, gotoURL } from "@/utilities";
import { DATE_FORMAT } from "@/utilities/constants";
import { showSuccessToast } from "@/utilities";
import Overlay from "@/components/overlay";
import Match from "./components/match";
import Refer from "./components/refer";

import moment from "moment";
import { useState } from "react";
import "./styles.scss";
import { useHistory } from "react-router-dom";

const INITIAL_STATE = {
    fullName: "Shuaibu Alexander",
    text: "I am looking for a front end developer in Australia. Can you help?",
    url: "https://google.com",
    expiryDate: "2021-08-25T09:27:57.139+00:00",
    creationDate: "2021-08-13T09:27:57.139+00:00",
};

const TIMEOUT_DURATION = 1500;

export default function Index() {
    const [state, setState] = useState(INITIAL_STATE);
    const [yes, setYes] = useState(false);
    const [maybe, setMaybe] = useState(false);

    const history = useHistory();

    const avatarDetails = getAvatarDetails(state.fullName);

    const onViewMore = () => {
        gotoURL(state.url);
    };
    const today = moment();
    const creationDate = moment(state.creationDate);
    const expiryDate = moment(state.expiryDate);
    const timeDifferenceText = (dayDiff) => {
        const expiresIn =
            dayDiff === 0
                ? "Today"
                : dayDiff === 1
                ? "1 day"
                : `${dayDiff} days`;
        return expiresIn;
    };

    const goHome = () => {
        setTimeout(() => {
            history.push("/");
        }, TIMEOUT_DURATION);
    };

    const onSubmitYes = () => {
        showSuccessToast("We will be in touch. Thank you");
        setYes(false);
        goHome();
    };

    const onSubmitMaybe = () => {
        showSuccessToast("We will be in touch. Thank you");
        setMaybe(false);
        goHome();
    };

    const onSubmitNo = () => {
        showSuccessToast("Maybe next time. Thank you");
        goHome();
    };

    const expiresIn = timeDifferenceText(expiryDate.diff(creationDate, "day"));
    const postedAt = timeDifferenceText(today.diff(creationDate, "day"));

    // moment
    return (
        <div id="post-card">
            <div className="top_section">
                <div className="poster_details">
                    <div
                        style={{ backgroundColor: avatarDetails.color }}
                        className="poster_details__img"
                    >
                        <h4>{avatarDetails.initials}</h4>
                    </div>
                    <h5 className="poster_details__text">{state.fullName}</h5>
                </div>
                <div className="post_content">
                    <h5>
                        {state.text}
                        <span onClick={onViewMore}>view more</span>
                    </h5>
                </div>
                <div className="auxilliary_content">
                    <h6 className="auxilliary_content__posted">
                        {postedAt} ago
                    </h6>
                    <h6 className="auxilliary_content__expiry">
                        Expires in {expiresIn}
                    </h6>
                </div>
            </div>
            <div className="divider" />
            <div className="bottom_section">
                <div onClick={onSubmitNo} className="action_button --no">
                    <h5>Nope Sorry</h5>
                </div>
                <div
                    onClick={() => setMaybe(true)}
                    className="action_button --maybe"
                >
                    <h5>I know someone</h5>
                </div>
                <div
                    onClick={() => setYes(true)}
                    className="action_button --yes"
                >
                    <h5>I am your guy</h5>
                </div>
            </div>
            {/* for yes */}
            <Overlay
                open={yes}
                toggleOpen={() => yes && setYes(false)}
                component={() => <Match onSubmit={onSubmitYes} />}
            />
            {/* for maybe */}
            <Overlay
                open={maybe}
                toggleOpen={() => maybe && setMaybe(false)}
                component={() => <Refer onSubmit={onSubmitMaybe} />}
            />
        </div>
    );
}
