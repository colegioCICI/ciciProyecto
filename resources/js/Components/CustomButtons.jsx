import { FaPlusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";
import { MdModeEdit } from "react-icons/md";
import { TbFilterCog } from "react-icons/tb";

const AddButton = ({ className = "", disabled, ...props }) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center w-32 gap-2 px-4 py-2 bg-green-500 dark:bg-green-300 border border-transparent rounded-md font-semibold text-md text-white dark:text-gray-800 tracking-widest hover:bg-green-600 dark:hover:bg-green-400 focus:bg-green-600 dark:focus:bg-green-400 active:bg-green-700 dark:active:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 dark:focus:ring-offset-green-500 transition ease-in-out duration-150 ${
                    disabled && "opacity-60"
                } ` + className
            }
            disabled={disabled}
        >
            <FaPlusCircle /> Nuevo
        </button>
    );
};

const DeleteButton = ({ className = "", disabled, ...props }) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center w-32 gap-2 px-4 py-2 bg-red-500 dark:bg-red-300 border border-transparent rounded-md font-semibold text-md text-white dark:text-gray-800 tracking-widest hover:bg-red-600 dark:hover:bg-red-400 focus:bg-red-600 dark:focus:bg-red-400 active:bg-red-700 dark:active:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-red-500 transition ease-in-out duration-150 ${
                    disabled && "opacity-60"
                } ` + className
            }
            disabled={disabled}
        >
            <MdDelete /> Borrar
        </button>
    );
};

const FilterButton = ({ className = "", disabled, ...props }) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center w-32 gap-2 px-4 py-2 bg-green-500 dark:bg-green-300 border border-transparent rounded-md font-semibold text-md text-white dark:text-gray-800 tracking-widest hover:bg-green-600 dark:hover:bg-green-400 focus:bg-green-600 dark:focus:bg-green-400 active:bg-green-700 dark:active:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 dark:focus:ring-offset-green-500 transition ease-in-out duration-150 ${
                    disabled && "opacity-60"
                } ` + className
            }
            disabled={disabled}
        >
            <TbFilterCog /> Filtrar
        </button>
    );
};

const ExportButton = ({ className = "", disabled, isLoading, ...props }) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center w-36 gap-2 rounded-md py-2 bg-green-500 dark:bg-green-400 border border-transparent font-semibold text-md text-white dark:text-gray-800 tracking-widest hover:bg-green-600 dark:hover:bg-green-400 focus:bg-green-600 dark:focus:bg-green-400 active:bg-green-700 dark:active:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 dark:focus:ring-offset-green-500 transition ease-in-out duration-150 ${
                    disabled && "opacity-60"
                } ` + className
            }
            disabled={disabled}
        >
            <PiExportBold /> {isLoading ? "Exportando" : "Exportar"}
        </button>
    );
};

const EditCircleButton = ({ className = "", disabled, ...props }) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center size-10 bg-violet-400 dark:bg-violet-300 border border-transparent rounded-full font-semibold text-md text-white dark:text-gray-800 tracking-widest hover:bg-violet-500 dark:hover:bg-violet-400 focus:bg-violet-500 dark:focus:bg-violet-400 active:bg-violet-600 dark:active:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-violet-500 transition ease-in-out duration-150 ${
                    disabled && "opacity-60"
                } ` + className
            }
            disabled={disabled}
        >
            <MdModeEdit />
        </button>
    );
};

const DeleteCircleButton = ({ className = "", disabled, ...props }) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center size-10 bg-red-400 dark:bg-red-300 border border-transparent rounded-full font-semibold text-md text-white dark:text-gray-800 tracking-widest hover:bg-red-500 dark:hover:bg-red-400 focus:bg-red-500 dark:focus:bg-red-400 active:bg-red-600 dark:active:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-500 transition ease-in-out duration-150 ${
                    disabled && "opacity-60"
                } ` + className
            }
            disabled={disabled}
        >
            <MdDelete />
        </button>
    );
};

export {
    AddButton,
    FilterButton,
    DeleteButton,
    ExportButton,
    EditCircleButton,
    DeleteCircleButton,
};
