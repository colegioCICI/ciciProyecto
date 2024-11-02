import Modal from "../../../Components/Modal";
import FloatInputText from "../../../Components/FloatInputText";
import SearchDropdown from "../../../Components/SearchInput";
import SecondaryButton from "../../../Components/SecondaryButton";
import ComboBox from "../../../Components/ComboBox";

const ModalView = ({
    title,
    showView,
    closeViewModal,
    inputs,
}) => {
    return (
        <Modal show={showView} onClose={closeViewModal}>
            <form  className="p-6">
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
                                        value={input.value}
                                    />
                                ) : input.type === "combobox" ? (
                                    <ComboBox
                                        {...input}
                                        className="mt-3 block w-full"
                                        value={input.value}
                                    />
                                ) : (
                                    <FloatInputText
                                        {...input}
                                        isFocused={index === 0}
                                        className="mt-3 block w-full"
                                        value={input.value}
                                    />
                                )}
                                {input.inputError}
                            </div>
                        ))}
                </div>
                <div className="mt-6 flex justify-end">

                    <SecondaryButton onClick={closeViewModal}>
                        Cancelar
                    </SecondaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default ModalView;
