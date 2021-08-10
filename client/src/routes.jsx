import { Switch, Route } from "react-router-dom";
import NavBar from '@/components/navbar';

export default function Routes() {
    return (
        <>
            <NavBar />
            <Switch>
                <Route exact path="/" component={() => <h1>hello</h1>} />
            </Switch>
        </>
    );
}
