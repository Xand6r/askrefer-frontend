import CircularProgressSpinner from "../loader";
import "./style.scss";

export default function index({ text, onClick, disabled, loading }) {
    const activateButton = () => {
        if (disabled || loading) return;
        return onClick();
    };

    const className = `${disabled ? "--disabled" : ""}`;
    return (
        <div onClick={activateButton} id="action-button" className={className}>
            {loading ? (
                <div className="spinner">
                    <CircularProgressSpinner />
                </div>
            ) : (
                <h4>{text}</h4>
            )}
        </div>
    );
}
