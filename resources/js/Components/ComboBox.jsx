import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import FloatInputText from "./FloatInputText";

const Combobox = ({
    options,
    label,
    value,
    onChange,
    inputError,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [tempValue, setTempValue] = useState(value);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const optionsRefs = useRef([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setTempValue(value);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [value]);

    useEffect(() => {
        if (isOpen) {
            if (tempValue) {
                const index = options.findIndex(
                    (option) => option.value === tempValue,
                );
                setFocusedIndex(index !== -1 ? index : 0);
            } else {
                setFocusedIndex(0);
            }
        } else {
            setFocusedIndex(-1);
        }
    }, [isOpen, tempValue, options]);

    useEffect(() => {
        if (focusedIndex >= 0 && optionsRefs.current[focusedIndex]) {
            optionsRefs.current[focusedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [focusedIndex]);

    const handleOptionSelect = (option) => {
        setTempValue(option.value);
        setIsOpen(false);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev < options.length - 1 ? prev + 1 : prev,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case "Enter":
                if (focusedIndex >= 0) {
                    handleOptionSelect(options[focusedIndex]);
                    onChange(options[focusedIndex].value);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setTempValue(value);
                inputRef.current.blur();
                break;
            default:
                break;
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen && !tempValue) {
            setTempValue(options[0].value);
        }
    };

    return (
        <div ref={wrapperRef} className={`${className}`}>
            <div className="relative">
                <FloatInputText
                    ref={inputRef}
                    label={label || "Select an option"}
                    type="text"
                    id="list-input"
                    value={
                        options.find((option) => option.value === tempValue)
                            ?.label || ""
                    }
                    readOnly
                    onClick={toggleOpen}
                    onKeyDown={handleKeyDown}
                    inputError={inputError}
                    className="w-full px-4 py-2 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaChevronDown
                        className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </div>
            </div>
            {isOpen && (
                <div className="absolute left-0 right-0 z-20 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                ref={(el) => (optionsRefs.current[index] = el)}
                                onClick={() => {
                                    handleOptionSelect(option);
                                    onChange(option.value);
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer ${
                                    focusedIndex === index
                                        ? "bg-green-100 dark:bg-green-600 text-green-800 dark:text-white"
                                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                                } hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};

export default Combobox;
