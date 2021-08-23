import { getAvatarDetails, gotoURL, showErrorToast } from "@/utilities";
import { DATE_FORMAT } from "@/utilities/constants";
import { showSuccessToast } from "@/utilities";
import Overlay from "@/components/overlay";
import Match from "./components/match";
import Refer from "./components/refer";

import moment from "moment";
import { useState, useEffect } from "react";
import "./styles.scss";
import { useHistory } from "react-router-dom";
import { getReq } from "@/api";
import CircularProgressSpinner from "../loader";

const INITIAL_STATE = {
    fullName: "",
    title: "",
    text: "",
    url: "",
    expiryDate: "",
    creationDate: "",
    postId: "",
    referralId: "",
};

const TIMEOUT_DURATION = 1500;

export default function Index({ post }) {
    const [state, setState] = useState(INITIAL_STATE);
    const [yes, setYes] = useState(false);
    const [maybe, setMaybe] = useState(false);
    const [loadingLink, setLoadingLink] = useState(false);
    const [refLink, setrefLink] = useState("");

    const history = useHistory();

    useEffect(() => {
        const {
            createdAt,
            details,
            expiryDate,
            title,
            url,
            _id,
            referralId,
            owner: { fullName = "" },
        } = post;
        setState({
            ...state,
            fullName,
            title: title,
            text: details,
            url: url,
            expiryDate: expiryDate,
            creationDate: createdAt,
            referralId,
            postId: _id,
        });
    }, []);

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

    const generateReferral = () => {
        const { referralId } = state;
        if (loadingLink) return;
        // generate a new link then set maybe
        setLoadingLink(true);
        getReq(`/referral/refer/${referralId}`)
            .then(({ data: response }) => {
                const { link } = response;
                setrefLink(link);
                setMaybe(true)
            })
            .catch((err) => {
                showErrorToast("there was an unknown error:", err.message);
            })
            .finally(() => {
                setLoadingLink(false);
            });
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
        if(loadingLink) return;
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
                    <div className="extra_details">
                        <h5 className="poster_details__text">
                            {state.fullName}
                        </h5>
                        <h6>{state.title}</h6>
                    </div>
                </div>
                <div className="post_content">
                    <h5>
                        {state.text}
                        <span onClick={onViewMore}>view more</span>
                    </h5>
                </div>
                <div className="auxilliary_content">
                    <h6 className="auxilliary_content__posted">
                        {postedAt} {postedAt === "Today" ? "" : "ago"}
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
                    onClick={generateReferral}
                    className="action_button --maybe"
                >
                    <h5>I know someone</h5>
                </div>
                <div
                    onClick={() => !loadingLink && setYes(true)}
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
