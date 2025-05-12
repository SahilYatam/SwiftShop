import React from "react";

const Input = ({
  type = "text",
  placeholder,
  value,
  className = "",
  ...rest
}) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className={className}
        {...rest}
      />
    </div>
  );
};

export default Input;
