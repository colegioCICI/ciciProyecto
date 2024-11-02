import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react"; // Asegúrate de solo usar useForm de @inertiajs/react
import { Inertia } from "@inertiajs/inertia"; // Importa Inertia desde @inertiajs/inertia
import ModalCreate from "../Pages/Notifications/Components/ModalCreate";
import InputError from "@/Components/InputError";

const EmailModal = ({ showCreateEmail, closeModalCreateEmail, folders }) => {
    const [selectedFolder, setSelectedFolder] = useState(null);

    // Obtenemos la fecha de hoy en formato 'YYYY-MM-DD'
    const todayDate = new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        folder_id: "",
        mensaje: "",
        fecha_envio: todayDate, // Fecha de hoy por defecto
        email_propietario: "",
        email_ingeniero: "",
    });

    useEffect(() => {
        if (selectedFolder) {
            setData((prevData) => ({
                ...prevData,
                email_propietario: selectedFolder.email_propietario || "",
                email_ingeniero: selectedFolder.email_ingeniero || "",
            }));
        }
    }, [selectedFolder]);

    const handleInputChange = (field, value) => {
        setData(field, value);
        if (field === "folder_id") {
            const folder = folders.find((f) => f.folder_id === value);
            setSelectedFolder(folder);
        }
    };

    const inputsEmail = [
        {
            name: "folder_id",
            type: "select",
            label: "Trámite",
            placeholder: "Seleccione un trámite...",
            required: true,
            value: data.folder_id || "",
            className: "",
            options: folders,
            labelKey: "tramite",
            valueKey: "folder_id",
            onSelect: (value) => handleInputChange("folder_id", value),
        },
        {
            name: "fecha_envio",
            type: "date",
            label: "Fecha de Envío",
            placeholder: "Ingrese una fecha válida...",
            required: true,
            value: data.fecha_envio, // Valor inicial configurado con la fecha actual
            onChange: (e) => handleInputChange("fecha_envio", e.target.value),
        },
        {
            label: "Mensaje",
            id: "mensaje",
            type: "textarea",
            name: "mensaje",
            value: data.mensaje,
            onChange: (e) => setData("mensaje", e.target.value),
            inputError: (
                <InputError message={errors.mensaje} className="mt-2" />
            ),
        },
    ];

    const handleSubmitAddEmail = (e) => {
        e.preventDefault();
        post(route("send.email"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreateEmail();
                reset();
                // Redireccionar a la ruta notifications.index usando Inertia
                Inertia.visit(route("notifications.index")); // Redirigir a notifications.index
            },
            onError: (errors) => {
                console.error("Errores de validación:", errors);
            },
            onFinish: () => {
                console.log("La solicitud ha finalizado");
            },
        });
    };

    return (
        <ModalCreate
            showCreate={showCreateEmail}
            closeModalCreate={closeModalCreateEmail}
            title={"Enviar email"}
            inputs={inputsEmail}
            processing={processing}
            handleSubmitAdd={handleSubmitAddEmail}
        >
            {selectedFolder && (
                <div className="mt-4">
                    <p>Email del propietario: {data.email_propietario || "No disponible"}</p>
                    <p>Email del ingeniero: {data.email_ingeniero || "No disponible"}</p>
                </div>
            )}
        </ModalCreate>
    );
};

export default EmailModal;
