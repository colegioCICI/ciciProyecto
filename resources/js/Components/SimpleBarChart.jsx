import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";

const SimpleBarChart = ({ data }) => {
    const [monthsToShow, setMonthsToShow] = useState(6);

    useEffect(() => {
        const today = new Date();

        // Crear una lista de los últimos X meses (considerando también el año)
        const lastMonths = Array.from({ length: monthsToShow }, (_, i) => {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const month = date.toLocaleString("default", { month: "short" });
            const year = date.getFullYear();
            return `${month} ${year}`;
        }).reverse();

        // Filtrar los folders y agrupar por estado de carpeta
        const folderStatesByMonth = lastMonths.map((monthYear) => {
            const [monthName, year] = monthYear.split(" ");

            const observation = data.filter((folder) => {
                const folderDate = new Date(folder.fecha_ingreso);
                const folderMonth = folderDate.toLocaleString("default", {
                    month: "short",
                });
                const folderYear = folderDate.getFullYear();

                return (
                    folder.estado_carpeta === "Observación" &&
                    folderMonth === monthName &&
                    folderYear === parseInt(year)
                );
            }).length;

            const revision = data.filter((folder) => {
                const folderDate = new Date(folder.fecha_ingreso);
                const folderMonth = folderDate.toLocaleString("default", {
                    month: "short",
                });
                const folderYear = folderDate.getFullYear();

                return (
                    folder.estado_carpeta === "Revisión" &&
                    folderMonth === monthName &&
                    folderYear === parseInt(year)
                );
            }).length;

            const aprobado = data.filter((folder) => {
                const folderDate = new Date(folder.fecha_ingreso);
                const folderMonth = folderDate.toLocaleString("default", {
                    month: "short",
                });
                const folderYear = folderDate.getFullYear();

                return (
                    folder.estado_carpeta === "Aprobado" &&
                    folderMonth === monthName &&
                    folderYear === parseInt(year)
                );
            }).length;

            return { monthYear, observation, revision, aprobado };
        });

        const chartData = {
            series: [
                {
                    name: "Observación",
                    data: folderStatesByMonth.map((item) => item.observation),
                    color: "#F05252", // Rojo para Observación
                },
                {
                    name: "Revisión",
                    data: folderStatesByMonth.map((item) => item.revision),
                    color: "#FBBF24", // Amarillo para Revisión
                },
                {
                    name: "Aprobado",
                    data: folderStatesByMonth.map((item) => item.aprobado),
                    color: "#31C48D", // Verde para Aprobado
                },
            ],
            chart: {
                type: "bar",
                height: 400,
            },
            xaxis: {
                categories: lastMonths,
                labels: {
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass:
                            "text-xs font-normal fill-gray-500 dark:fill-gray-400",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass:
                            "text-xs font-normal fill-gray-500 dark:fill-gray-400",
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "50%",
                    borderRadius: 6,
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                formatter: function (value) {
                    return value;
                },
            },
            grid: {
                strokeDashArray: 4,
            },
        };

        const chart = new ApexCharts(
            document.querySelector("#bar-chart"),
            chartData,
        );
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [data, monthsToShow]);

    const handleMonthsChange = (e) => {
        setMonthsToShow(Number(e.target.value));
    };

    return (
        <div>
            <div className="mb-6">
                <label
                    htmlFor="months"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Selecciona los últimos meses a mostrar:
                </label>
                <select
                    id="months"
                    value={monthsToShow}
                    onChange={handleMonthsChange}
                    className="block w-1/5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {[...Array(12).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1} meses
                        </option>
                    ))}
                </select>
            </div>

            <div id="bar-chart"></div>
        </div>
    );
};

export default SimpleBarChart;
