import { useEffect, useState } from 'react';

export function DarkTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "dark";
        }
        return "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.querySelector("html").classList.add('dark');
        } else {
            document.querySelector("html").classList.remove('dark');
        }
    }, [theme]);

    const handleChangeTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <button 
                className="bg-slate-200 px-4 py-2 rounded hover:bg-slate-300 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                onClick={handleChangeTheme}
            >
                Theme
            </button>
        </div>
    );
}