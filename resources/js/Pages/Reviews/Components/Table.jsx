import React, { useState, useEffect } from "react";
import { usePage, useForm, Link } from "@inertiajs/react"; // Importa el hook de Inertia
import { Inertia } from "@inertiajs/inertia"; // Importa Inertia desde el paquete correcto
import { FaPlusCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalCreate from "./ModalCreate";
import ModalDelete from "./ModalDelete"; // Importa el modal de eliminar
import ModalEdit from "./ModalEdit"; // Importa el modal de eliminar
import ModalView from "./ModalView"; // Importa el modal de eliminar
import SearchInput from "@/Components/SearchInput";
import EditIcon from "@/Icons/edit";
import DeleteIcon from "@/Icons/delete";
import View from "@/Icons/view";
import ExportData from "@/Components/ExportData";
import axios from "axios";

export default function Table() {
    const {
        document,
        observations,
        corrections,
        reviews,
        folders,
        usuariosRoles,
        logoCICI,
        success,
    } = usePage().props; // Obtener los datos de la página de Inertia
    const { data, setData, post, reset, errors } = useForm({
        estado: "",
        fecha_estado: "",
        document_id: "",
        tipo_documento: "",
        nombre_observacion: "",
        descripcion: "",
    });

    const theadersexsportar = [
        "Tramite",
        "Documento",
        "Estado",
        "Fecha Revisión",
        "Observacion",
        "Descripción",
    ];
    const columnasexportar = [
        "tramite",
        "tipo_documento",
        "estado",
        "fecha_estado",
        "first_observation_name",
        "first_observation_description",
    ];

    const [selectedTipoEstado, setSelectedTipoEstado] = useState("");

    const [showView, setShowView] = useState(false);

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(10);

    const estadoOptions = [
        { value: "Observación", label: "Observación" },
        { value: "Corregido", label: "Corregido" },
        // { value: "Aprobada", label: "Aprobada" },
    ];

    const handleChangeTipoEstado = (value) => {
        setSelectedTipoEstado(value);
        setData("estado", value);
    };

    const handleChangeEstadoRevision = (value) => {
        setSelectedTipoEstado(value); // Actualiza el estado cuando cambia la selección
        setData("estado", value); // Asegura que estado_carpeta también se actualice
        //Revisar Documentación prevData
        setData((prevData) => ({
            ...prevData,
            estado: "",
        }));
    };

    const [showCreate, setShowCreate] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [reviewIdToEdit, setReviewIdToEdit] = useState(null);
    const [processingEdit, setProcessingEdit] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar el modal de eliminación
    const [reviewIdToDelete, setReviewIdToDelete] = useState(null); // Almacena el ID del usuario a eliminar
    const [processingDelete, setProcessingDelete] = useState(false); // Estado para el procesamiento de eliminación

    // Filtrar las revisiones que pertenecen al documento específico
    const [filteredReviews, setFilteredReviews] = useState(reviews);

    useEffect(() => {
        const filterReviews = () => {
            let filtered = [];
            if (Array.isArray(document)) {
                filtered = reviews.filter((review) =>
                    document.some(
                        (doc) => review.document_id === doc.document_id,
                    ),
                );
            } else if (document) {
                filtered = reviews.filter(
                    (review) => review.document_id === document.document_id,
                );
            } else {
                filtered = reviews;
            }
            setFilteredReviews(filtered);
        };

        filterReviews();
    }, [reviews, document]);

    const openModal = () => {
        setData({
            fecha_estado: new Date().toISOString().slice(0, 10),
            tipo_documento: document.tipo_documento,
            document_id: document.document_id,
        });
        setShowCreate(true);
    };

    const closeModal = () => {
        setShowCreate(false);
        setData({
            estado: "",
        });
    };

    const openDeleteModal = (review_id) => {
        setReviewIdToDelete(review_id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setReviewIdToDelete(null);
    };

    const openEditModal = (review) => {
        // Encontrar la observación con el mismo review_id
        const observation = observations.find(
            (observation) => observation.review_id === review.review_id,
        );

        // Si se encontró la observación, obtener el nombre
        const nombre_observacion = observation
            ? observation.nombre_observacion
            : "";

        // Si se encontró la descripcion, obtener la descripcion
        const descripcion = observation ? observation.descripcion : "";
        setReviewIdToEdit(review.review_id);
        setData({
            document_id: document.document_id,
            estado: review.estado,
            fecha_estado: review.fecha_estado,
            nombre_observacion: nombre_observacion,
            descripcion: descripcion,
        });
        setSelectedTipoEstado(review.estado);
        setShowEdit(true);
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setData({
            document_id: "",
            estado: "",
            fecha_estado: "",
            nombre_observacion: "",
            descripcion: "",
        });
        setSelectedTipoEstado("");
    };

    const openViewModal = (review) => {
        // Encontrar la observación con el mismo review_id
        const observation = observations.find(
            (observation) => observation.review_id === review.review_id,
        );

        // Si se encontró la observación, obtener el nombre
        const nombre_observacion = observation
            ? observation.nombre_observacion
            : "";

        // Si se encontró la descripcion, obtener la descripcion
        const descripcion = observation ? observation.descripcion : "";
        setShowView(true);
        setData({
            document_id: document.document_id,
            estado: review.estado,
            fecha_estado: review.fecha_estado,
            nombre_observacion: nombre_observacion,
            descripcion: descripcion,
        });
        setSelectedTipoEstado(review.estado);
    };

    const closeViewModal = () => {
        setShowView(false);
        setData({
            document_id: "",
            estado: "",
            fecha_estado: "",
            nombre_observacion: "nombre_observacion",
            descripcion: "",
        });
        setSelectedTipoEstado("");
    };

    //Funcion para eliminar una revision

    const handleDelete = () => {
        setProcessingDelete(true);

        axios
            .delete(route("reviews.destroy", reviewIdToDelete))
            .then((response) => {
                closeDeleteModal();
                Inertia.visit(route("reviews.index"));
            })
            .catch((error) => {
                console.error(
                    "Error al eliminar usuario:",
                    error.response.data,
                );
            })
            .finally(() => {
                setProcessingDelete(false);
            });
    };

    //Función para agregar una nueva revisión

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData(e.target);
        formData.append("document_id", data.document_id);
        if (data.estado) {
            formData.append("estado", data.estado);
        }
        axios
            .post(route("reviews.store"), formData)
            .then((response) => {
                toast.success("Revisión creada");
                closeModal();
                Inertia.visit(
                    route("reviews.show", { document: data.document_id }),
                ); // Utiliza Inertia para actualizar la página
            })
            .catch((error) => {
                // Verificar si el error de validación proviene del servidor
                if (error.response && error.response.data.errors) {
                    const validationErrors = error.response.data.errors;

                    // Mostrar cada mensaje de error en un toast
                    Object.values(validationErrors).forEach((messages) => {
                        messages.forEach((message) => {
                            toast.error(message); // Mostrar cada mensaje en un toast individual
                        });
                    });
                } else {
                    // Mensaje genérico si no es un error de validación
                    toast.error(
                        "Error al crear la revisión. Revise los datos ingresados.",
                    );
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    //Función para actualizar una revision

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        setProcessingEdit(true);

        const formData = new FormData(e.target);
        if (selectedTipoEstado != "undefined") {
            formData.append("estado", selectedTipoEstado);
        }
        const newForm = Object.fromEntries(formData);

        axios
            .put(route("reviews.update", reviewIdToEdit), newForm, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            })
            .then((response) => {
                toast.success("Revisión actualizada");
                closeEditModal();
                Inertia.visit(
                    route("reviews.show", { document: data.document_id }),
                ); // Utiliza Inertia para actualizar la página
            })
            .catch((error) => {
                // Verificar si el error de validación proviene del servidor
                if (error.response && error.response.data.errors) {
                    const validationErrors = error.response.data.errors;

                    // Mostrar cada mensaje de error en un toast
                    Object.values(validationErrors).forEach((messages) => {
                        messages.forEach((message) => {
                            toast.error(message); // Mostrar cada mensaje en un toast individual
                        });
                    });
                } else {
                    // Mensaje genérico si no es un error de validación
                    toast.error(
                        "Error al editar la revisión. Revise los datos ingresados.",
                    );
                }
            })
            .finally(() => {
                setProcessingEdit(false);
            });
    };

    // Pagination logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(
        indexOfFirstReview,
        indexOfLastReview,
    );
    const totalPages = Math.max(
        1,
        Math.ceil(filteredReviews.length / reviewsPerPage),
    );

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleSearch = (selectedEstado) => {
        if (!selectedEstado) {
            setFilteredReviews(reviews);
        } else {
            const lowercasedEstado = selectedEstado.toLowerCase();

            const filtered = reviews.filter(
                (review) =>
                    review.estado &&
                    review.estado.toLowerCase() === lowercasedEstado,
            );

            setFilteredReviews(filtered);
        }
    };

    const inputs = [
        {
            name: "fecha_estado",
            type: "date",
            label: "Fecha Revisión",
            placeholder: "Ingrese la fecha...",
            required: false,
            value: data.fecha_estado || "",
            onChange: (e) => setData({ ...data, fecha_estado: e.target.value }),
            className: "",
        },
        {
            label: "Estado de la revisión",
            id: "estado",
            type: "combobox",
            name: "estado",
            options: estadoOptions,
            value: selectedTipoEstado,
            onChange: handleChangeTipoEstado,
            defaultValue: data.estado,
            required: false,
        },
        {
            name: "nombre_observacion",
            type: "text",
            label: "Nombre de la Observación",
            placeholder: "Ingrese al nombre...",
            required: false,
        },
        {
            name: "descripcion",
            type: "text",
            label: "Descripción de la Observación",
            placeholder: "Ingrese la observación...",
            required: false,
        },
    ];

    const inputsEdit = [
        {
            name: "fecha_estado",
            type: "date",
            label: "Ingrese la fecha",
            placeholder: "Ingrese la fecha",
            required: true,
            value: data.fecha_estado || "",
            onChange: (e) => setData({ ...data, fecha_estado: e.target.value }), // Actualiza el estado
        },
        {
            type: "combobox",
            label: "Estado de la revisión",
            name: "estado",
            options: estadoOptions,
            required: true,
            value: selectedTipoEstado,
            onChange: handleChangeEstadoRevision,
            className: "",
            defaultValue: data.estado,
        },

        {
            name: "nombre_observacion",
            type: "text",
            label: "Nombre de la Observación",
            placeholder: "Nombre de la Observación",
            required: false,
            value: data.nombre_observacion,
            onChange: (e) =>
                setData({ ...data, nombre_observacion: e.target.value }),
        },
        {
            name: "descripcion",
            type: "text",
            label: "Descripción de la Observación",
            placeholder: "Descripción de la Observación",
            required: false,
            value: data.descripcion,
            onChange: (e) => setData({ ...data, descripcion: e.target.value }),
        },
    ];

    const [selectedRows, setSelectedRows] = useState({});
    const handleCheckboxChange = (review) => {
        setSelectedRows((prev) => {
            // Copiamos el estado previo
            const updatedRows = { ...prev };

            // Si el documento ya está seleccionado, lo quitamos
            if (updatedRows[review.review_id]) {
                delete updatedRows[review.review_id];
            } else {
                // Si no está seleccionado, lo agregamos usando su folder_id como clave
                updatedRows[review.review_id] = review;
            }

            return updatedRows;
        });
    };

    const areAllSelected =
        currentReviews.length > 0 &&
        currentReviews.every((item) => selectedRows[item.review_id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};

        if (!areAllSelected) {
            currentReviews.forEach((item) => {
                newSelectedRows[item.review_id] = item;
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const selectedReviews = Object.values(selectedRows);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto pt-20 px-4 md:px-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between mb-6">
                    <div className="max-w-lg mb-4 md:mb-0">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            Revisiones
                        </h3>
                        <p className="text-gray-600 mt-2">Administración</p>
                        {success && (
                            <div className="text-green-500 mt-2">{success}</div>
                        )}
                    </div>

                    <div className="mt-3 md:mt-0">
                        {!Array.isArray(document) &&
                            hasPermission("create.reviews") && (
                                <button
                                    onClick={openModal}
                                    className="w-full md:w-auto flex justify-center px-3 py-2 items-center text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    <FaPlusCircle />
                                    <p className="pl-1">Agregar Revisión</p>
                                </button>
                            )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 space-y-4 sm:space-y-0">
                    <div className="w-full sm:w-1/2">
                        <SearchInput
                            options={Array.from(
                                new Set(reviews.map((review) => review.estado)),
                            ).map((estado) => ({
                                label: estado || "Estado no definido",
                                value: estado,
                            }))}
                            labelKey="label"
                            valueKey="value"
                            onSelect={(selectedValue) =>
                                handleSearch(selectedValue)
                            }
                            placeholder="Buscar por estado"
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end">
                        {hasPermission("manage.export") && (
                            <ExportData
                                data={selectedReviews}
                                searchColumns={columnasexportar}
                                headers={theadersexsportar}
                                fileName="Revisiones"
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Documento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Fecha Revisión
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Nombre Observación
                                    </th>
                                    {!Array.isArray(document) && (
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">
                                                Acciones
                                            </span>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Array.isArray(currentReviews) &&
                                currentReviews.length > 0 ? (
                                    currentReviews.map((review) => (
                                        <tr
                                            key={review.review_id}
                                            className="hover:bg-gray-50"
                                        >
                                            {hasPermission("manage.export") && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                        checked={
                                                            !!selectedRows[
                                                                review.review_id
                                                            ]
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                review,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    {review.tramite}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    {review.tipo_documento}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    {review.estado}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    {review.fecha_estado}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    <div className="truncate">
                                                        {review
                                                            .observations?.[0]
                                                            ?.nombre_observacion ||
                                                            "Sin observaciones"}
                                                    </div>
                                                </div>
                                            </td>
                                            {!Array.isArray(document) && (
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex justify-end space-x-2">
                                                        {hasPermission(
                                                            "view.reviews",
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openViewModal(
                                                                        review,
                                                                    )
                                                                }
                                                                className="p-1 text-green-600 hover:text-green-500 hover:bg-gray-100 rounded"
                                                            >
                                                                <View />
                                                            </button>
                                                        )}
                                                        {hasPermission(
                                                            "edit.reviews",
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        review,
                                                                    )
                                                                }
                                                                className="p-1 text-indigo-600 hover:text-indigo-500 hover:bg-gray-100 rounded"
                                                            >
                                                                <EditIcon />
                                                            </button>
                                                        )}
                                                        {hasPermission(
                                                            "delete.reviews",
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        review.review_id,
                                                                    )
                                                                }
                                                                className="p-1 text-red-500 hover:text-red-400 hover:bg-gray-100 rounded"
                                                            >
                                                                <DeleteIcon />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            Este documento no tiene revisiones.
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

            {/* Modal para crear usuario */}
            <ModalCreate
                title="Crear Nueva Revisión"
                showCreate={showCreate}
                closeModalCreate={closeModal}
                inputs={inputs}
                processing={processing}
                handleSubmitAdd={handleSubmitAdd}
            />

            {/* Modal para eliminar usuario */}
            {showDeleteModal && (
                <ModalDelete
                    title="Eliminar una revisión"
                    showDelete={showDeleteModal}
                    closeModalDelete={closeDeleteModal}
                    processing={processingDelete}
                    handleDelete={handleDelete}
                    itemToDelete="revisión"
                />
            )}

            <ModalEdit
                title="Editar una Revisión"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                inputs={inputsEdit}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
            />

            {/* Modal para ver una Revision */}
            <ModalView
                title="Visualizar Revisión"
                showView={showView}
                closeViewModal={closeViewModal}
                inputs={inputsEdit} // Inputs necesarios como nombre de usuario, propietario, etc.
            />
            <ToastContainer />
        </div>
    );
}
