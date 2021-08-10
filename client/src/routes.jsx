import {  Switch, Route } from "react-router-dom";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={() => <h1>hello</h1>} />
        </Switch>
    );
}
