import React, { useState, useCallback } from "react";
import { usePage } from "@inertiajs/react";
import { jsPDF } from "jspdf";
import Dropdown from "@/Components/Dropdown";
import { ExportButton } from "@/Components/CustomButtons";

const ExportData = ({
    data,
    searchColumns,
    headers,
    fileName,
    columnWidths = {
        "FECHA": 20,
        "Tramite N°": 40,
        "NOMBRE DEL PROPIETARIO": 80,
        "DIRECCIÓN DEL INMUEBLE": 100,
        "COMP. PAGO N°": 40,
        "APROB.": 20,
        "50%CICI": 25,
        "MICRO": 20,
        "TOTAL": 30,
        "Espe.": 20,
        "For": 20,
        "Valor cobrado": 40,
        "TIPO": 30,
    },
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const { auth } = usePage().props;
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

    const getReportDate = useCallback(() => {
        if (data.length > 0 && data[0].fecha_factura) {
            const date = new Date(data[0].fecha_factura);
            const monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
            return `MES: ${monthNames[date.getMonth()]} DEL ${date.getFullYear()}`;
        }
        return "FECHA NO DISPONIBLE";
    }, [data]);

    const exportCSV = useCallback(() => {
        // Código para exportar CSV
    }, [data, searchColumns, headers, fileName]);

    const exportPDF = useCallback(() => {
        setIsExporting(true);
        try {
            const doc = new jsPDF({
                orientation: "landscape",
            });

            const subtitle = `NOMINA DE PLANOS ESTRUCTURALES APROBADOS POR EL \n     COLEGIO DE INGENIEROS CIVILES DE IMBABURA`;
            const reportBy = getReportDate();
            const rightHeader = `COLEGIO DE INGENIEROS CIVILES DE IMBABURA`;
            let currentY = 30;

            // Texto en la esquina superior izquierda
            doc.setFontSize(12);
            doc.text(subtitle, 35, 30);

            // Texto en la esquina superior derecha
            doc.setFontSize(10);
            doc.text(rightHeader, doc.internal.pageSize.width - 10, 20, {
                align: "right",
            });

            // Texto de "MES: MAYO DEL 2024" debajo del título
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(reportBy, 25, 45);

            doc.setFont("helvetica", "normal");

            currentY += 25;

            const filteredData = data.map(filterData);

            const styles = {
                header: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontSize: 10,
                    fontStyle: "bold",
                    align: "center",
                },
                row: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    align: "center",
                },
                altRow: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    align: "center",
                },
            };

            const startX = 3;
            let startY = currentY;

            const getColumnWidth = (column) => {
                return columnWidths[column] || 21; // Establecer ancho por defecto si no se define
            };

            const getRowHeight = (row, fontSize) => {
                return Math.max(
                    10,
                    ...searchColumns.map((column) => {
                        const cellText = row[column]
                            ? row[column].toString()
                            : "";
                        const lines = doc.splitTextToSize(
                            cellText,
                            getColumnWidth(column) - 4,
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
                rowIndex = null,
            ) => {
                doc.setTextColor(...rowStyles.textColor);
                doc.setFontSize(rowStyles.fontSize);
                doc.setFont(
                    isHeader ? "helvetica" : "normal",
                    isHeader ? "bold" : "normal",
                );

                const cellNumber = isHeader ? "N°" : (rowIndex + 1).toString();
                const numberWidth = 10; // Ancho para la columna de numeración
                doc.rect(startX, y, numberWidth, rowHeight, "S");
                doc.text(
                    cellNumber,
                    startX + numberWidth / 2,
                    y + rowHeight / 2,
                    { align: "center" },
                );

                doc.setFont("helvetica");

                searchColumns.forEach((column, colIndex) => {
                    const colWidth = getColumnWidth(column);
                    const cellText = row[column] ? row[column].toString() : "";

                    doc.rect(
                        startX +
                            numberWidth +
                            searchColumns
                                .slice(0, colIndex)
                                .reduce(
                                    (acc, col) => acc + getColumnWidth(col),
                                    0,
                                ),
                        y,
                        colWidth,
                        rowHeight,
                        "S",
                    );

                    const lines = doc.splitTextToSize(cellText, colWidth - 4);
                    const textHeight =
                        lines.length * (rowStyles.fontSize / 2) + 3;
                    const textY =
                        y +
                        (rowHeight - textHeight) / 2 +
                        rowStyles.fontSize / 2;

                    doc.text(
                        lines,
                        startX +
                            numberWidth +
                            searchColumns
                                .slice(0, colIndex)
                                .reduce(
                                    (acc, col) => acc + getColumnWidth(col),
                                    0,
                                ) +
                            colWidth / 2,
                        textY,
                        {
                            align: "center",
                        },
                    );
                });
            };

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

            filteredData.forEach((row, rowIndex) => {
                const rowStyles =
                    rowIndex % 2 === 0 ? styles.row : styles.altRow;
                const rowHeight = getRowHeight(row, rowStyles.fontSize);

                renderRow(row, rowStyles, startY, rowHeight, false, rowIndex);

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
    }, [data, searchColumns, headers, fileName, user, columnWidths]);

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
