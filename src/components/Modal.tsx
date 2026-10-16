
import type { ReactNode } from "react";

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

function Modal({ isOpen, title, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <section
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2
                        id="modal-title"
                        className="text-xl font-semibold text-gray-800"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="text-2xl leading-none text-gray-500 hover:text-gray-800"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {children}
            </section>
        </div>
    );
}

export default Modal;
