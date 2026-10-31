import type { Admin } from "./types/manage.admin.types";
import { FiEdit2, FiTrash2, FiMoreVertical, FiLoader } from "react-icons/fi";
import { useState } from "react";

interface AdminTableProps {
  admins: Admin[];
  loading: boolean;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  setEditDrawerOpen: (open: boolean) => void;
  setConfirmDialogOpen: (open: boolean) => void;
}

export default function AdminTable({
  admins,
  loading,
  onEdit,
  onDelete,
  setEditDrawerOpen,
  setConfirmDialogOpen,
}: AdminTableProps) {
  const [activeRow, setActiveRow] = useState<string | null>(null);

  const handleEditClick = (admin: Admin) => {
    onEdit(admin);
    setEditDrawerOpen(true);
    setActiveRow(null); // Close dropdown if open
  };

  const handleDeleteClick = (admin: Admin) => {
    onDelete(admin);
    setConfirmDialogOpen(true);
    setActiveRow(null); // Close dropdown if open
  };

  const toggleActionMenu = (id: string) => {
    setActiveRow(activeRow === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-blue-600">
        <FiLoader className="w-8 h-8 mb-2 animate-spin" />
        <p>Loading admin data...</p>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
        <p>No admins found. Create your first admin to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      {/* Desktop Table */}
      <table className="hidden w-full text-sm text-left md:table">
        <thead className="text-gray-700 bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {admins.map((admin) => (
            <tr key={admin._id} className="transition-colors hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {admin.name}
              </td>
              <td className="px-6 py-4 text-gray-700">{admin.email}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                  {admin.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    admin.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {admin.active ? "Active" : "Revoked"}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2 text-right">
                <button
                  onClick={() => handleEditClick(admin)}
                  className="p-1 text-blue-600 transition-colors rounded-full hover:text-blue-800 hover:bg-blue-50"
                  aria-label="Edit admin"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(admin)}
                  className="p-1 text-red-600 transition-colors rounded-full hover:text-red-800 hover:bg-red-50"
                  aria-label="Delete admin"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="p-4 space-y-4 md:hidden">
        {admins.map((admin) => (
          <div
            key={admin._id}
            className="relative p-4 bg-white border border-gray-100 rounded-lg shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{admin.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{admin.email}</p>
              </div>
              <button
                onClick={() => toggleActionMenu(admin._id)}
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="More actions"
              >
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                {admin.role}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  admin.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {admin.active ? "Active" : "Revoked"}
              </span>
            </div>

            {/* Mobile Action Menu */}
            {activeRow === admin._id && (
              <div className="absolute z-10 w-40 mt-1 bg-white border border-gray-200 rounded-md shadow-lg right-4 top-12">
                <button
                  onClick={() => handleEditClick(admin)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiEdit2 className="w-4 h-4 mr-2" />
                  Edit Role
                </button>
                <button
                  onClick={() => handleDeleteClick(admin)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
