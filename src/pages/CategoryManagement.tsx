import {useEffect, useState, type FormEvent} from "react";
import type {Category} from "../types/Category";
import {createCategory, updateCategory, deleteCategory} from "../services/categoryService";
import EntityFormModal, {type FormField} from "../components/EntityFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {useManagement} from "../context/ManagementContext";
import {Pencil, Trash2} from "lucide-react";

const categoryFields: FormField[] = [
    {
        name: "name",
        label: "Category Name",
        type: "text",
        placeholder: "Enter category name",
        required: true
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter category description"
    }
];

const emptyForm = {
    name: "",
    description: ""
};

function CategoryManagement() {
    const {
        categories,
        products,
        loading,
        error: contextError,
        addCategory,
        updateCategoryInContext,
        removeCategory
    } = useManagement();

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>(emptyForm);

    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const hasProducts = (categoryId: number) =>
        products.some((product) => product.categoryId === categoryId);

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [message]);

    const openCreateModal = () => {
        setEditingId(null);
        setFormValues({...emptyForm});
        setError("");
        setFormOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingId(category.id);
        setFormValues({
            name: category.name,
            description: category.description ?? ""
        });
        setError("");
        setFormOpen(true);
    };

    const closeFormModal = () => {
        if (saving) return;

        setFormOpen(false);
        setEditingId(null);
        setFormValues({...emptyForm});
        setError("");
    };

    const handleFieldChange = (name: string, value: string) => {
        setFormValues((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        const trimmedName = formValues.name.trim();

        if (!trimmedName) {
            setError("Category name is required.");
            return;
        }

        const duplicateCategory = categories.some(
            (category) =>
                category.id !== editingId &&
                category.name.trim().toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicateCategory) {
            setError("Category already exists.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const data = {
                name: trimmedName,
                description: formValues.description.trim()
            };

            if (editingId !== null) {
                const updatedCategory = await updateCategory(editingId, data);

                updateCategoryInContext(updatedCategory);
                setMessage("Category updated successfully.");
            } else {
                const createdCategory = await createCategory(data);

                addCategory(createdCategory);
                setMessage("Category created successfully.");
            }

            setFormOpen(false);
            setEditingId(null);
            setFormValues({...emptyForm});
        } catch {
            setError(
                "Operation failed. Check the category name and try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        setError("");
        setMessage("");

        try {
            await deleteCategory(deleteTarget.id);

            removeCategory(deleteTarget.id);
            setDeleteTarget(null);
            setMessage("Category deleted successfully.");
        } catch {
            setError("Failed to delete category.");
        } finally {
            setDeleting(false);
        }
    };


    return (
        <div className="space-y-5">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                        Category Management
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Organize and manage your product categories.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                    <span className="text-lg leading-none">+</span>
                    Add Category
                </button>
            </header>

            {message && (
                <p
                    role="status"
                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
                >
                    {message}
                </p>
            )}

            {contextError && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {contextError}
                </p>
            )}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            Categories
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            View and manage all available categories.
                        </p>
                    </div>

                    <span
                        className="mt-2 w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 sm:mt-0">
                        {categories.length} {categories.length === 1 ? "category" : "categories"}
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-3 px-5 py-12 text-sm text-slate-500">
                        <span
                            className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700"/>
                        Loading categories...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="px-5 py-12 text-center sm:px-6">
                        <div
                            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.7}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
                                />
                            </svg>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-800">
                            No categories yet
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                            Create your first category to get started.
                        </p>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        >
                            Add your first category
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                                    ID
                                </th>
                                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                                    Category Name
                                </th>
                                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                                    Description
                                </th>
                                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    <td className="whitespace-nowrap px-5 py-4 text-slate-500 sm:px-6">
                                        {category.id}
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-slate-800 sm:px-6">
                                        {category.name}
                                    </td>

                                    <td className="max-w-sm px-5 py-4 text-slate-600 sm:px-6">
                                        <p className="line-clamp-2">
                                            {category.description || "-"}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 sm:px-6">
                                        <div className="flex flex-col items-start gap-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    title="Edit category"
                                                    aria-label={`Edit ${category.name}`}
                                                    onClick={() => openEditModal(category)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                >
                                                    <Pencil size={16}/>
                                                </button>

                                                <button
                                                    type="button"
                                                    title={
                                                        hasProducts(category.id)
                                                            ? "Cannot delete a category that has products."
                                                            : "Delete category"
                                                    }
                                                    aria-label={`Delete ${category.name}`}
                                                    disabled={hasProducts(category.id)}
                                                    onClick={() => {
                                                        if (hasProducts(category.id)) return;

                                                        setError("");
                                                        setMessage("");
                                                        setDeleteTarget(category);
                                                    }}
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-red-600 transition hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>

                                            {hasProducts(category.id) && (
                                                <p className="max-w-52 text-xs leading-5 text-slate-500">
                                                    Products are linked to this category.
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <EntityFormModal
                isOpen={formOpen}
                title={editingId !== null ? "Edit Category" : "Create Category"}
                submitLabel={editingId !== null ? "Save Changes" : "Create Category"}
                fields={categoryFields}
                values={formValues}
                error={error}
                saving={saving}
                onChange={handleFieldChange}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                itemName={deleteTarget?.name ?? ""}
                onCancel={() => {
                    if (!deleting) setDeleteTarget(null);
                }}
                onConfirm={handleDelete}
                deleting={deleting}
            />
        </div>
    );
}

export default CategoryManagement;
