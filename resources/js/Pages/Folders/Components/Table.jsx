import React, { useState, useEffect } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { FaPlusCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalCreate from "./ModalCreate";
import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";
import ModalView from "./ModalView";
import SearchInput from "@/Components/SearchInput";
import EditIcon from "@/Icons/edit";
import DeleteIcon from "@/Icons/delete";
import View from "@/Icons/view";
import ExportData from "@/Components/ExportData";
import axios from "axios";

export default function Table() {
    const { folders, usuariosRoles, logoCICI, success, users } =
        usePage().props; // Obtener los datos de la página de Inertia
    const { data, setData, patch } = useForm({
        user_id: "",
        fecha_ingreso: "",
        tramite: "",
        tramite_ca: "",
        nombre_propietario: "",
        ficha: "",
        cedula: "",
        nombre_quiendeja: "",
        estado_carpeta: "",
        email_propietario: "",
        email_ingeniero: "",
        nombre_quienretira: "",
        fecha_retiro: "",
        numero_ingreso: "",
        nombre_usuario: "",
        documents: [], // Campo para los documentos
        tramite_factura: "",
    });

    const theadersexsportar = [
        "Ingreso",
        "Propietario",
        "Ficha",
        "Trámite",
        "Cedula",
        "Quien Deja",
        "Estado",
        "Correo P.",
        "Correo I.",
        "Quien Retira",
        "Retiro",
        "Ingreso",
        "Usuario",
    ];
    const columnasexportar = [
        "fecha_ingreso",
        "nombre_propietario",
        "ficha",
        "tramite",
        "cedula",
        "nombre_quiendeja",
        "estado_carpeta",
        "email_propietario",
        "email_ingeniero",
        "nombre_quienretira",
        "fecha_retiro",
        "numero_ingreso",
        "nombre_usuario",
    ];

    const [selectedTipoEstado, setSelectedTipoEstado] = useState("");

    const estadoOptions = [
        { value: "Observación", label: "Observación" },
        { value: "Revisión", label: "Revisión" },
        { value: "Aprobado", label: "Aprobado" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const handleChangeTipoEstado = (value) => {
        setSelectedTipoEstado(value);
        setData("estado", value);
    };

    const handleChangeEstadoCarpeta = (value) => {
        setSelectedTipoEstado(value); // Actualiza el estado cuando cambia la selección
        setData("estado_carpeta", value); // Asegura que estado_carpeta también se actualice
        //Revisar Documentación prevData
        setData((prevData) => ({
            ...prevData,
            estado_carpeta: "",
        }));
    };

    const [selectedDocuments, setSelectedDocuments] = useState([]);

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    const [showCreate, setShowCreate] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [folderIdToEdit, setFolderIdToEdit] = useState(null);
    const [processingEdit, setProcessingEdit] = useState(false);

    const [showView, setShowView] = useState(false);
    const [processingView, setProcessingView] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar el modal de eliminación
    const [folderIdToDelete, setFolderToDelete] = useState(null); // Almacena el ID del usuario a eliminar
    const [processingDelete, setProcessingDelete] = useState(false); // Estado para el procesamiento de eliminación

    const openModal = () => {
        setData({
            fecha_ingreso: new Date().toISOString().slice(0, 10),
            documents: [], // Asegúrate de incluir `documents` para que no sea undefined
        });
        setShowCreate(true);
    };

    const closeModal = () => {

        setSelectedTipoEstado("");
        setShowCreate(false);
    };

    const openDeleteModal = (folderId) => {
        setFolderToDelete(folderId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setFolderToDelete(null);
    };

    const openViewModal = (folder) => {
        if (folder.documents) {
        }
        setData({
            user_id: folder.user_id,
            nombre_usuario: folder.nombre_usuario,
            fecha_ingreso: folder.fecha_ingreso,
            tramite: folder.tramite || "",
            tramite_ca: folder.tramite_ca || "",
            nombre_propietario: folder.nombre_propietario,
            ficha: folder.ficha,
            cedula: folder.cedula,
            nombre_quiendeja: folder.nombre_quiendeja,
            estado_carpeta: folder.estado_carpeta,
            email_propietario: folder.email_propietario || "",
            email_ingeniero: folder.email_ingeniero || "",
            nombre_quienretira: folder.nombre_quienretira || "",
            fecha_retiro: folder.fecha_retiro || "",
            numero_ingreso: folder.numero_ingreso,
            tramite_factura: folder.tramite_factura || "",
            documents: Array.isArray(folder.documents)
                ? folder.documents.map((doc) => doc.tipo_documento)
                : [], // Asegurarse de que siempre sea un array
        });
        setSelectedTipoEstado(folder.estado_carpeta);
        // Asegúrate de inicializar el estado de los documentos seleccionados
        setSelectedDocuments(folder.documents.map((doc) => doc.tipo_documento));
        setShowView(true);
    };

    const closeViewModal = () => {
        setSelectedTipoEstado("");
        setShowView(false);

    };
    const openEditModal = (folder) => {
        setFolderIdToEdit(folder.folder_id);
        if (folder.documents) {
        }
        setData({
            user_id: folder.user_id,
            nombre_usuario: folder.nombre_usuario,
            fecha_ingreso: folder.fecha_ingreso,
            tramite: folder.tramite || "",
            tramite_ca: folder.tramite_ca || "",
            nombre_propietario: folder.nombre_propietario,
            ficha: folder.ficha,
            cedula: folder.cedula,
            nombre_quiendeja: folder.nombre_quiendeja,
            estado_carpeta: folder.estado_carpeta,
            email_propietario: folder.email_propietario || "",
            email_ingeniero: folder.email_ingeniero || "",
            nombre_quienretira: folder.nombre_quienretira || "",
            fecha_retiro: folder.fecha_retiro || "",
            numero_ingreso: folder.numero_ingreso || "",
            tramite_factura: folder.tramite_factura || "",
            documents: Array.isArray(folder.documents)
                ? folder.documents.map((doc) => doc.tipo_documento)
                : [], // Asegurarse de que siempre sea un array
        });
        setSelectedTipoEstado(folder.estado_carpeta);

        // Asegúrate de inicializar el estado de los documentos seleccionados
        setSelectedDocuments(folder.documents.map((doc) => doc.tipo_documento));
        setShowEdit(true);
    };

    // useEffect para detectar cuando los documentos han sido actualizados
    useEffect(() => {
        if (data.documents.length > 0) {
        }
    }, [data.documents]);

    const closeEditModal = () => {
        setSelectedTipoEstado("");
        setShowEdit(false);
    };

    const handleDelete = () => {
        setProcessingDelete(true);

        axios
            .delete(route("folders.destroy", folderIdToDelete))
            .then((response) => {
                closeDeleteModal();
                Inertia.visit(route("folders.index")); // Utiliza Inertia para actualizar la página
                window.location.reload();

            })
            .catch((error) => {
                console.error(
                    "Error al eliminar carpeta:",
                    error.response.data,
                );
            })
            .finally(() => {
                setProcessingDelete(false);
            });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData(e.target);

        formData.append("user_id", data.user_id);
        formData.append("estado_carpeta", data.estado);

        if (data.documents && data.documents.length > 0) {
            data.documents.forEach((document, index) => {
                formData.append(`documents[${index}]`, document);
            });
        } else {
            console.log("DATOS VACIOS");
        }

        axios
            .post(route("folders.store"), formData)
            .then((response) => {
                toast.success("Carpeta creada");
                closeModal();
                Inertia.visit(route("folders.index"));
                window.location.reload();

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
                        "Error al crear la carpeta. Revise los datos ingresados.",
                    );
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        setProcessingEdit(true);

        const formData = new FormData(e.target);
        formData.append("user_id", data.user_id);
        formData.append("estado_carpeta", selectedTipoEstado);

        if (data.documents && data.documents.length > 0) {
            data.documents.forEach((document, index) => {
                formData.append(`documents[${index}]`, document);
            });
        } else {
            console.log("DATOS VACIOS");
        }
        axios
            .patch(route("folders.update", folderIdToEdit), formData, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            })
            .then((response) => {
                toast.success("Actualización completada");
                closeEditModal();
                Inertia.visit(route("folders.index"));
                window.location.reload();

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
                        "Error al actualizar la carpeta. Revise los datos ingresados.",
                    );
                }
            })
            .finally(() => {
                setProcessingEdit(false);
            });
    };

    const [filteredFolders, setFilteredFolders] = useState(folders);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFolders.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.max(
        1,
        Math.ceil(filteredFolders.length / itemsPerPage),
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

    const handleSearch = (selectedFolderId) => {
        if (!selectedFolderId) {
            setFilteredFolders(folders);
        } else {
            const selectedFolder = folders.find(
                (folder) => folder.folder_id === selectedFolderId,
            );

            if (selectedFolder) {
                const lowercasedTramite = selectedFolder.tramite
                    ? selectedFolder.tramite.toLowerCase()
                    : ""; // Controlar si tramite es null

                const filtered = folders.filter(
                    (folder) =>
                        folder.tramite &&
                        folder.tramite.toLowerCase() === lowercasedTramite,
                );

                setFilteredFolders(filtered);
            } else {
                setFilteredFolders(folders);
            }
        }
    };

    const inputs = [
        {
            name: "fecha_ingreso",
            type: "date",
            label: "Fecha de ingreso",
            placeholder: "Ingrese fecha de ingreso...",
            required: false,
            value: data.fecha_ingreso,
            onChange: (e) =>
                setData({ ...data, fecha_ingreso: e.target.value }),
            className: "",
        },
        {
            name: "tramite",
            type: "text",
            label: "Numero interno...",
            placeholder: "Ingrese numero de interno...",
            required: false,
            className: "",
        },

        {
            name: "tramite_ca",
            type: "text",
            label: "Trámite CA",
            placeholder: "Ingrese número de trámite CA...",
            required: false,
            className: "",
        },

        {
            name: "nombre_propietario",
            type: "text",
            label: "Nombre del propietario",
            placeholder: "Ingrese nombre del propietario...",
            required: false,
            className: "",
        },
        {
            name: "ficha",
            type: "number",
            label: "Ficha",
            placeholder: "Ingrese número de ficha...",
            required: false,
            className: "",
        },
        {
            name: "cedula",
            type: "text",
            label: "Cédula",
            placeholder: "Ingrese número de cédula...",
            required: false,
            className: "",
        },
        {
            name: "nombre_quiendeja",
            type: "text",
            label: "Nombre de quien deja",
            placeholder: "Ingrese nombre de quien deja...",
            required: false,
            className: "",
        },
        {
            label: "Estado de la carpeta",
            id: "estado_carpeta",
            type: "combobox",
            name: "estado_carpeta",
            options: estadoOptions,
            value: selectedTipoEstado,
            onChange: handleChangeTipoEstado,
            defaultValue: data.estado,
            required: true,
        },
        {
            name: "email_propietario",
            type: "email",
            label: "Correo del propietario...",
            placeholder: "Ingrese el correo del propietario...",
            required: false,
            className: "",
        },
        {
            name: "email_ingeniero",
            type: "email",
            label: "Correo del ingeniero...",
            placeholder: "Ingrese el correo del ingeniero...",
            required: false,
            className: "",
        },
        {
            name: "nombre_quienretira",
            type: "text",
            label: "Nombre de quien retira",
            placeholder: "Ingrese nombre de quien retira...",
            required: false,
            className: "",
        },
        {
            name: "fecha_retiro",
            type: "date",
            label: "Fecha de retiro",
            placeholder: "Ingrese fecha de retiro...",
            required: false,
            value: data.fecha_retiro || "",
            onChange: (e) => setData({ ...data, fecha_retiro: e.target.value }),
            className: "",
        },
        {
            name: "numero_ingreso",
            type: "number",
            label: "Número de ingreso",
            placeholder: "Ingrese número de ingreso...",
            required: false,
            className: "",
        },
        {
            name: "user_id",
            type: "select",
            label: "Usuario asignado",
            placeholder: "Asignado a...",
            options: users,
            labelKey: "name",
            valueKey: "id",
            required: false,
            onSelect: (value) => {
                handleInputChange("user_id", value);
            },
            className: "",
        },
        {
            name: "tramite_factura",
            type: "text",
            label: "Tramite Factura",
            placeholder: "Ingrese numero de tramite...",
            required: false,
            className: "",
        },
    ];

    const inputsEdit = [
        {
            name: "fecha_ingreso",
            type: "date",
            label: "Fecha de ingreso",
            placeholder: "Ingrese fecha de ingreso...",
            required: false,
            value: data.fecha_ingreso,
            onChange: (e) =>
                setData({ ...data, fecha_ingreso: e.target.value }),
            className: "",
        },
        {
            name: "tramite",
            type: "text",
            label: "Numero interno...",
            placeholder: "Ingrese numero de tramite...",
            required: false,
            value: data.tramite,
            onChange: (e) => setData({ ...data, tramite: e.target.value }),
            className: "",
        },
        {
            name: "tramite_ca",
            type: "text",
            label: "Trámite CA",
            placeholder: "Ingrese número de trámite CA...",
            required: false,
            value: data.tramite_ca,
            onChange: (e) => setData({ ...data, tramite_ca: e.target.value }),
            className: "",
        },
        {
            name: "nombre_propietario",
            type: "text",
            label: "Nombre propietario",
            placeholder: "Ingrese nombre...",
            required: false,
            value: data.nombre_propietario,
            onChange: (e) =>
                setData({ ...data, nombre_propietario: e.target.value }),
            className: "",
        },
        {
            name: "ficha",
            type: "number",
            label: "Ficha",
            placeholder: "Ingrese Ficha...",
            required: false,
            value: data.ficha,
            onChange: (e) => setData({ ...data, ficha: e.target.value }),
            className: "",
        },
        {
            name: "cedula",
            type: "text",
            label: "Cédula",
            placeholder: "Ingrese cedula...",
            required: false,
            value: data.cedula,
            onChange: (e) => setData({ ...data, cedula: e.target.value }),
            className: "",
        },
        {
            name: "nombre_quiendeja",
            type: "text",
            label: "Nombre de quien deja",
            placeholder: "Quien Deja...",
            required: false,
            value: data.nombre_quiendeja,
            onChange: (e) =>
                setData({ ...data, nombre_quiendeja: e.target.value }),
            className: "",
        },
        {
            type: "combobox",
            label: "Estado de la carpeta",
            name: "estado_carpeta",
            options: estadoOptions,
            required: true,
            value: selectedTipoEstado,
            onChange: handleChangeEstadoCarpeta,
            className: "",
            defaultValue: data.estado_carpeta,
        },
        {
            name: "email_propietario",
            type: "email",
            label: "Correo del propietario...",
            placeholder: "Correo del propietario...",
            required: false,
            value: data.email_propietario,
            onChange: (e) => setData("email_propietario", e.target.value),
            className: "",
        },
        {
            name: "email_ingeniero",
            type: "text",
            label: "Correo del ingeniero...",
            placeholder: "Correo del ingeniero...",
            required: false,
            value: data.email_ingeniero,
            onChange: (e) => setData("email_ingeniero", e.target.value),
            className: "",
        },
        {
            name: "nombre_quienretira",
            type: "text",
            label: "Nombre quien retira",
            placeholder: "Quien Retira...",
            required: false,
            value: data.nombre_quienretira,
            onChange: (e) =>
                setData({ ...data, nombre_quienretira: e.target.value }),
            className: "",
        },
        {
            name: "fecha_retiro",
            type: "date",
            label: "Fecha de retiro",
            placeholder: "Fecha Retiro...",
            required: false,
            value: data.fecha_retiro,
            onChange: (e) => setData({ ...data, fecha_retiro: e.target.value }),
            className: "",
        },
        {
            name: "numero_ingreso",
            type: "number",
            label: "Número de Ingreso",
            placeholder: "Ingrese número...",
            required: false,
            value: data.numero_ingreso,
            onChange: (e) =>
                setData({ ...data, numero_ingreso: e.target.value }),
            className: "",
        },
        {
            name: "nombre_usuario",
            type: "select",
            label: "Asignado a...",
            placeholder: "Responsable...",
            required: false,
            defaultValue: data.nombre_usuario,
            onSelect: (value) => {
                handleInputChange("user_id", value);
            },
            className: "",
            options: users, // Opciones dinámicas que vienen del backend
            labelKey: "name", // Llave del label para mostrar
            valueKey: "id", // Llave del valor a capturar
        },
        {
            name: "tramite_factura",
            type: "text",
            label: "Tramite Factura",
            placeholder: "Tramite Factura...",
            required: false,
            value: data.tramite_factura,
            onChange: (e) =>
                setData({ ...data, tramite_factura: e.target.value }),
            className: "",
        },
    ];

    const [selectedRows, setSelectedRows] = useState({});
    const handleCheckboxChange = (folder) => {
        setSelectedRows((prev) => {
            // Copiamos el estado previo
            const updatedRows = { ...prev };

            // Si el documento ya está seleccionado, lo quitamos
            if (updatedRows[folder.folder_id]) {
                delete updatedRows[folder.folder_id];
            } else {
                // Si no está seleccionado, lo agregamos usando su folder_id como clave
                updatedRows[folder.folder_id] = folder;
            }

            return updatedRows;
        });
    };

    const areAllSelected =
        currentItems.length > 0 &&
        currentItems.every((item) => selectedRows[item.folder_id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};

        if (!areAllSelected) {
            currentItems.forEach((item) => {
                newSelectedRows[item.folder_id] = item;
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const selectedFolders = Object.values(selectedRows);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto pt-20 px-4 md:px-8">
                {/* Header Section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 sm:text-2xl">
                            Administración
                        </h3>
                        <p className="text-gray-600 mt-2">Carpetas</p>
                        {success && (
                            <div className="mt-2 text-sm text-green-600 font-medium">
                                {success}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {hasPermission("create.folders") && (
                            <button
                                onClick={openModal}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <FaPlusCircle className="mr-2" />
                                <span>Agregar Carpeta</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search and Export Section */}
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
                                data={selectedFolders}
                                searchColumns={columnasexportar}
                                headers={theadersexsportar}
                                fileName="Carpetas"
                            />
                        )}
                    </div>
                </div>

                {/* Table Section */}
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

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        ID carpeta
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell"
                                    >
                                        Nombre Propietario
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell"
                                    >
                                        Ficha
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell"
                                    >
                                        Ingreso
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:table-cell"
                                    >
                                        Estado
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                    >
                                        <span className="sr-only">
                                            Acciones
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((folder) => (
                                        <tr
                                            key={folder.folder_id}
                                            className="hover:bg-gray-50"
                                        >
                                            {hasPermission("manage.export") && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                        checked={
                                                            !!selectedRows[
                                                            folder.folder_id
                                                            ]
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                folder,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {folder.folder_id}
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                    {folder.nombre_propietario}
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                                                <div className="text-sm text-gray-900">
                                                    {folder.ficha}
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-4 whitespace-nowrap md:table-cell">
                                                <div className="text-sm text-gray-900">
                                                    {folder.fecha_ingreso}
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-4 whitespace-nowrap lg:table-cell">
                                                <div className="text-sm text-gray-900">
                                                    {folder.estado_carpeta}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {hasPermission(
                                                        "view.folders",
                                                    ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openViewModal(
                                                                        folder,
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                                                                aria-label="Ver"
                                                            >
                                                                <View className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    {hasPermission(
                                                        "edit.folders",
                                                    ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        folder,
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                                aria-label="Editar"
                                                            >
                                                                <EditIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    {hasPermission(
                                                        "delete.folders",
                                                    ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        folder.folder_id,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                                aria-label="Eliminar"
                                                            >
                                                                <DeleteIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
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
            </div>

            {/* Modal para crear carpeta */}
            <ModalCreate
                title="Crear Nueva Carpeta"
                showCreate={showCreate}
                closeModalCreate={closeModal}
                inputs={inputs}
                processing={processing}
                handleSubmitAdd={handleSubmitAdd}
                onDocumentChange={(selectedDocuments) =>
                    setData("documents", selectedDocuments)
                } // Actualiza `documents`
                documents={data.documents} // Asegúrate de pasar `documents` aunque sea vacío
            />

            {/* Modal para eliminar usuario */}
            {showDeleteModal && (
                <ModalDelete
                    title="Eliminar Carpeta"
                    showDelete={showDeleteModal}
                    closeModalDelete={closeDeleteModal}
                    processing={processingDelete}
                    handleDelete={handleDelete}
                    itemToDelete="Carpeta"
                />
            )}

            {/* Modal para editar una carpeta */}
            <ModalEdit
                title="Editar carpeta"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                inputs={inputsEdit} // Inputs necesarios como nombre de usuario, propietario, etc.
                folder={{ documents: data.documents }} // Pasas los documentos seleccionados
                processing={processing} // Estado de procesamiento del formulario
                handleSubmitEdit={handleSubmitEdit} // Función para manejar el submit del formulario
                onDocumentChange={(updatedDocuments) =>
                    setData({ ...data, documents: updatedDocuments })
                } // Manejo de cambios en documentos
                selectedDocuments={data.documents} // Pasar documentos seleccionados a CheckList
            />
            {/* Modal para ver una carpeta */}
            <ModalView
                title="Visualizar carpeta"
                showView={showView}
                closeViewModal={closeViewModal}
                inputs={inputsEdit} // Inputs necesarios como nombre de usuario, propietario, etc.
                folder={{ documents: data.documents }} // Pasas los documentos seleccionados
                onDocumentChange={(updatedDocuments) =>
                    setData({ ...data, documents: updatedDocuments })
                } // Manejo de cambios en documentos
                selectedDocuments={data.documents} // Pasar documentos seleccionados a CheckList
            />
            <ToastContainer />
        </div>
    );
}
