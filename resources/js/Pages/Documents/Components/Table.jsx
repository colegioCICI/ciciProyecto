import React, { useState, useEffect, useRef } from "react";
import { usePage, Link, router } from "@inertiajs/react"; // Cambiado a router en lugar de useForm
import SearchInput from "@/Components/SearchInput";
import ExportData from "@/Components/ExportData";
import ReviewIcon from "@/Icons/review";
import { FaUpload } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
export default function Table() {
    const { documents, folders, usuariosRoles, logoCICI, success } =
        usePage().props;
    const [data, setData] = useState({
        tipo_documento: "",
        fecha_subida: "",
        document_id: "",
        archivo: "",
    });
    // Referencias para los inputs de archivo
    const fileInputRefs = useRef({});

    // Estado para mostrar el archivo que se está cargando
    const [uploadingState, setUploadingState] = useState({});

    const theadersexsportar = [
        "Tramite",
        "Propietario",
        "Tipo de Documento",
        "Ingreso",
        "Responsable",
    ];
    const columnasexportar = [
        "tramite",
        "nombre_propietario",
        "tipo_documento",
        "fecha_subida",
        "nombre_usuario",
    ];

    const [documentSearch, setDocumentSearch] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        if (documents && documents.length > 0) {
            setDocumentSearch(documents);
            setFilteredDocuments(documents);
        }
    }, [documents]);


    // useEffect para detectar cuando los documentos han sido actualizados
    useEffect(() => {}, [documentSearch]);

    const [filteredFolders, setFilteredFolders] = useState(folders);

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

    // Aplanar la estructura anidada de carpetas y documentos
    const allDocuments = filteredFolders.flatMap((folder) =>
        folder.documents.map((document) => ({
            ...document,
            nombre_propietario: folder.nombre_propietario,
            nombre_usuario: folder.nombre_usuario,
            tramite: folder.tramite,
            archivo: document.archivo,
        })),
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allDocuments.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.max(
        1,
        Math.ceil(allDocuments.length / itemsPerPage),
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
    const handleCheckboxChange = (document) => {
        setSelectedRows((prev) => {
            // Copiamos el estado previo
            const updatedRows = { ...prev };

            // Si el documento ya está seleccionado, lo quitamos
            if (updatedRows[document.document_id]) {
                delete updatedRows[document.document_id];
            } else {
                // Si no está seleccionado, lo agregamos usando su document_id como clave
                updatedRows[document.document_id] = document;
            }

            return updatedRows;
        });
    };

    const areAllSelected =
        currentItems.length > 0 &&
        currentItems.every((item) => selectedRows[item.document_id]);

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = {};

        if (!areAllSelected) {
            // Agregar todos los documentos completos en `currentItems` al estado
            currentItems.forEach((item) => {
                newSelectedRows[item.document_id] = item;
            });
        }

        setSelectedRows(newSelectedRows);
    };

    const selectedDocuments = Object.values(selectedRows);

    // Función para manejar la selección y carga inmediata de archivos
    const handleFileChange = (document_id, e) => {
        const file = e.target.files[0];

        if (file) {
            // Actualizar el estado de carga para mostrar un indicador
            setUploadingState((prev) => ({
                ...prev,
                [document_id]: {
                    uploading: true,
                    fileName: file.name,
                },
            }));

            // Crear un objeto FormData para enviar el archivo
            const formData = new FormData();
            formData.append("file", file);
            formData.append("document_id", document_id);

            // Enviar el archivo directamente usando router de Inertia
            router.post(route("documents.uploadFile"), formData, {
                onSuccess: () => {
                    // Actualizar estado cuando la carga es exitosa
                    setUploadingState((prev) => ({
                        ...prev,
                        [document_id]: {
                            uploading: false,
                            fileName: file.name,
                            success: true,
                        },
                    }));

                    // Limpiar el mensaje de éxito después de 3 segundos
                    setTimeout(() => {
                        setUploadingState((prev) => {
                            const newState = { ...prev };
                            if (newState[document_id]) {
                                newState[document_id].success = false;
                            }
                            return newState;
                        });
                    }, 3000);
                    window.location.reload(); 
                },
                onError: (errors) => {
                    // Actualizar estado cuando hay un error
                    setUploadingState((prev) => ({
                        ...prev,
                        [document_id]: {
                            uploading: false,
                            fileName: file.name,
                            error: errors.file || "Error al subir el archivo",
                        },
                    }));
                },
                preserveScroll: true,
            });
        }
    };

    const getFileUrl = (documentId) => {
        return route("documents.view-file", documentId);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto pt-20 px-4 md:px-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div className="max-w-lg mb-4 md:mb-0">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            Documentos
                        </h3>
                        <p className="text-gray-600 mt-2">Administración</p>
                        {success && (
                            <div className="text-green-500 mt-2">{success}</div>
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
                                data={selectedDocuments}
                                searchColumns={columnasexportar}
                                headers={theadersexsportar}
                                fileName="Documentos"
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
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                            Propietario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                            Tipo de Documento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                            Ingreso
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                                            Responsable
                                        </th>
                                        {/* Nueva columna para archivos */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Archivo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ver Archivo
                                        </th>
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">
                                                Acciones
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.length > 0 ? (
                                        currentItems.map((document, index) => (
                                            <tr
                                                key={`${document.document_id}-${index}`}
                                                className="hover:bg-gray-50"
                                            >
                                                {hasPermission(
                                                    "manage.export",
                                                ) && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                            checked={
                                                                !!selectedRows[
                                                                    document
                                                                        .document_id
                                                                ]
                                                            }
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    document,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                        {document.tramite ||
                                                            "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                    <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                        {document.nombre_propietario ||
                                                            "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                    <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                        {document.tipo_documento ||
                                                            "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                    <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                        {document.fecha_subida}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                                                    <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                                        {document.nombre_usuario ||
                                                            "N/A"}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col space-y-2">
                                                        {/* Input para subir archivo */}
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                id={`file-${document.document_id}`}
                                                                ref={(el) =>
                                                                    (fileInputRefs.current[
                                                                        document.document_id
                                                                    ] = el)
                                                                }
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) =>
                                                                    handleFileChange(
                                                                        document.document_id,
                                                                        e,
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`file-${document.document_id}`}
                                                                className={`cursor-pointer text-xs px-3 py-1.5 rounded font-medium ${
                                                                    document.archivo
                                                                        ? "bg-blue-50 hover:bg-blue-100 text-blue-700"
                                                                        : "bg-green-50 hover:bg-green-100 text-green-700"
                                                                }`}
                                                            >
                                                                {<FaUpload />}
                                                            </label>
                                                        </div>

                                                        {/* Mostrar estado de la carga */}
                                                        {uploadingState[
                                                            document.document_id
                                                        ] && (
                                                            <div className="text-xs">
                                                                {uploadingState[
                                                                    document
                                                                        .document_id
                                                                ].uploading ? (
                                                                    <div className="flex items-center text-amber-600">
                                                                        <svg
                                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-600"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <circle
                                                                                className="opacity-25"
                                                                                cx="12"
                                                                                cy="12"
                                                                                r="10"
                                                                                stroke="currentColor"
                                                                                strokeWidth="4"
                                                                            ></circle>
                                                                            <path
                                                                                className="opacity-75"
                                                                                fill="currentColor"
                                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                            ></path>
                                                                        </svg>
                                                                        Subiendo...
                                                                    </div>
                                                                ) : uploadingState[
                                                                      document
                                                                          .document_id
                                                                  ].error ? (
                                                                    <div className="text-red-600">
                                                                        Error
                                                                    </div>
                                                                ) : uploadingState[
                                                                      document
                                                                          .document_id
                                                                  ].success ? (
                                                                    <div className="text-green-600">
                                                                        ¡Correcto!
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {document.archivo ? (
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    (window.location.href =
                                                                        getFileUrl(
                                                                            document.document_id,
                                                                        ))
                                                                }
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Descargar archivo"
                                                            >
                                                                <FaEye className="w-5 h-5" />
                                                            </button>
                                                            <span
                                                                className="text-sm truncate max-w-[60px]"
                                                                title={
                                                                    document.archivo
                                                                }
                                                            >
                                                                {document.archivo
                                                                    .split("\\")
                                                                    .pop()}{" "}
                                                                {/* Extrae solo el nombre del archivo */}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <FaEye className="w-5 h-5 text-gray-300 cursor-not-allowed" />
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {hasPermission(
                                                        "view.reviews",
                                                    ) && (
                                                        <Link
                                                            href={route(
                                                                "reviews.show",
                                                                document.document_id,
                                                            )}
                                                            className="flex items-center justify-center p-2 text-xl font-medium text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full"
                                                        >
                                                            <ReviewIcon />
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9" // Actualizado para incluir la nueva columna
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No hay documentos para mostrar
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
        </div>
    );
}
