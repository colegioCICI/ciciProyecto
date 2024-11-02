import Modal from "../../../Components/Modal";
import FloatInputText from "../../../Components/FloatInputText";
import SearchDropdown from "../../../Components/SearchInput";
import SecondaryButton from "../../../Components/SecondaryButton";
import ComboBox from "../../../Components/ComboBox";
import CheckList from "../../../Components/CheckList";

const ModalView = ({
    title,
    showView,
    closeViewModal,
    inputs,
    selectedDocuments =[],
    onDocumentChange,
}) => {
    return (
        <Modal show={showView} onClose={closeViewModal}>
            <form className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {inputs &&
                        inputs.map((input, index) => (
                            <div key={index}>
                                {input.type === "select" ? (
                                    <SearchDropdown
                                        {...input}
                                        className="mt-3 block w-full"
                                    />
                                ) : input.type === "combobox" ? (
                                    <ComboBox
                                        {...input}
                                        className="mt-3 block w-full"
                                    />
                                ) : (
                                    <FloatInputText
                                        {...input}
                                        className="mt-3 block w-full"
                                    />
                                )}
                                {input.inputError && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {input.inputError}
                                    </p>
                                )}
                            </div>
                        ))}
                </div>
                <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Documentos asociados
                    </h4>
                    <CheckList
                        selectedDocuments={selectedDocuments} // Pasar documentos seleccionados
                        onDocumentChange={onDocumentChange} // Actualiza documentos seleccionados
                    />
                </div>
                <div className="mt-6 flex justify-end">
                
                    <SecondaryButton className="mx-3" onClick={closeViewModal}>
                        Cancelar
                    </SecondaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default ModalView;
