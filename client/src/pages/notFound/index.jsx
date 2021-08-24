import { useHistory } from "react-router";

import notFoundImage from "@/assets/svgs/pagenotfound.svg";
import "./style.scss";

export default function Index() {
    const history = useHistory();

    const goHome = () => {
        history.push("/");
    };
    return (
        <div className="notFound">
            <img src={notFoundImage} alt="" />
            <h1>Page not found. <span onClick={goHome}>Go home</span></h1>
        </div>
    );
}
