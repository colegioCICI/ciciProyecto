import Modal from "../../../Components/Modal";
import PrimaryButton from "../../../Components/PrimaryButton";
import SecondaryButton from "../../../Components/SecondaryButton";

const ModalDelete = ({
    title,
    showDelete,
    closeModalDelete,
    processing,
    handleDelete,
    itemToDelete,
}) => {
    return (
        <Modal show={showDelete} onClose={closeModalDelete}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-800">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">
                        ¿Estás seguro de que quieres eliminar este {itemToDelete}? Esta acción no se puede deshacer.
                    </p>
                </div>
                <div className="mt-6 flex justify-end">
                    <PrimaryButton
                        type="button"
                        className="ms-3"
                        disabled={processing}
                        onClick={handleDelete}
                    >
                        {processing ? 'Eliminando...' : 'Eliminar'}
                    </PrimaryButton>
                    <SecondaryButton className="ms-3" onClick={closeModalDelete}>
                        Cancelar
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default ModalDelete;