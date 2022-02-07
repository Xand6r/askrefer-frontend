import React from "react";
import './loader.scss';


const CircularProgressSpinner = () => {
    return (
        <div className="askrefer-circular-loader-blue">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default CircularProgressSpinner;
