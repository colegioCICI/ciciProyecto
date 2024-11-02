import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react"; // Importa el hook de Inertia
import { Inertia } from "@inertiajs/inertia"; // Importa Inertia desde el paquete correcto
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalEdit from "./ModalEdit"; // Importa el modal de eliminar
import ModalView from "./ModalView"; // Importa el modal de vista
import EditIcon from "@/Icons/edit";
import View from "@/Icons/view";
import ExportData from "./ExportData";
import axios from "axios";

export default function Table() {
    const { facturas, usuariosRoles, logoCICI, success } = usePage().props; // Obtener los datos de la página de Inertia

    const { data, setData, post, reset } = useForm({
        fecha_factura: "",
        tramite_factura: "",
        direccion_inmueble: "",
        numero_factura: "",
        aprobacion: "",
        porcentaje_cici: "",
        microfilm: "",
        total: "",
        especie: "",
        formularios: "",
        valor_cobrado: "",
        tipo: "",
        nombre_propietario: "",
        cedula: "",
    });

    const theadersexsportar = [
        "FECHA",
        "Tramite N°",
        "NOMBRE DEL PROPIETARIO",
        "C.C. N° RUC",
        "DIRECCIÓN DEL INMUEBLE",
        "COMP. PAGO N°",
        "APROB.",
        "50%CICI",
        "MICRO",
        "TOTAL",
        "Espe. Proce.",
        " ",
        "Valor cobrado",
        "TIPO",
    ];
    const columnasexportar = [
        "fecha_factura",
        "tramite_factura",
        "nombre_propietario",
        "cedula",
        "direccion_inmueble",
        "numero_factura",
        "aprobacion",
        "porcentaje_cici",
        "microfilm",
        "total",
        "especie",
        "formularios",
        "valor_cobrado",
        "tipo",
    ];

    const columnWidths = {
        fecha_factura: 20,
        tramite_factura: 18,
        nombre_propietario: 28,
        cedula: 28,
        direccion_inmueble: 28,
        numero_factura: 20,
        aprobacion: 18,
        porcentaje_cici: 19,
        microfilm: 18,
        total: 18,
        especie: 15,
        formularios: 15,
        valor_cobrado: 18,
        tipo: 20,
    };

    // Estados posibles de la carpeta
    const estadosCarpeta = ["Observación", "Revisión", "Aprobado"];

    const [filteredFacturas, setFilteredFacturas] = useState(facturas);

    // Estados para manejar la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [facturasPerPage] = useState(10); // Cantidad de facturas por página

    // Calcular los índices de usuarios para la paginación
    const indexOfLastFactura = currentPage * facturasPerPage;
    const indexOfFirstFactura = indexOfLastFactura - facturasPerPage;
    const currentFacturas = filteredFacturas.slice(
        indexOfFirstFactura,
        indexOfLastFactura,
    );
    const totalPages = Math.max(
        1,
        Math.ceil(filteredFacturas.length / facturasPerPage),
    );

    // Funciones para cambiar de página
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const [processing, setProcessing] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [facturaIdToEdit, setFacturaIdToEdit] = useState(null);

    const [showView, setShowView] = useState(false);

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    const openEditModal = (factura) => {
        setShowEdit(true);
        setFacturaIdToEdit(factura.factura_id);
        setData({
            fecha_factura: factura.fecha_factura ?? "",
            tramite_factura: factura.tramite_factura ?? "",
            direccion_inmueble: factura.direccion_inmueble ?? "",
            numero_factura: factura.numero_factura ?? "",
            aprobacion: factura.aprobacion ?? "",
            porcentaje_cici: factura.porcentaje_cici ?? "",
            microfilm: factura.microfilm ?? "",
            total: factura.total ?? "",
            especie: factura.especie ?? "",
            formularios: factura.formularios ?? "",
            valor_cobrado: factura.valor_cobrado ?? "",
            tipo: factura.tipo ?? "",
            cedula: factura.cedula ?? "",
            nombre_propietario: factura.nombre_propietario ?? "",
        });
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setFacturaIdToEdit(null);
        setData({
            fecha_factura: "",
            tramite_factura: "",
            direccion_inmueble: "",
            numero_factura: "",
            aprobacion: "",
            porcentaje_cici: "",
            microfilm: "",
            total: "",
            especie: "",
            formularios: "",
            valor_cobrado: "",
            tipo: "",
            cedula: "",
            nombre_propietario: "",
        });
    };

    const openViewModal = (factura) => {
        setShowView(true);
        setFacturaIdToEdit(factura.factura_id);
        setData({
            fecha_factura: factura.fecha_factura ?? "",
            tramite_factura: factura.tramite_factura ?? "",
            direccion_inmueble: factura.direccion_inmueble ?? "",
            numero_factura: factura.numero_factura ?? "",
            aprobacion: factura.aprobacion ?? "",
            porcentaje_cici: factura.porcentaje_cici ?? "",
            microfilm: factura.microfilm ?? "",
            total: factura.total ?? "",
            especie: factura.especie ?? "",
            formularios: factura.formularios ?? "",
            valor_cobrado: factura.valor_cobrado ?? "",
            tipo: factura.tipo ?? "",
            cedula: factura.cedula ?? "",
            nombre_propietario: factura.nombre_propietario ?? "",
        });
    };

    const closeViewModal = () => {
        setShowView(false);
        setFacturaIdToEdit(null);
        setData({
            fecha_factura: "",
            tramite_factura: "",
            direccion_inmueble: "",
            numero_factura: "",
            aprobacion: "",
            porcentaje_cici: "",
            microfilm: "",
            total: "",
            especie: "",
            formularios: "",
            valor_cobrado: "",
            tipo: "",
            cedula: "",
            nombre_propietario: "",
        });
    };

    //Funcion para Editar un usuario
    const handleSubmitEdit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData(e.target);
        const newForm = Object.fromEntries(formData);

        axios
            .patch(route("facturas.update", facturaIdToEdit), newForm, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            }) // Asegúrate de que editData tenga el ID del usuario
            .then((response) => {
                toast.success("Factura actualizada");
                closeEditModal(); // Cierra el modal después de editar
                Inertia.visit(route("facturas.index")); // Utiliza Inertia para actualizar la página
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

    // Configuración de los inputs para el modal
    const inputsEdit = [
        {
            name: "fecha_factura",
            type: "date",
            label: "Fecha Factura",
            placeholder: "Ingrese la fecha...",
            required: false,
            value: data.fecha_factura ?? "",
            onChange: (e) => setData("fecha_factura", e.target.value), // Actualiza el formulario
        },
        {
            name: "tramite_factura",
            type: "number",
            label: "Numero Tramite",
            placeholder: "Ingrese el tramite...",
            required: false,
            value: data.tramite_factura ?? "",
            onChange: (e) => setData("tramite_factura", e.target.value), // Actualiza el formulario
        },
        {
            name: "direccion_inmueble",
            type: "text",
            label: "Dirección",
            placeholder: "Ingrese la dirección...",
            required: false,
            value: data.direccion_inmueble ?? "",
            onChange: (e) => setData("direccion_inmueble", e.target.value), // Actualiza el formulario
        },
        {
            name: "numero_factura",
            type: "text",
            label: "Numero Factura",
            placeholder: "Ingrese la factura...",
            required: false,
            value: data.numero_factura ?? "",
            onChange: (e) => setData("numero_factura", e.target.value), // Actualiza el formulario
        },
        {
            name: "aprobacion",
            type: "text",
            label: "Valor de Aprobación",
            placeholder: "Ingrese la aprobación...",
            required: false,
            value: data.aprobacion ?? "",
            onChange: (e) => setData("aprobacion", e.target.value), // Actualiza el formulario
        },
        {
            name: "microfilm",
            type: "text",
            label: "Valor de microfilm",
            placeholder: "Ingrese el microfilm...",
            required: false,
            value: data.microfilm ?? "",
            onChange: (e) => setData("microfilm", e.target.value), // Actualiza el formulario
        },

        {
            name: "especie",
            type: "text",
            label: "Valor de especie",
            placeholder: "Ingrese la especie...",
            required: false,
            value: data.especie ?? "",
            onChange: (e) => setData("especie", e.target.value), // Actualiza el formulario
        },
        {
            name: "formularios",
            type: "text",
            label: "Valor de formularios",
            placeholder: "Valor de formularios...",
            required: false,
            value: data.formularios ?? "",
            onChange: (e) => setData("formularios", e.target.value), // Actualiza el formulario
        },
        {
            name: "tipo",
            type: "text",
            label: "Tipo",
            placeholder: "Tipo...",
            required: false,
            value: data.tipo ?? "",
            onChange: (e) => setData("tipo", e.target.value), // Actualiza el formulario
        },
    ];

    const inputsView = [
        {
            name: "fecha_factura",
            type: "date",
            label: "Fecha Factura",
            placeholder: "Ingrese la fecha...",
            required: true,
            value: data.fecha_factura ?? "",
            onChange: (e) => setData("fecha_factura", e.target.value), // Actualiza el formulario
        },
        {
            name: "tramite_factura",
            type: "number",
            label: "Tramite Numero",
            placeholder: "Ingrese el tramite...",
            required: true,
            value: data.tramite_factura ?? "",
            onChange: (e) => setData("tramite_factura", e.target.value), // Actualiza el formulario
        },
        {
            name: "direccion_inmueble",
            type: "text",
            label: "Dirección",
            placeholder: "Ingrese la dirección...",
            required: true,
            value: data.direccion_inmueble ?? "",
            onChange: (e) => setData("direccion_inmueble", e.target.value), // Actualiza el formulario
        },
        {
            name: "numero_factura",
            type: "text",
            label: "Numero Factura",
            placeholder: "Ingrese la factura...",
            required: true,
            value: data.numero_factura ?? "",
            onChange: (e) => setData("numero_factura", e.target.value), // Actualiza el formulario
        },
        {
            name: "aprobacion",
            type: "text",
            label: "Valor de Aprobación",
            placeholder: "Ingrese la aprobación...",
            required: true,
            value: data.aprobacion ?? "",
            onChange: (e) => setData("aprobacion", e.target.value), // Actualiza el formulario
        },
        {
            name: "porcentaje_cici",
            type: "text",
            label: "Porcentaje CICI",
            placeholder: "Aprobación...",
            required: true,
            value: data.porcentaje_cici ?? "",
            onChange: (e) => setData("porcentaje_cici", e.target.value), // Actualiza el formulario
        },
        {
            name: "microfilm",
            type: "text",
            label: "Valor de microfilm",
            placeholder: "Ingrese el microfilm...",
            required: true,
            value: data.microfilm ?? "",
            onChange: (e) => setData("microfilm", e.target.value), // Actualiza el formulario
        },
        {
            name: "total",
            type: "text",
            label: "Total",
            placeholder: "Total...",
            required: true,
            value: data.total ?? "",
            onChange: (e) => setData("total", e.target.value), // Actualiza el formulario
        },
        {
            name: "especie",
            type: "text",
            label: "Valor de especie",
            placeholder: "Ingrese la especie...",
            required: true,
            value: data.especie ?? "",
            onChange: (e) => setData("especie", e.target.value), // Actualiza el formulario
        },
        {
            name: "formularios",
            type: "text",
            label: "Valor de formularios",
            placeholder: "Valor de formularios...",
            required: true,
            value: data.formularios ?? "",
            onChange: (e) => setData("formularios", e.target.value), // Actualiza el formulario
        },
        {
            name: "valor_cobrado",
            type: "text",
            label: "Valor cobrado",
            placeholder: "Valor cobrado...",
            required: true,
            value: data.valor_cobrado ?? "",
            onChange: (e) => setData("valor_cobrado", e.target.value), // Actualiza el formulario
        },
        {
            name: "tipo",
            type: "text",
            label: "Tipo",
            placeholder: "Tipo...",
            required: true,
            value: data.tipo ?? "",
            onChange: (e) => setData("tipo", e.target.value), // Actualiza el formulario
        },
        {
            name: "nombre_propietario",
            type: "text",
            label: "Propietario",
            placeholder: "Propietario...",
            required: true,
            value: data.nombre_propietario ?? "",
            onChange: (e) => setData("nombre_propietario", e.target.value),
        },
        {
            name: "cedula",
            type: "text",
            label: "Cedula",
            placeholder: "Cedula ...",
            required: true,
            value: data.cedula ?? "",
            onChange: (e) => setData("cedula", e.target.value),
        },
    ];

    const [selectedEstado, setSelectedEstado] = useState("");
    const [selectedRows, setSelectedRows] = useState({});

    const handleCheckboxChange = (factura) => {
        setSelectedRows((prev) => {
            const updatedRows = { ...prev };
            if (updatedRows[factura.factura_id]) {
                delete updatedRows[factura.factura_id];
            } else {
                updatedRows[factura.factura_id] = factura;
            }
            return updatedRows;
        });
    };

    const areAllSelected =
        filteredFacturas.length > 0 &&
        filteredFacturas.every((factura) => selectedRows[factura.factura_id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};

        if (!areAllSelected) {
            // Filtramos las facturas según el rango de fechas y el estado seleccionado
            const filteredFacturas = facturas.filter((factura) => {
                const facturaDate = new Date(factura.fecha_factura);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                // Comprobamos que la factura esté dentro del rango de fechas especificado
                if (start && facturaDate < start) return false;
                if (end && facturaDate > end) return false;

                // Comprobamos que la factura tenga el estado seleccionado
                if (estadoCarpeta && factura.estado_carpeta !== estadoCarpeta)
                    return false;

                return true;
            });

            // Seleccionamos solo las facturas filtradas
            filteredFacturas.forEach((factura) => {
                newSelectedRows[factura.factura_id] = factura;
            });
        }

        setSelectedRows(newSelectedRows);
    };

    const selectedFacturas = Object.values(selectedRows);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [estadoCarpeta, setEstadoCarpeta] = useState(""); // Nuevo estado para el estado de la carpeta

    // Filtro de fechas y estado
    const handleFilter = () => {
        const filtered = facturas.filter((factura) => {
            const facturaDate = new Date(factura.fecha_factura);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            // Verificar el estado de la carpeta
            const estadoMatch = estadoCarpeta
                ? factura.estado_carpeta === estadoCarpeta
                : true;

            if (start && facturaDate < start) return false;
            if (end && facturaDate > end) return false;

            return estadoMatch;
        });

        setFilteredFacturas(filtered);
        setCurrentPage(1); // Reinicia la página al aplicar un filtro
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Administración
                        </h1>
                        <p className="text-gray-600">Facturas</p>
                    </div>

                    {/* Export Button */}
                    <div className="flex justify-end">
                        {hasPermission("manage.export") && (
                            <ExportData
                                data={selectedFacturas}
                                searchColumns={columnasexportar}
                                headers={theadersexsportar}
                                fileName="Facturas"
                                columnWidths={columnWidths}
                            />
                        )}
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                        <label
                            htmlFor="start-date"
                            className="text-sm font-medium text-gray-700"
                        >
                            Desde
                        </label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label
                            htmlFor="end-date"
                            className="text-sm font-medium text-gray-700"
                        >
                            Hasta
                        </label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label
                            htmlFor="estado"
                            className="text-sm font-medium text-gray-700"
                        >
                            Estado Carpeta
                        </label>
                        <select
                            id="estado"
                            value={estadoCarpeta}
                            onChange={(e) => setEstadoCarpeta(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            {estadosCarpeta.map((estado) => (
                                <option key={estado} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleFilter}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Filtrar
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {hasPermission("manage.export") && (
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left"
                                        >
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                onChange={
                                                    handleHeaderCheckboxChange
                                                }
                                                checked={areAllSelected}
                                            />
                                        </th>
                                    )}
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Fecha
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                                    >
                                        Trámite
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-sm font-semibold text-gray-900 md:table-cell"
                                    >
                                        Propietario
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Porcentaje CICI
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Estado Carpeta
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
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {currentFacturas.length > 0 ? (
                                    currentFacturas.map((factura) => (
                                        <tr
                                            key={factura.factura_id}
                                            className="hover:bg-gray-50"
                                        >
                                            {hasPermission("manage.export") && (
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        checked={
                                                            !!selectedRows[
                                                                factura
                                                                    .factura_id
                                                            ]
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                factura,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {factura.fecha_factura}
                                            </td>
                                            <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-900 sm:table-cell">
                                                <div className="max-w-[150px] truncate">
                                                    {factura.tramite_factura}
                                                </div>
                                            </td>
                                            <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-900 md:table-cell">
                                                <div className="max-w-[150px] truncate">
                                                    {factura.nombre_propietario}
                                                </div>
                                            </td>
                                            <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-900 lg:table-cell">
                                                <div className="max-w-[150px] truncate">
                                                    {factura.porcentaje_cici}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {factura.estado_carpeta}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <div className="flex justify-end space-x-2">
                                                    {hasPermission(
                                                        "view.facturas",
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                openViewModal(
                                                                    factura,
                                                                )
                                                            }
                                                            className="rounded p-1 text-green-600 hover:bg-gray-100 hover:text-green-900"
                                                        >
                                                            <View className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {hasPermission(
                                                        "edit.facturas",
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    factura,
                                                                )
                                                            }
                                                            className="rounded p-1 text-blue-600 hover:bg-gray-100 hover:text-blue-900"
                                                        >
                                                            <EditIcon className="h-5 w-5" />
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
                                            No se encontraron facturas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col items-center justify-between space-y-4 px-4 sm:flex-row sm:space-y-0">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
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
                        className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            <ModalEdit
                title="Actualizar Factura"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                inputs={inputsEdit}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
            />

            <ModalView
                title="Datos de la Factura"
                showView={showView}
                closeViewModal={closeViewModal}
                inputs={inputsView} // Inputs necesarios como nombre de usuario, propietario, etc.
            />
            <ToastContainer />
        </div>
    );
}
