import { Switch, Route } from "react-router-dom";

// import components
import NavBar from '@/components/navbar';
// import pages
import LandingPage from '@/pages/landingPage';


export default function Routes() {
    return (
        <>
            <NavBar />
            <Switch>
                <Route exact path="/" component={LandingPage} />
            </Switch>
        </>
    );
}
