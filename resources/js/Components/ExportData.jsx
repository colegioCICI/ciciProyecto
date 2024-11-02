import React, { useState, useCallback } from "react";
import { usePage } from "@inertiajs/react";
import { jsPDF } from "jspdf";
import { stringify } from "csv-stringify/browser/esm";
import Dropdown from "@/Components/Dropdown";
import { ExportButton } from "@/Components/CustomButtons";

const ExportData = ({ data, searchColumns, headers, fileName }) => {
    const [isExporting, setIsExporting] = useState(false);
    const { logoCICI, auth } = usePage().props;
    const user = auth.user.name;

    const filterData = useCallback(
        (item) => {
            return searchColumns.reduce((filteredItem, column) => {
                if (column === "roles" && Array.isArray(item[column])) {
                    filteredItem[column] = item[column]
                        .map((role) => role.role_name)
                        .join(", ");
                } else {
                    filteredItem[column] = item[column];
                }
                return filteredItem;
            }, {});
        },
        [searchColumns],
    );

    const exportCSV = useCallback(() => {
        setIsExporting(true);
        try {
            const filteredData = data.map(filterData);

            stringify(
                filteredData,
                {
                    header: true,
                    columns: searchColumns.map((column) => ({
                        key: column,
                        header: headers[searchColumns.indexOf(column)],
                    })),
                },
                (err, output) => {
                    if (err) throw err;

                    const BOM = "\uFEFF";
                    const csvContent = BOM + output;

                    const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                    });

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `${fileName}.csv`);
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
            );
        } catch (error) {
            console.error("Error al exportar CSV:", error);
        } finally {
            setIsExporting(false);
        }
    }, [data, searchColumns, headers, fileName]);

    const exportPDF = useCallback(() => {
        setIsExporting(true);
        try {
            const doc = new jsPDF({
                orientation: 'landscape', //Orientación Horizontal
            });

            const subtitle = `${fileName} - ${new Date().toLocaleDateString()}`;
            const reportBy = `Reporte realizado por: ${user}`;

            if (logoCICI) {
                doc.addImage(logoCICI, "PNG", 250, 5, 30, 30, "CICI Logo");
            }

            let currentY = 35;

            doc.setFontSize(16);
            doc.text(subtitle, 10, currentY);
            currentY += 10;

            doc.setFontSize(12);
            doc.text(reportBy, 10, currentY);
            currentY += 15;

            const filteredData = data.map(filterData);

            const styles = {
                header: {
                    fillColor: [0, 148, 50], // Azul intenso
                    textColor: [255, 255, 255], // Blanco
                    fontSize: 10,
                    fontStyle: "bold",
                },
                row: {
                    fillColor: [255, 255, 255], // Blanco
                    textColor: [52, 73, 94], // Gris oscuro
                    fontSize: 8,
                },
                altRow: {
                    fillColor: [236, 240, 241], // Gris muy claro
                    textColor: [52, 73, 94], // Gris oscuro
                    fontSize: 8,
                },
            };

            const startX = 10;
            let startY = currentY;
            const colWidth = 280 / searchColumns.length;

            const getRowHeight = (row, fontSize) => {
                return Math.max(
                    10,
                    ...searchColumns.map((column) => {
                        const cellText = row[column]
                            ? row[column].toString()
                            : "";
                        const lines = doc.splitTextToSize(
                            cellText,
                            colWidth - 4,
                        );
                        return lines.length * (fontSize / 2) + 5;
                    }),
                );
            };

            const renderRow = (
                row,
                rowStyles,
                y,
                rowHeight,
                isHeader = false,
            ) => {
                searchColumns.forEach((column, colIndex) => {
                    doc.setFillColor(...rowStyles.fillColor);
                    doc.setTextColor(...rowStyles.textColor);
                    doc.setFontSize(rowStyles.fontSize);
                    if (isHeader) {
                        doc.setFont("helvetica", "bold");
                    } else {
                        doc.setFont("helvetica", "normal");
                    }
                    doc.rect(
                        startX + colIndex * colWidth,
                        y,
                        colWidth,
                        rowHeight,
                        "F",
                    );

                    const cellText = row[column] ? row[column].toString() : "";
                    const lines = doc.splitTextToSize(cellText, colWidth - 4);

                    // Calcular la posición Y para centrar verticalmente
                    const textHeight =
                        lines.length * (rowStyles.fontSize / 2) + 3;
                    const textY =
                        y +
                        (rowHeight - textHeight) / 2 +
                        rowStyles.fontSize / 2;

                    doc.text(lines, startX + colIndex * colWidth + 2, textY);
                });
            };

            // Render headers
            const headerRow = headers.reduce((obj, header, index) => {
                obj[searchColumns[index]] = header;
                return obj;
            }, {});
            const headerHeight = getRowHeight(
                headerRow,
                styles.header.fontSize,
            );

            renderRow(headerRow, styles.header, startY, headerHeight, true);

            startY += headerHeight;

            // Render data rows
            filteredData.forEach((row, rowIndex) => {
                const rowStyles =
                    rowIndex % 2 === 0 ? styles.row : styles.altRow;
                const rowHeight = getRowHeight(row, rowStyles.fontSize);

                renderRow(row, rowStyles, startY, rowHeight);

                startY += rowHeight;

                if (startY > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    startY = 20;
                }
            });

            doc.save(`${fileName}.pdf`);
        } catch (error) {
            console.error("Error al exportar PDF:", error);
        } finally {
            setIsExporting(false);
        }
    }, [data, searchColumns, headers, fileName, logoCICI, user]);

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <ExportButton disabled={data.length === 0 || isExporting} />
            </Dropdown.Trigger>
            <Dropdown.Content width="36">
                <Dropdown.Link onClick={exportCSV} disabled={isExporting}>
                    CSV
                </Dropdown.Link>
                <Dropdown.Link onClick={exportPDF} disabled={isExporting}>
                    PDF
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
};

export default ExportData;
