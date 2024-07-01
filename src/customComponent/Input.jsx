import React, { useState, useEffect, useRef } from "react";
import "./CustomTextInput.css";
import Tooltip from "./Tooltip";

const Input = ({
  label,
  maxLength,
  width,
  value,
  onChange,
  showAddButton,
  role,
  textField,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [counter, setCounter] = useState(1);
  const inputRef = useRef(null); // Reference to the input/textarea element

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    if (newValue.length <= maxLength) {
      setInputValue(newValue);
      onChange && onChange(e);
      if (newValue === "") {
        setCounter(1);
      }
    } else {
      setInputValue(newValue.slice(0, maxLength));
    }
  };

  const getMaxVariables = () => {
    switch (role) {
      case "header":
        return 1;
      case "subtitle":
        return 2;
      case "body":
      default:
        return Infinity;
    }
  };

  const handleAddClick = () => {
    const newVariable = ` {{${counter}}} `;
    const currentVariables = (inputValue.match(/{{\d+}}/g) || []).length;
    const maxVariables = getMaxVariables();

    if (
      currentVariables < maxVariables &&
      inputValue.length + newVariable.length <= maxLength
    ) {
      const startPos = inputRef.current.selectionStart;
      const endPos = inputRef.current.selectionEnd;

      setInputValue((prev) => {
        const start = prev.substring(0, startPos);
        const end = prev.substring(endPos, prev.length);
        return `${start}${newVariable}${end}`;
      });

      setCounter((prev) => prev + 1);
    } else if (currentVariables >= maxVariables) {
      alert(
        `You can only add up to ${maxVariables} variable(s) for this role.`
      );
    } else {
      alert("Exceeding the maximum allowed character limit");
    }
  };

  const isExceedLimit = inputValue.length >= maxLength;

  return (
    <div className="material-textfield" style={{ width: width || "100%" }}>
      {textField ? (
        <textarea
          ref={inputRef}
          className={`custom-input ${
            isExceedLimit ? "exceed-limit" : ""
          } text-field`}
          placeholder=" "
          maxLength={maxLength}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <input
          ref={inputRef}
          className={`custom-input ${isExceedLimit ? "exceed-limit" : ""}`}
          placeholder=" "
          type="text"
          maxLength={maxLength}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
      <label
        className={`custom-label ${isFocused || inputValue ? "active" : ""}`}
      >
        {label}
      </label>
      {(isFocused || inputValue) && (
        <div className={`char-limit ${isExceedLimit ? "exceed-limit" : ""}`}>
          {`${inputValue.length}/${maxLength}`}
        </div>
      )}
      {showAddButton && (
        <div
          className="add-button"
          onClick={handleAddClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && <Tooltip text="Add Item" />}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 512 512"
          >
            <line
              x1="256"
              y1="112"
              x2="256"
              y2="400"
              style={{
                fill: "none",
                stroke: "#000000",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "32px",
              }}
            />
            <line
              x1="400"
              y1="256"
              x2="112"
              y2="256"
              style={{
                fill: "none",
                stroke: "#000000",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "32px",
              }}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Input;
