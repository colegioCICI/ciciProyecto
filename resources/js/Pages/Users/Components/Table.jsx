import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react"; // Importa el hook de Inertia
import { Inertia } from "@inertiajs/inertia"; // Importa Inertia desde el paquete correcto
import { FaPlusCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalCreate from "./ModalCreate"; //Importa el modal de crear
import ModalDelete from "./ModalDelete"; // Importa el modal de eliminar
import ModalEdit from "./ModalEdit"; // Importa el modal de eliminar
import ModalView from "./ModalView"; // Importa el modal de vista
import EditIcon from "@/Icons/edit";
import DeleteIcon from "@/Icons/delete";
import View from "@/Icons/view";
import ExportData from "@/Components/ExportData";
import axios from "axios";

export default function Table() {
    const { users, roles, usuariosRoles, logoCICI, success } = usePage().props; // Obtener los datos de la página de Inertia

    const { data, setData, post, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        role_id: "",
    });

    const theadersexsportar = [
        "Nombre del Usuario",
        "Correo Electronico",
        "Fecha de Creación",
        "Rol",
    ];
    const columnasexportar = ["name", "email", "created_at", "roles"];

    // Estados para manejar la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10); // Cantidad de usuarios por página

    // Calcular los índices de usuarios para la paginación
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.max(1, Math.ceil(users.length / usersPerPage));

    // Funciones para cambiar de página
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const [showCreate, setShowCreate] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [userIdToEdit, setUserIdToEdit] = useState(null);

    const [showView, setShowView] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar el modal de eliminación
    const [userIdToDelete, setUserIdToDelete] = useState(null); // Almacena el ID del usuario a eliminar
    const [processingDelete, setProcessingDelete] = useState(false); // Estado para el procesamiento de eliminación

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    const openModal = () => {
        setShowCreate(true);
    };

    const closeModal = () => {
        setShowCreate(false);
    };

    const openDeleteModal = (userId) => {
        setUserIdToDelete(userId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setUserIdToDelete(null);
    };

    const openEditModal = (user) => {
        setShowEdit(true);
        setUserIdToEdit(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.roles[0].role_name || "", // Accede al primer rol y toma su nombre
            role_id: user.roles[0].role_id || "", // Accede al primer rol y toma su nombre
        });
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setUserIdToEdit(null);
        setData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "",
        });
    };

    const openViewModal = (user) => {
        setShowView(true);
        setUserIdToEdit(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.roles[0].role_name || "", // Accede al primer rol y toma su nombre
        });
    };

    const closeViewModal = () => {
        setShowView(false);
        setUserIdToEdit(null);
        setData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "",
        });
    };

    //Funcion para eliminar un usuario

    const handleDelete = () => {
        setProcessingDelete(true);

        axios
            .delete(route("users.destroy", userIdToDelete))
            .then((response) => {
                closeDeleteModal();
                Inertia.visit(route("users.index")); // Utiliza Inertia para actualizar la página
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

    //Función para agregar un nuevo usuario

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData(e.target);
        formData.append("role", data.role);
        axios
            .post(route("users.store"), formData)
            .then((response) => {
                toast.success("Usuario creado");
                closeModal();
                Inertia.visit(route("users.index")); // Utiliza Inertia para actualizar la página
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
                setProcessing(false);
            });
    };

    //Funcion para Editar un usuario
    const handleSubmitEdit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData(e.target);
        formData.append("role", data.role_id);

        const newForm = Object.fromEntries(formData);

        axios
            .patch(route("users.update", userIdToEdit), newForm, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            }) // Asegúrate de que editData tenga el ID del usuario
            .then((response) => {
                toast.success("Usuario actualizado");
                closeEditModal(); // Cierra el modal después de editar
                Inertia.visit(route("users.index")); // Utiliza Inertia para actualizar la página
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
                setProcessing(false);
            });
    };

    // Configuración de los inputs para el modal
    const inputs = [
        {
            name: "name",
            type: "text",
            label: "Nombre",
            placeholder: "Ingrese nombre...",
            required: false,
            value: data.name,
            onChange: (e) => setData("name", e.target.value), // Actualiza el formulario
        },
        {
            name: "email",
            type: "email",
            label: "Correo electrónico",
            placeholder: "Ingrese correo...",
            required: false,
            value: data.email,
            onChange: (e) => setData("email", e.target.value), // Actualiza el formulario
        },
        {
            name: "password",
            type: "password",
            label: "Contraseña",
            placeholder: "Ingrese contraseña...",
            required: false,
            value: data.password,
            onChange: (e) => setData("password", e.target.value), // Actualiza el formulario
        },
        {
            name: "password_confirmation",
            type: "password",
            label: "Confirmar Contraseña",
            placeholder: "Confirme su contraseña...",
            required: false,
            value: data.password_confirmation,
            onChange: (e) => setData("password_confirmation", e.target.value), // Actualiza el formulario
        },
        {
            name: "role",
            type: "select",
            label: "Rol",
            placeholder: "Seleccione un rol...",
            required: true,
            defaultValue: data.role,
            onSelect: (value) => setData("role", value), // Actualiza el valor del select
            options: roles || [], // Lista de roles obtenidos del backend
            labelKey: "name", // Mostrar el nombre del rol
            valueKey: "id", // Utilizar el ID del rol como valor
        },
    ];

    const inputsEdit = [
        {
            name: "name",
            type: "text",
            label: "Nombre",
            placeholder: "Ingrese nombre...",
            required: false,
            value: data.name,
            onChange: (e) => setData("name", e.target.value), // Actualiza el estado de useForm
        },
        {
            name: "email",
            type: "email",
            label: "Correo electrónico",
            placeholder: "Ingrese correo...",
            required: false,
            value: data.email,
            onChange: (e) => setData("email", e.target.value), // Actualiza el estado de useForm
        },
        {
            name: "role",
            type: "select",
            label: "role",
            placeholder: "Seleccione un rol...",
            required: false,
            defaultValue: data.role,
            onSelect: (value) => {
                handleInputChange("role_id", value);
            },
            options: roles || [], // Lista de roles obtenidos del backend
            labelKey: "name", // Mostrar el nombre del rol
            valueKey: "id", // Utilizar el ID del rol como valor
        },
    ];

    const [selectedRows, setSelectedRows] = useState({});

    const handleCheckboxChange = (user) => {
        setSelectedRows((prev) => {
            const updatedRows = { ...prev };
            if (updatedRows[user.id]) {
                delete updatedRows[user.id];
            } else {
                updatedRows[user.id] = user;
            }
            return updatedRows;
        });
    };

    const areAllSelected =
        users.length > 0 && users.every((user) => selectedRows[user.id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};
        if (!areAllSelected) {
            users.forEach((user) => {
                newSelectedRows[user.id] = user;
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const selectedUsers = Object.values(selectedRows);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto pt-20 px-4 md:px-8">
                {/* Header Section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 sm:text-2xl">
                            Administración
                        </h3>
                        <p className="text-gray-600 mt-2">Usuarios</p>
                        {success && (
                            <div className="mt-2 text-sm text-green-600 font-medium">
                                {success}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {hasPermission("create.users") && (
                            <button
                                onClick={openModal}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <FaPlusCircle className="mr-2" />
                                <span>Agregar Usuario</span>
                            </button>
                        )}
                        <div className="flex justify-end">
                            {hasPermission("manage.export") && (
                                <ExportData
                                    data={selectedUsers}
                                    searchColumns={columnasexportar}
                                    headers={theadersexsportar}
                                    fileName="Usuarios"
                                />
                            )}
                        </div>
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
                                        Nombre
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell"
                                    >
                                        Correo
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell"
                                    >
                                        Fecha
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:table-cell"
                                    >
                                        Rol
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
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50"
                                        >
                                            {hasPermission("manage.export") && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                        checked={
                                                            !!selectedRows[
                                                            user.id
                                                            ]
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                user,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                                                <div className="text-sm text-gray-900">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-4 whitespace-nowrap md:table-cell">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-4 whitespace-nowrap lg:table-cell">
                                                <span className="inline-flex text-sm text-gray-900">
                                                    {user.roles &&
                                                        user.roles.length > 0
                                                        ? user.roles[0]
                                                            .role_name
                                                        : "Sin rol"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {hasPermission(
                                                        "view.users",
                                                    ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openViewModal(
                                                                        user,
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                                                                aria-label="Ver"
                                                            >
                                                                <View className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    {hasPermission(
                                                        "edit.users",
                                                    ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        user,
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                                aria-label="Editar"
                                                            >
                                                                <EditIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    {hasPermission(
                                                        "delete.users",
                                                    ) && (
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        user.id,
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
                                            colSpan="6"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No hay usuarios para mostrar
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
            {/* Modals */}
            <ModalCreate
                title="Crear Nuevo Usuario"
                showCreate={showCreate}
                closeModalCreate={closeModal}
                inputs={inputs}
                processing={processing}
                handleSubmitAdd={handleSubmitAdd}
            />

            {showDeleteModal && (
                <ModalDelete
                    title="Eliminar Usuario"
                    showDelete={showDeleteModal}
                    closeModalDelete={closeDeleteModal}
                    processing={processingDelete}
                    handleDelete={handleDelete}
                    itemToDelete="usuario"
                />
            )}

            <ModalEdit
                title="Editar Usuario"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                inputs={inputsEdit}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
            />

            <ModalView
                title="Visualizar Usuario"
                showView={showView}
                closeViewModal={closeViewModal}
                inputs={inputsEdit}
            />
            <ToastContainer />
        </div>
    );
}
