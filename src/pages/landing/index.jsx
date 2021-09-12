import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import Megaphone from "@/assets/svgs/landingicon.svg";
import Button from "@/components/button";
import { QuestionOne, QuestionTwo, QuestionThree } from "./components/questions";
import "./styles.scss";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
const CTA_TEXT = "Get Started";

export default function Index() {
    const history = useHistory();
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false
      };
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
                <Slider {...settings}>
                    <div>
                        <QuestionOne />
                    </div>
                    <div>
                        <QuestionTwo />
                    </div>
                    <div>
                        <QuestionThree />
                    </div>
                </Slider>
            </section>

            <section className="cta">
                <h5>
                    AskRefer empowers your network to search for the right person
                </h5>
                <Button text={CTA_TEXT} onClick={onClickButton}/>
            </section>
        </div>
    );
}
