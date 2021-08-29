import { useHistory } from "react-router-dom";
import Megaphone from "@/assets/svgs/landingicon.svg";
import Button from "@/components/button";
import { QuestionOne, QuestionTwo } from "./components/questions";
import "./styles.scss";

const CTA_TEXT = "Get Started";

export default function Index() {
    const history = useHistory();
    /**
     * The CTA to be called when we choose to go to the next page
     */
    const onClickButton = () => {
        history.push('/post');
    };

    return (
        <div id="landing-page">
            <section className="header">
                <img src={Megaphone} alt="" />
                <h4>
                    Sometimes you need a personal touch
                </h4>
            </section>

            <section className="questions">
                <div>
                    <QuestionOne />
                </div>
                <div>
                    <QuestionTwo />
                </div>
            </section>

            <section className="cta">
                <h5>
                    AskRefer empowers your network to search for the right person.
                </h5>
                <Button text={CTA_TEXT} onClick={onClickButton}/>
            </section>
        </div>
    );
}