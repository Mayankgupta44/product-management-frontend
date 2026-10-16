
import type { FormEvent } from "react";
import Modal from "./Modal";

export type FormField = {
    name: string;
    label: string;
    type: "text" | "number" | "textarea" | "select";
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: string }[];
};

type EntityFormModalProps = {
    isOpen: boolean;
    title: string;
    submitLabel: string;
    fields: FormField[];
    values: Record<string, string>;
    error: string;
    saving: boolean;
    onChange: (name: string, value: string) => void;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function EntityFormModal({
                             isOpen,
                             title,
                             submitLabel,
                             fields,
                             values,
                             error,
                             saving,
                             onChange,
                             onClose,
                             onSubmit
                         }: EntityFormModalProps) {
    return (
        <Modal isOpen={isOpen} title={title} onClose={onClose}>
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                {fields.map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-gray-700"
                        >
                            {field.label}
                        </label>

                        {field.type === "select" ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={values[field.name] ?? ""}
                                    onChange={(event) => onChange(field.name, event.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Select {field.label}</option>
                                    {field.options?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === "textarea" ? (
                            <textarea
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={values[field.name] ?? ""}
                                // required={field.required}
                                onChange={(event) =>
                                    onChange(field.name, event.target.value)
                                }
                                rows={3}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        ) : (
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={values[field.name] ?? ""}
                                // required={field.required}
                                onChange={(event) =>
                                    onChange(field.name, event.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        )}
                    </div>
                ))}

                {error && (
                    <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <div className="mt-2 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : submitLabel}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default EntityFormModal;
