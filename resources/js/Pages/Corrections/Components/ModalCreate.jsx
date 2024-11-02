import Modal from "../../../Components/Modal";
import FloatInputText from "../../../Components/FloatInputText";
import SearchDropdown from "../../../Components/SearchInput";
import SecondaryButton from "../../../Components/SecondaryButton";
import PrimaryButton from "../../../Components/PrimaryButton";
import ComboBox from "../../../Components/ComboBox";
import { useState } from "react";
import axios from "axios";

const ModalCreate = ({
    title,
    showCreate,
    closeModalCreate,
    inputs,
    processing,
    handleSubmitAdd, // Pasamos esta función desde el componente padre
}) => {
    return (
        <Modal show={showCreate} onClose={closeModalCreate}>
            <form onSubmit={handleSubmitAdd} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-800">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
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
                                {input.inputError}
                            </div>
                        ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <PrimaryButton type="submit" className="ms-3" disabled={processing}>
                        Guardar
                    </PrimaryButton>
                    
                    <SecondaryButton className="ms-3" onClick={closeModalCreate}>
                        Cancelar
                    </SecondaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default ModalCreate;
