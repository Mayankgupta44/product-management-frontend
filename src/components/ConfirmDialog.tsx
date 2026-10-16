
import Modal from "./Modal";

type ConfirmDialogProps = {
    isOpen: boolean;
    itemName: string;
    onCancel: () => void;
    onConfirm: () => void;
    deleting: boolean;
};

function ConfirmDialog({
                           isOpen,
                           itemName,
                           onCancel,
                           onConfirm,
                           deleting
                       }: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} title="Confirm Delete" onClose={onCancel}>
            <p className="text-sm text-gray-700">
                Are you sure you want to delete{" "}
                <strong>{itemName}</strong>?
            </p>

            <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    onClick={onCancel}
                    disabled={deleting}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={onConfirm}
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;
