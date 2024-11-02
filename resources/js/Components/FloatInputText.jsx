import { forwardRef, useEffect, useRef } from "react";

const FloatInputText = forwardRef(
    (
        {
            label = "InputText",
            type = "text",
            id,
            className = "",
            isFocused = false,
            inputError,
            defaultValue,
            ...props
        },
        ref,
    ) => {
        const input = ref ? ref : useRef();

        useEffect(() => {
            if (isFocused) {
                input.current.focus();
            }
        }, [isFocused]);

        return (
            <div className="relative">
                <input
                    {...props}
                    type={type}
                    id={id}
                    className={`block px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer ${className}`}
                    ref={input}
                    placeholder=" "
                />
                <label
                    htmlFor={id}
                    className="absolute text-sm text-gray-500 rounded-lg dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                    {label}
                </label>
            </div>
        );
    },
);

export default FloatInputText;
