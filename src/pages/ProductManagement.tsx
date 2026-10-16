import {useEffect, useState, type FormEvent} from "react";
import type {Product, ProductRequest} from "../types/Product";
import {createProduct, updateProduct, deleteProduct} from "../services/productService";
import EntityFormModal, {type FormField} from "../components/EntityFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {useManagement} from "../context/ManagementContext";
import {Pencil, Trash2} from "lucide-react";

const emptyForm = {
    name: "",
    price: "",
    categoryId: ""
};

function ProductManagement() {
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>({...emptyForm});

    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [formError, setFormError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [message, setMessage] = useState("");

    const {
        products,
        categories,
        loading,
        error: pageError,
        addProduct,
        updateProductInContext,
        removeProduct
    } = useManagement();

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [message]);

    const productFields: FormField[] = [
        {
            name: "name",
            label: "Product Name",
            type: "text",
            placeholder: "Enter product name"
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            placeholder: "Enter price"
        },
        {
            name: "categoryId",
            label: "Category",
            type: "select",
            options: categories.map((category) => ({
                label: category.name,
                value: String(category.id)
            }))
        }
    ];

    const openCreateModal = () => {
        setEditingId(null);
        setFormValues({...emptyForm});
        setFormError("");
        setFormOpen(true);
    };


    const openEditModal = (product: Product) => {
        setEditingId(product.id);
        setFormValues({
            name: product.name ?? "",
            price: product.price == null ? "" : String(product.price),
            categoryId: product.categoryId == null
                ? ""
                : String(product.categoryId)
        });
        setFormError("");
        setFormOpen(true);
    };

    const closeFormModal = () => {
        if (saving) return;

        setFormOpen(false);
        setEditingId(null);
        setFormValues({...emptyForm});
        setFormError("");
    };

    const handleFieldChange = (name: string, value: string) => {
        setFormValues((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setFormError("");

        const name = (formValues.name ?? "").trim();
        const priceValue = String(formValues.price ?? "");
        const price = Number(priceValue);
        const categoryId = Number(formValues.categoryId);

        if (!name) {
            setFormError("Product name is required.");
            return;
        }

        if (name.length < 3 || name.length > 50) {
            setFormError(
                "Product name must be between 3 and 50 characters."
            );
            return;
        }

        if (!priceValue.trim()) {
            setFormError("Price is required.");
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            setFormError("Price must be greater than zero.");
            return;
        }

        if (!formValues.categoryId || !Number.isInteger(categoryId)) {
            setFormError("Please select a category.");
            return;
        }

        const data: ProductRequest = {
            name,
            price,
            categoryId
        };

        setSaving(true);
        setMessage("");

        try {
            if (editingId !== null) {
                const updatedProduct = await updateProduct(editingId, data);

                updateProductInContext(updatedProduct);
                setMessage("Product updated successfully.");
            } else {
                const createdProduct = await createProduct(data);

                addProduct(createdProduct);
                setMessage("Product created successfully.");
            }

            setFormOpen(false);
            setEditingId(null);
            setFormValues({...emptyForm});
        } catch {
            setFormError(
                "Operation failed. Check the product details and try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        setMessage("");
        setDeleteError("");

        try {
            await deleteProduct(deleteTarget.id);

            removeProduct(deleteTarget.id);
            setDeleteTarget(null);
            setMessage("Product deleted successfully.");
        } catch {
            setDeleteError("Failed to delete product.");
        } finally {
            setDeleting(false);
        }
    };


    return (
        <div className="space-y-5">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                        Product Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage products, prices, and their categories.
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={openCreateModal}
                >
                    <span className="text-lg leading-none">+</span>
                    Add Product
                </button>
            </header>

            {message && (
                <p
                    role="status"
                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                    {message}
                </p>
            )}

            {pageError && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {pageError}
                </p>
            )}

            {deleteError && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {deleteError}
                </p>
            )}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">
                            Products
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            View and manage all available products.
                        </p>
                    </div>

                    <span
                        className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {products.length}{" "}
                        {products.length === 1 ? "product" : "products"}
                </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-3 px-5 py-12 text-sm text-slate-500">
                        <span
                            className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"/>
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center px-5 py-12 text-center">
                        <div
                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="m12 3 9 5-9 5-9-5 9-5Z"/>
                                <path d="m3 12 9 5 9-5"/>
                                <path d="m3 16 9 5 9-5"/>
                            </svg>
                        </div>

                        <h3 className="text-base font-semibold text-slate-800">
                            No products found
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            Get started by adding your first product to the system.
                        </p>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <span className="text-lg leading-none">+</span>
                            Add your first product
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead
                                className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-5 py-3.5 font-semibold sm:px-6">
                                    ID
                                </th>
                                <th className="px-5 py-3.5 font-semibold sm:px-6">
                                    Product Name
                                </th>
                                <th className="px-5 py-3.5 font-semibold sm:px-6">
                                    Price
                                </th>
                                <th className="px-5 py-3.5 font-semibold sm:px-6">
                                    Category
                                </th>
                                <th className="px-5 py-3.5 font-semibold sm:px-6">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    <td className="whitespace-nowrap px-5 py-4 text-slate-500 sm:px-6">
                                        {product.id}
                                    </td>

                                    <td className="px-5 py-4 font-medium text-slate-800 sm:px-6">
                                        {product.name}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-slate-700 sm:px-6">
                                        ₹{Number(product.price).toLocaleString("en-IN")}
                                    </td>

                                    <td className="px-5 py-4 sm:px-6">
                                        <span
                                            className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {categories.find(
                                                (category) =>
                                                    category.id === product.categoryId
                                            )?.name ?? "-"}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 sm:px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                title="Edit product"
                                                aria-label="Edit product"
                                                className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-white p-2 text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                onClick={() => openEditModal(product)}
                                            >
                                                <Pencil size={16}/>
                                            </button>

                                            <button
                                                type="button"
                                                title="Delete product"
                                                aria-label="Delete product"
                                                className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100"
                                                onClick={() => {
                                                    setMessage("");
                                                    setDeleteError("");
                                                    setDeleteTarget(product);
                                                }}
                                            >
                                                <Trash2 size={16}/>
                                            </button>
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
                title={editingId !== null ? "Edit Product" : "Create Product"}
                submitLabel={editingId !== null ? "Save Changes" : "Create Product"}
                fields={productFields}
                values={formValues}
                error={formError}
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

export default ProductManagement;
