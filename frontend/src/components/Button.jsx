import React from "react";

const Button = ({ type = "submit", className = "", children, ...rest }) => {
  const loading = false

  return (
    <div>
      <button type={type} className={`btn ${className}`} {...rest}>
        {loading ? "Loading" : children}
      </button>
    </div>
  );
};

export default Button;
