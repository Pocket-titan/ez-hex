import React from "react";
import "./style.css";

// Adapted from: https://codepen.io/rayfranco/pen/Llvbt

const Button = () => {
  return (
    <div className="button">
      <div className="hex">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="hex">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Button;
