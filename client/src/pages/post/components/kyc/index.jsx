import Button from "@/components/button";
import "@/styles/input.scss";

const CTA_TEXT = "Complete";
export default function index({ onSubmit }) {
    return (
        <div id="kyc-form" className="slider-form">
            <div className="header-group">
                <h1 className="slider-form__header">About you</h1>

                <h6 className="slider-form__subheader">
                    This allows AskRefer to send you update on who is interested
                    in your ask.{" "}
                    <span>This would not be shared with the Viewers</span>
                </h6>
            </div>

            <form action="javascript:void(0)">
                <div className="input__group">
                    <label htmlFor="">Full name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="This is the name viewed will see next to the ask."
                    />
                </div>
                <div className="input__group">
                    <label htmlFor="">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="This is the email you will be contacted with."
                    />
                </div>
                <div className="input__group">
                    <label htmlFor="">Linkedin Url</label>
                    <input
                        type="text"
                        name="linkedin"
                        placeholder="We use this to verify your identity."
                    />
                </div>
                <Button text={CTA_TEXT} onClick={onSubmit} />
            </form>
        </div>
    );
}
