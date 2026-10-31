import type { Admin, AdminResponse } from "../types/manage.admin.types";

const API_BASE = "/api/admin/";

export const fetchAdmins = async (): Promise<AdminResponse[]> => {
  const response = await fetch(`${API_BASE}`);
  if (!response.ok) throw new Error("Failed to fetch admins");
  return response.json();
};

export const createAdmin = async (
  formData: Omit<Admin, "_id">
): Promise<AdminResponse> => {
  const response = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error("Failed to create admin");
  return response.json();
};

export const updateAdminRole = async (id: string, role: string): Promise<Admin> => {
  const response = await fetch(`${API_BASE}/${id}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) throw new Error("Failed to update role");
  return response.json();
};

export const deleteAdmin = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Delete failed");
};

