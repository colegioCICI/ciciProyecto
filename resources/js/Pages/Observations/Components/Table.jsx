import React, { useState } from "react";
import { usePage } from "@inertiajs/react"; // Importa el hook de Inertia
import { Inertia } from "@inertiajs/inertia"; // Importa Inertia desde el paquete correcto
import ExportData from "@/Components/ExportData";
import DeleteIcon from "@/Icons/delete";
import ModalDelete from "./ModalDelete"; // Importa el modal de eliminar
import axios from "axios";

export default function Table() {
    const { observations, usuariosRoles, logoCICI, success } = usePage().props; // Obtener los datos de la página de Inertia

    const theadersexsportar = ["Estado", "Fecha Revisión"];
    const columnasexportar = ["estado", "fecha_estado"];

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar el modal de eliminación
    const [observationIdToDelete, setObservationIdToDelete] = useState(null); // Almacena el ID del usuario a eliminar
    const [processingDelete, setProcessingDelete] = useState(false); // Estado para el procesamiento de eliminación

    const openDeleteModal = (observationId) => {
        setObservationIdToDelete(observationId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setObservationIdToDelete(null);
    };

    //Funcion para eliminar un usuario

    const handleDelete = () => {
        setProcessingDelete(true);

        axios
            .delete(route("observations.destroy", observationIdToDelete))
            .then((response) => {
                closeDeleteModal();
                Inertia.visit(route("observations.index")); // Utiliza Inertia para actualizar la página
                window.location.reload(); 

            })
            .catch((error) => {
                console.error(
                    "Error al eliminar observation:",
                    error.response.data,
                );
            })
            .finally(() => {
                setProcessingDelete(false);
            });
    };

    // Estados para manejar la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [observationPerPage] = useState(10); // Cantidad de usuarios por página

    // Calcular los índices de usuarios para la paginación
    const indexOfLastObservation = currentPage * observationPerPage;
    const indexOfFirstObservation = indexOfLastObservation - observationPerPage;
    const currentObservation = observations.slice(
        indexOfFirstObservation,
        indexOfLastObservation,
    );
    const totalPages = Math.max(
        1,
        Math.ceil(observations.length / observationPerPage),
    );

    // Funciones para cambiar de página
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const [selectedRows, setSelectedRows] = useState({});
    const handleCheckboxChange = (observation) => {
        setSelectedRows((prev) => {
            // Copiamos el estado previo
            const updatedRows = { ...prev };

            // Si el documento ya está seleccionado, lo quitamos
            if (updatedRows[observation.observation_id]) {
                delete updatedRows[observation.observation_id];
            } else {
                // Si no está seleccionado, lo agregamos usando su folder_id como clave
                updatedRows[observation.observation_id] = observation;
            }

            return updatedRows;
        });
    };

    const areAllSelected =
        currentObservation.length > 0 &&
        currentObservation.every((item) => selectedRows[item.observation_id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};

        if (!areAllSelected) {
            currentObservation.forEach((item) => {
                newSelectedRows[item.observation_id] = item;
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const selectedObservation = Object.values(selectedRows);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto pt-20 px-4 md:px-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between mb-6">
                    <div className="max-w-lg mb-4 md:mb-0">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            Observaciones
                        </h3>
                        <p className="text-gray-600 mt-2">Administración</p>
                        {success && (
                            <div className="text-green-500 mt-2">{success}</div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 space-y-4 sm:space-y-0">
                    <div className="flex justify-end">
                        {hasPermission("manage.export") && (
                            <ExportData
                                data={selectedObservation}
                                searchColumns={columnasexportar}
                                headers={theadersexsportar}
                                fileName="Observaciones"
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
                                            onChange={handleHeaderCheckboxChange}
                                            checked={areAllSelected}
                                        />
                                    </th>
                                )}

                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tramité</th>
                                    <th className="py-3 px-6 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre Observacion
                                    </th>
                                    <th className="py-3 px-6 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripcion
                                    </th>
                                    <th className="py-3 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 divide-y">
                                {Array.isArray(observations) &&
                                currentObservation.length > 0 ? (
                                    currentObservation.map((observation) => (
                                        <tr
                                            key={observation.observation_id}
                                            className="hover:bg-gray-50"
                                        >
                                            {hasPermission("manage.export") && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                        checked={
                                                            !!selectedRows[
                                                                observation
                                                                    .observation_id
                                                            ]
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                observation,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="truncate max-w-[150px] text-sm font-medium text-gray-900">
                                                    {observation.tramite}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className="truncate max-w-[150px] text-sm text-gray-900">
                                                    {
                                                        observation.nombre_observacion
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <div className="truncate max-w-[150px] text-sm text-gray-900">
                                                    {observation.descripcion}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end space-x-2">
                                                    {hasPermission(
                                                        "delete.observation",
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    observation.observation_id,
                                                                )
                                                            }
                                                            className="p-1 text-red-500 hover:text-red-400 hover:bg-gray-100 rounded"
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-4"
                                        >
                                            No hay observaciones para mostrar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal para eliminar usuario */}
                {showDeleteModal && (
                    <ModalDelete
                        title="Eliminar Observacion"
                        showDelete={showDeleteModal}
                        closeModalDelete={closeDeleteModal}
                        processing={processingDelete}
                        handleDelete={handleDelete}
                        itemToDelete="observacion"
                    />
                )}

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
        </div>
    );
}
