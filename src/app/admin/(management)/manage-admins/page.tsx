"use client";

import { useState, useEffect } from "react";
import AdminDrawer from "./AdminDrawer";
import EditRoleDrawer from "./EditRoleDrawer";
import ConfirmationDialog from "./components/ConfirmationDialog";
import AdminTable from "./AdminTable";
import { fetchAdmins, createAdmin, updateAdminRole, deleteAdmin } from "./services/manage.admin.service";
import type { Admin } from "./types/manage.admin.types";


export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const {data} = await fetchAdmins();
      console.log("admins data: ", data)
      setAdmins(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Manage Admins</h1>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 text-sm font-semibold text-white transition bg-blue-700 rounded hover:bg-blue-800"
        >
          Create Admin
        </button>
      </div>

      <AdminTable
        admins={admins}
        loading={loading}
        onEdit={setSelectedAdmin}
        onDelete={setAdminToDelete}
        setEditDrawerOpen={setEditDrawerOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={createAdmin}
        onSuccess={() => {
          setDrawerOpen(false);
          loadAdmins();
        }}
      />

      {selectedAdmin && (
        <EditRoleDrawer
          open={editDrawerOpen}
          onClose={() => setEditDrawerOpen(false)}
          onSubmit={updateAdminRole}
          admin={selectedAdmin}
          onSuccess={() => {
            setEditDrawerOpen(false);
            loadAdmins();
          }}
        />
      )}

      {adminToDelete && (
        <ConfirmationDialog
          open={confirmDialogOpen}
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${adminToDelete.name}? This action cannot be undone.`}
          onCancel={() => {
            setConfirmDialogOpen(false);
            setAdminToDelete(null);
          }}
          onConfirm={async () => {
            await deleteAdmin(adminToDelete._id);
            setConfirmDialogOpen(false);
            loadAdmins();
          }}
        />
      )}
    </div>
  );
}