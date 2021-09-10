import { useHistory } from "react-router";
import NavBar from "@/components/navbar";
import { BrowserRouter as Router } from "react-router-dom";

import desktopImage from "@/assets/svgs/desktopWIP.svg";
import "./style.scss";

export default function Index() {

    return (
        <>
        <Router>
            <NavBar /> 
            <div className="desktop">
                <img src={desktopImage} alt="" />
                <h1>We are working on a desktop version for AskRefer. For now please view on a mobile device.</h1>
            </div>
        </Router>
        </>
    );
}
