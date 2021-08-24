import { useHistory } from "react-router";

import desktopImage from "@/assets/svgs/desktopWIP.svg";
import "./style.scss";

export default function Index() {
    const history = useHistory();

    const goHome = () => {
        history.push("/");
    };

    return (
        <div className="desktop">
            <img src={desktopImage} alt="" />
            <h1>We are working on a desktop version. For now please view on a mobile device</h1>
        </div>
    );
}
