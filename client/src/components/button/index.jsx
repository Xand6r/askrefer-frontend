import "./style.scss";
export default function index({ text, onClick, disabled }) {
    const activateButton = () => {
        if (disabled) return;
        return onClick();
    };
    const className = `${disabled ? "--disabled" : ""}`;
    return (
        <div
            onClick={activateButton}
            id="action-button"
            className={className}
        >
            <h4>{text}</h4>
        </div>
    );
}
