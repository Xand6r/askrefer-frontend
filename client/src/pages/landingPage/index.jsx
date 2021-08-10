import Megaphone from "@/assets/svgs/megaphone.svg";
import Button from "@/components/button";
import { QuestionOne, QuestionTwo } from "./components/questions";
import "./styles.scss";

const CTA_TEXT = "Get Started";

export default function index() {
    /**
     * The CTA to be called when we choose to go to the next page
     */
    const onClickButton = () => {
        console.log('going to next page');
    };

    return (
        <div id="landing-page">
            <section className="header">
                <img src={Megaphone} alt="" />
                <h4>
                    Sometimes you can’t Google your way to <br />
                    the Perfect fit.
                </h4>
            </section>

            <section className="questions">
                <QuestionOne />
                <QuestionTwo />
            </section>

            <section className="cta">
                <h5>
                    AskRefer helps your friends find the answer for you.
                </h5>
                <Button text={CTA_TEXT} onClick={onClickButton}/>
            </section>
        </div>
    );
}
