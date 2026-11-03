import { API_URL } from "../config";
import type { Product } from "../types";

const PRODUCTS_API = `${API_URL}/api/products`;

interface ApiResponse {
  success: boolean;
  message?: string;
  products?: any[];
  product?: any;
}

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Convert MongoDB product into Admin Dashboard format
const mapProduct = (p: any): Product => ({
  id: p._id,
  name: p.name,
  sku: p.sku || "",
  category: p.category || "",
  description: p.description || "",
  image: p.image || "",
  additionalImages: p.images || [],
  sellingPrice: p.sellingPrice ?? p.price ?? 0,
  costPrice: p.costPrice ?? 0,
  stock: p.stock ?? 0,
  status:
    p.status?.toLowerCase() === "inactive"
      ? "Inactive"
      : p.status?.toLowerCase() === "out of stock"
        ? "Out of Stock"
        : "Active",
  featured: p.featured ?? false,
  tags: p.tags || [],
  lastUpdated: p.updatedAt
    ? new Date(p.updatedAt).toLocaleDateString("en-US")
    : "",
  isDeleted: p.isDeleted ?? false,
});

// Get all products for Admin
export const getAdminProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${PRODUCTS_API}/admin/all`, {
    headers: getHeaders(),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return (data.products || []).map(mapProduct);
};

// Add new product
export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await fetch(PRODUCTS_API, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(product),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to add product");
  }

  return mapProduct(data.product);
};

// Update product
export const editProduct = async (
  id: string,
  product: Partial<Product>
): Promise<Product> => {
  const response = await fetch(`${PRODUCTS_API}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(product),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update product");
  }

  return mapProduct(data.product);
};

// Delete product
export const removeProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${PRODUCTS_API}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to delete product");
  }
};

// Restore deleted product
export const restoreProductApi = async (id: string): Promise<Product> => {
  const response = await fetch(`${PRODUCTS_API}/${id}/restore`, {
    method: "PATCH",
    headers: getHeaders(),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to restore product");
  }

  return mapProduct(data.product);
};
