import React from "react";
import ReactDOM from "react-dom";

import Layout from '@/components/layout';
import App from "./App";

import * as serviceWorker from "@/workers/serviceWorker";
import { subscribeUser, requestPermission } from "@/workers/subscriptions";
import reportWebVitals from "@/workers/reportWebVitals";

import "@/styles/global.scss";

ReactDOM.render(
    <React.StrictMode>
        <Layout>
            <App />
        </Layout>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// uncomment when setting up real time notifications
// serviceWorker.register();
// requestPermission();
// subscribeUser();
