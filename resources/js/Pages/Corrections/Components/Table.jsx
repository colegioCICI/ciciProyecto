import React, { useState } from 'react';
import { usePage } from '@inertiajs/react'; // Importa el hook de Inertia
import { Inertia } from '@inertiajs/inertia'; // Importa Inertia desde el paquete correcto
import ModalCreate from './ModalCreate';
import ModalDelete from './ModalDelete'; // Importa el modal de eliminar
import ModalEdit from './ModalEdit'; // Importa el modal de eliminar
import axios from 'axios';

export default function Table() {
    const { corrections, success } = usePage().props; // Obtener los datos de la página de Inertia
    const [data, setData,] = useState({
        estado_corrección: "",
        fecha_corrección: "",
    });

    const [showCreate, setShowCreate] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [correctionIdToEdit, setCorrectionIdToEdit] = useState(null);
    const [processingEdit, setProcessingEdit] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar el modal de eliminación
    const [userIdToDelete, setUserIdToDelete] = useState(null); // Almacena el ID del usuario a eliminar
    const [processingDelete, setProcessingDelete] = useState(false); // Estado para el procesamiento de eliminación

    const openModal = () => {
        setShowCreate(true);
    };

    const closeModal = () => {
        setShowCreate(false);
    };

    const openDeleteModal = (correccionId) => {
        setUserIdToDelete(correccionId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setUserIdToDelete(null);
    };

    const openEditModal = (correction) => {
        setCorrectionIdToEdit(correction.correction_id);
        setData({
            estado_corrección: correction.estado_corrección,
            fecha_corrección: correction.fecha_corrección,
        });
        setShowEdit(true);
    };

    const closeEditModal = () => {
        setShowEdit(false);
    };

    //Funcion para eliminar un usuario

    const handleDelete = () => {
        setProcessingDelete(true);

        axios.delete(route('corrections.destroy', userIdToDelete))
            .then(response => {
                closeDeleteModal();
                Inertia.visit(route('corrections.index')); // Utiliza Inertia para actualizar la página
            })
            .catch(error => {
                console.error('Error al eliminar correccion:', error.response.data);
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

        axios.post(route('corrections.store'), formData)
            .then(response => {
                closeModal();
                Inertia.visit(route('corrections.index')); // Utiliza Inertia para actualizar la página
            })
            .catch(error => {
                console.error('Error al crear corrección:', error.response.data);
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    //Función para actualizar un usuario

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        setProcessingEdit(true);

        const formData = new FormData(e.target);
        const newForm = Object.fromEntries(formData);

        axios
            .put(route("corrections.update", correctionIdToEdit), newForm, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            })
            .then((response) => {
                closeEditModal();
                Inertia.visit(route("corrections.index"));
            })
            .catch((error) => {
                console.error(
                    "Error al actualizar la corrección:",
                    error.response.data,
                );
                // Aquí puedes manejar los errores, por ejemplo, mostrándolos en la UI
            })
            .finally(() => {
                setProcessingEdit(false);
            });
    };

    // Configuración de los inputs para el modal, incluyendo password_confirmation
    const inputs = [
        { name: 'fecha_corrección', type: 'date', label: 'Fecha', placeholder: 'Ingrese la fecha', required: true },
        { name: 'estado_corrección', type: 'text', label: 'Estado', placeholder: 'Ingrese el Estado', required: true },
    ];

    const inputsEdit = [
        {
            name: "fecha_corrección",
            type: "date",
            label: "Fecha",
            placeholder: "Titulo la fecha",
            required: true,
            value: data.fecha_corrección,
            onChange: (e) => setData({ ...data, fecha_corrección: e.target.value }), // Actualiza el estado
        },
        {
            name: "estado_corrección",
            type: "text",
            label: "Estado",
            placeholder: "Ingrese el estaod",
            required: true,
            value: data.estado_corrección,
            onChange: (e) => setData({ ...data, estado_corrección: e.target.value }), // Actualiza el estado
        },
        
    ];

    return (
        <div className="max-w-screen-xl mx-auto pt-5 px-4 md:px-8">
            <div className="items-start justify-between md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                        Correcciones
                    </h3>
                    <p className="text-gray-600 mt-2">Administracion</p>
                    {success && <div className="text-green-500 mt-2">{success}</div>} {/* Mostrar mensaje de éxito */}
                </div>
                <div className="mt-3 md:mt-0">
                    <button
                        onClick={openModal}
                        className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                    >
                        Agregar Carpeta
                    </button>
                </div>
            </div>

            <div className="mt-12 relative h-max overflow-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-300 text-gray-900 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">ID</th>
                            <th className="py-3 px-6">Propietario</th>
                            <th className="py-3 px-6">Fecha de Ingreso</th>
                            <th className="py-3 px-6">Estado</th>
                            <th className="py-3 px-6">Numero de Ingreso</th>
                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 divide-y">
                        {Array.isArray(corrections) && corrections.length > 0 ? (
                            corrections.map((correction) => (
                                <tr key={correction.correction_id} className="hover:bg-gray-200">
                                    <td className="px-6 py-4 whitespace-nowrap">{correction.correction_id} </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{correction.nombre_propietario}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(correction.fecha_corrección).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">{correction.estado_corrección}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">{correction.numero_ingreso}</td>
                                    <td className="text-right px-6 whitespace-nowrap">
                                        <button onClick={()=>{openEditModal(correction)}}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg cursor">
                                            Actualizar
                                        </button>
                                        <button 
                                            onClick={() => openDeleteModal(correction.correction_id)} // Abre el modal para eliminar
                                            className="py-2 leading-none px-6 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No hay usuarios para mostrar</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear usuario */}
            <ModalCreate
                title="Crear Observación"
                showCreate={showCreate}
                closeModalCreate={closeModal}
                inputs={inputs}
                processing={processing}
                handleSubmitAdd={handleSubmitAdd}
            />

            {/* Modal para eliminar usuario */}
            {showDeleteModal && (
                <ModalDelete 
                    title="Eliminar Usuario"
                    showDelete={showDeleteModal}
                    closeModalDelete={closeDeleteModal}
                    processing={processingDelete}
                    handleDelete={handleDelete}
                    itemToDelete="correccion"
                />
            )}

                <ModalEdit
                title="Editar Documento"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                inputs={inputsEdit}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
                />
        </div>
    );
}
