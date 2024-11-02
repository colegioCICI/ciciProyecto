import React, { useState } from "react";
import { usePage } from "@inertiajs/react"; // Importa el hook de Inertia
import { Inertia } from "@inertiajs/inertia"; // Importa Inertia desde el paquete correcto
import { FaPlusCircle } from "react-icons/fa";
import SearchInput from "@/Components/SearchInput";
import ExportData from "@/Components/ExportData";
import EmailModal from "@/Components/EmailModal";

export default function Table() {
    const { notifications, folders, usuariosRoles, logoCICI, success } =
        usePage().props;

    const [showEmailModal, setShowEmailModal] = useState(false);

    const theadersexsportar = ["Tramite", "Mensaje", "Fecha de Envió"];
    const columnasexportar = ["tramite", "mensaje", "fecha_envio"];

    // Estados para manejar la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationPerPage] = useState(10); // Cantidad de items por página

    const [filteredNotifications, setFilteredNotifications] =
        useState(notifications);

    // Calcular los índices de usuarios para la paginación
    const indexOfLastNotification = currentPage * notificationPerPage;
    const indexOfFirstNotification =
        indexOfLastNotification - notificationPerPage;
    const currentNotification = filteredNotifications.slice(
        indexOfFirstNotification,
        indexOfLastNotification,
    );
    const totalPages = Math.max(
        1,
        Math.ceil(filteredNotifications.length / notificationPerPage),
    );

    // Funciones para cambiar de página
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleSearch = (selectedFolderId) => {
        if (!selectedFolderId) {
            setFilteredNotifications(notifications); // Restaurar todas las notificaciones si no hay filtro
        } else {
            const selectedFolder = folders.find(
                (folder) => folder.folder_id === selectedFolderId,
            );

            if (selectedFolder) {
                const lowercasedTramite = selectedFolder.tramite
                    ? selectedFolder.tramite.toLowerCase()
                    : ""; // Controlar si tramite es null

                const filtered = notifications.filter(
                    (notification) =>
                        notification.tramite &&
                        notification.tramite.toLowerCase() ===
                            lowercasedTramite,
                );

                setFilteredNotifications(filtered);
            } else {
                setFilteredNotifications(notifications); // Restaurar si no se encuentra la carpeta
            }
        }
    };

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    const openModal = () => {
        setShowEmailModal(true);
    };

    const closeModal = () => {
        setShowEmailModal(false);
    };

    const [selectedRows, setSelectedRows] = useState({});
    const handleCheckboxChange = (notification) => {
        setSelectedRows((prev) => {
            // Copiamos el estado previo
            const updatedRows = { ...prev };

            // Si el documento ya está seleccionado, lo quitamos
            if (updatedRows[notification.notification_id]) {
                delete updatedRows[notification.notification_id];
            } else {
                // Si no está seleccionado, lo agregamos usando su folder_id como clave
                updatedRows[notification.notification_id] = notification;
            }

            return updatedRows;
        });
    };

    const areAllSelected =
        currentNotification.length > 0 &&
        currentNotification.every((item) => selectedRows[item.notification_id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};

        if (!areAllSelected) {
            currentNotification.forEach((item) => {
                newSelectedRows[item.notification_id] = item;
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const selectedNotification = Object.values(selectedRows);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto pt-20 px-4 md:px-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between mb-6">
                    <div className="max-w-lg mb-4 md:mb-0">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            Administración
                        </h3>
                        <p className="text-gray-600 mt-2">Correos</p>
                        {success && (
                            <div className="text-green-500 mt-2">{success}</div>
                        )}
                    </div>

                    <div className="mt-3 md:mt-0">
                        {hasPermission("create.notification") && (
                            <button
                                onClick={openModal}
                                className="w-full md:w-auto flex justify-center px-3 py-2 items-center text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FaPlusCircle className="mr-2" />
                                <p className="pl-1">Enviar Correo</p>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 space-y-4 sm:space-y-0">
                    <div className="w-full sm:w-1/2">
                        <SearchInput
                            options={folders.map((folder) => ({
                                label: folder.tramite || "Trámite no definido",
                                value: folder.folder_id,
                            }))}
                            labelKey="label"
                            valueKey="value"
                            onSelect={(selectedValue) =>
                                handleSearch(selectedValue)
                            }
                            placeholder="Buscar por trámite"
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end">
                        {hasPermission("manage.export") && (
                            <ExportData
                                data={selectedNotification}
                                searchColumns={columnasexportar}
                                headers={theadersexsportar}
                                fileName="Correos"
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
                                        Trámite
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Mensaje
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Fecha de Envió
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Array.isArray(currentNotification) &&
                                currentNotification.length > 0 ? (
                                    currentNotification.map((notification) => (
                                        <tr
                                            key={notification.notification_id}
                                            className="hover:bg-gray-50"
                                        >
                                            {hasPermission("manage.export") && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                        checked={
                                                            !!selectedRows[
                                                                notification
                                                                    .notification_id
                                                            ]
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                notification,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis">
                                                <div className="text-sm text-gray-900 truncate">
                                                    {notification.tramite}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    {notification.mensaje}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    {notification.fecha_envio}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No hay notificaciones para mostrar
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
            </div>
            {/*Modal para el correo electronico V1*/}
            <EmailModal
                showCreateEmail={showEmailModal}
                closeModalCreateEmail={closeModal}
                folders={folders}
            />
        </div>
    );
}
