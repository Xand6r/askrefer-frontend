import "./style.scss";
export default function index({ text, onClick }) {
    return (
        <div onClick={onClick} id="action-button">
            <h4>{text}</h4>
        </div>
    );
}
