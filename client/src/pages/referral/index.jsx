import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Overlay from "@/components/overlay";
import PostCard from "@/components/postcard";
import interviewImage from "@/assets/svgs/interview.svg";
import Button from "@/components/button";

import Match from "./components/match";
import "./styles.scss";

const CTA_TEXT = "post an ask";
export default function Index() {

    useEffect(() => {
        console.log("load the content of the useeffect");
    }, []);

    const [yes, setYes] = useState(false)

    const history = useHistory();
    const gotoCreatePost = () => {
        history.push("/post");
    };

    const onSubmitYes = () => {}

    return (
        <div id="referral-page">
            <PostCard />
            <img src={interviewImage} alt="poster" className="poster-image" />
            <div className="post-ask">
                <Button text={CTA_TEXT} onClick={gotoCreatePost} />
            </div>
            <Overlay
                open={yes}
                toggleOpen={() => yes && setYes(false)}
                component={() => <Match onSubmit={onSubmit} />}
            />
        </div>
    );
}
