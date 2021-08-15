import { getAvatarDetails, gotoURL } from "@/utilities";
import { DATE_FORMAT } from "@/utilities/constants";
import moment from "moment";
import { useState } from "react";
import "./styles.scss";

const INITIAL_STATE = {
    fullName: "Shuaibu Alexander",
    text: "I am looking for a front end developer in Australia. Can you help?",
    url: "https://google.com",
    expiryDate: "2021-08-25T09:27:57.139+00:00",
    creationDate: "2021-08-13T09:27:57.139+00:00",
};
export default function Index() {
    const [state, setState] = useState(INITIAL_STATE);
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
                    <h6 className="auxilliary_content__posted">{postedAt} ago</h6>
                    <h6 className="auxilliary_content__expiry">Expires in {expiresIn}</h6>
                </div>
            </div>
            <div className="divider"/>
            <div className="bottom_section">
                <div className="action_button --no">
                    <h5>Nope Sorry</h5>
                </div>
                <div className="action_button --maybe">
                    <h5>I know someone</h5>
                </div>
                <div className="action_button --yes">
                    <h5>I am your guy</h5>
                </div>
            </div>
        </div>
    );
}
