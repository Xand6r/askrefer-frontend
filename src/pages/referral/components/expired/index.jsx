import { useHistory } from "react-router";

import brokenLink from "@/assets/svgs/brokenlink.svg";
import "./style.scss";

export default function Index() {
    const history = useHistory();

    const goHome = () => {
        history.push("/");
    };

    return (
        <div className="expired">
            <img src={brokenLink} alt="" />
            <h1>
                This post has expired. <span onClick={goHome}>Go home</span>
            </h1>
        </div>
    );
}
