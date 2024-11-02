import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { ToastContainer } from "react-toastify";
import SearchInput from "@/Components/SearchInput";
import ExportData from "@/Components/ExportData";

export default function Table() {
    const { audits, usuariosRoles, logoCICI, success, users } = usePage().props; // Obtener los datos de la página de Inertia
    const theadersexsportar = ["Usuario", "Acción", "Dirección IP", "Valores Antiguos", "Valores Actuales", "Fecha"];
    const columnasexportar = ["user_id", "event_es", "ip_address", "valores_antiguos", "valores_nuevos", "created_at_formatted"];

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    const [filteredAudits, setFilteredAudit] = useState(audits);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAudits.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.max(
        1,
        Math.ceil(filteredAudits.length / itemsPerPage),
    );

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const [selectedRows, setSelectedRows] = useState({});
    const handleCheckboxChange = (audit) => {
        setSelectedRows((prev) => {
            // Copiamos el estado previo
            const updatedRows = { ...prev };

            // Si el documento ya está seleccionado, lo quitamos
            if (updatedRows[audit.id]) {
                delete updatedRows[audit.id];
            } else {
                // Si no está seleccionado, lo agregamos usando su folder_id como clave
                updatedRows[audit.id] = audit;
            }

            return updatedRows;
        });
    };

    const areAllSelected =
        currentItems.length > 0 &&
        currentItems.every((item) => selectedRows[item.id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};
        console.log(...audits);
        
        if (!areAllSelected) {
            currentItems.forEach((item) => {
                newSelectedRows[item.id] = item;
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const selectedAudits = Object.values(selectedRows);

    const formatValues = (values) => {
        if (typeof values === "object" && values !== null) {
            return Object.entries(values).map(([key, value]) => (
                <div key={key}>
                    <span className="font-semibold">{key}:</span>{" "}
                    {JSON.stringify(value)}
                </div>
            ));
        }
        return JSON.stringify(values);
    };
    const eventTranslations = {
        created: "Creado",
        updated: "Actualizado",
        deleted: "Eliminado",
        // Agrega más eventos según los que uses
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto pt-20 px-4 md:px-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between mb-6">
                    <div className="max-w-lg mb-4 md:mb-0">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            Administración
                        </h3>
                        <p className="text-gray-600 mt-2">Auditoría</p>
                        {success && (
                            <div className="text-green-500 mt-2">{success}</div>
                        )}
                    </div>
                    <div className="mt-3 md:mt-0"></div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 space-y-4 sm:space-y-0">
                    <div className="w-full sm:w-1/2"></div>
                    <div className="flex justify-end">
                        {hasPermission("manage.export") && (
                            <ExportData
                                data={selectedAudits}
                                searchColumns={columnasexportar}
                                headers={theadersexsportar}
                                fileName="Auditoria"
                            />
                        )}
                    </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {hasPermission("manage.export") && (
                                        <th scope="col" className="px-6 py-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                onChange={
                                                    handleHeaderCheckboxChange
                                                }
                                                checked={areAllSelected}
                                            />
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Acción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Dirección IP
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Valores Antiguos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Valores Actuales
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 relative">
                                        <span className="sr-only">
                                            Acciones
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((audit) => (
                                        <tr
                                            key={audit.id}
                                            className="hover:bg-gray-50"
                                        >
                                            {hasPermission("manage.export") && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                        checked={
                                                            !!selectedRows[
                                                                audit.id
                                                            ]
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                audit,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap max-w-36 overflow-hidden text-ellipsis">
                                                <div className="text-sm text-gray-900 truncate">
                                                    {audit.user_id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap max-w-36 overflow-hidden text-ellipsis hidden md:table-cell">
                                                <div className="text-sm text-gray-900 truncate">
                                                    {eventTranslations[
                                                        audit.event
                                                    ] || audit.event}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap max-w-36 overflow-hidden text-ellipsis hidden md:table-cell">
                                                <div className="text-sm text-gray-900 truncate">
                                                    {audit.ip_address}
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-900 px-6 py-4 max-w-36 hidden lg:table-cell">
                                                <div className="text-sm text-gray-900 break-words">
                                                    {formatValues(
                                                        audit.old_values,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-900 px-6 py-4 max-w-36 hidden lg:table-cell">
                                                <div className="text-sm text-gray-900 break-words">
                                                    {formatValues(
                                                        audit.new_values,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 truncate">
                                                    {new Date(
                                                        audit.created_at,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No hay carpetas para mostrar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        Atrás
                    </button>
                    <p className="text-sm text-gray-700">
                        Página{" "}
                        <span className="font-medium">{currentPage}</span> de{" "}
                        <span className="font-medium">{totalPages}</span>
                    </p>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        Siguiente
                    </button>
                </div>

                <ToastContainer />
            </div>
        </div>
    );
}
