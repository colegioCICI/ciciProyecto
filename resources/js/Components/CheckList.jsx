import React, { useState, useEffect } from 'react';

const CheckList = ({ selectedDocuments = [], onDocumentChange }) => {
    // Tipos de documentos disponibles
    const documentTypes = [
        { name: "CD", key: "CD" },
        { name: "Memoria de Cálculo", key: "MC" },
        { name: "Estudios de Suelo", key: "ES" },
        { name: "Documento FPC", key: "FPC" },
        { name: "Documento FRT", key: "FRT" },
        { name: "Planos Arquitectonicos", key: "PA" },
        { name: "Planos Estructurales", key: "PE" },
    ];

    // Estado para manejar los documentos seleccionados
    const [selected, setSelected] = useState([]);

    // Sincronizar el estado inicial con los documentos seleccionados
    useEffect(() => {
        setSelected(selectedDocuments);
    }, [selectedDocuments]);

    // Manejar cambios de selección de documentos
    const handleChange = (e) => {
        const { value, checked } = e.target;
        const updatedSelected = checked
            ? [...selected, value] // Agregar documento si está marcado
            : selected.filter(doc => doc !== value); // Quitar documento si está desmarcado

        setSelected(updatedSelected);
        onDocumentChange(updatedSelected); // Notificar cambios al componente padre
    };

    return (
        <div className="space-y-4 pt-5 pl-1 grid grid-cols-2">
            {documentTypes.map((doc, index) => (
                <div key={index} className="flex items-center">
                    <input
                        type="checkbox"
                        id={doc.key}
                        value={doc.name}
                        onChange={handleChange}
                        checked={selected.includes(doc.name)} // Mostrar marcado si está en la lista seleccionada
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={doc.key} className="ml-2 text-gray-700">
                        {doc.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CheckList;
