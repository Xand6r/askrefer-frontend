import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ReactTooltip from 'react-tooltip';

// import components
import NavBar from "@/components/navbar";
// import pages
import LandingPage from "@/pages/landing";
import PostPage from "@/pages/post";
import ReferralPage from "@/pages/referral";

import "@/styles/global.scss";
import "react-toastify/dist/ReactToastify.min.css";

export default function Routes() {
    return (
        <>
            <NavBar />
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/post" component={PostPage} />
                <Route path="/referral/:id" component={ReferralPage} />
            </Switch>
            <ToastContainer />
            <ReactTooltip className="tooltip"/>
        </>
    );
}
