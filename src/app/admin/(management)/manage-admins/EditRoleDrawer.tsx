// "use client";

// import { useState, useEffect } from "react";

// interface EditRoleDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (id: string, newRole: string) => void;
//   admin: {
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
//   } | null;
// }

// export default function EditRoleDrawer({
//   open,
//   onClose,
//   onSubmit,
//   admin,
// }: EditRoleDrawerProps) {
//   const [role, setRole] = useState("admin");

//   useEffect(() => {
//     if (admin) {
//       setRole(admin.role || "admin");
//     }
//   }, [admin]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (admin) {
//       onSubmit(admin._id, role);
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-0 z-50 transition-all duration-300 ${
//         open ? "translate-x-0" : "translate-x-full"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/30"
//         onClick={onClose}
//         aria-hidden="true"
//       />

//       {/* Drawer Panel */}
//       <div className="absolute top-0 right-0 w-full h-full max-w-md p-6 overflow-y-auto bg-white shadow-xl">
//         <h2 className="mb-4 text-xl font-semibold text-blue-900">Edit Admin Role</h2>

//         {admin && (
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Full Name</label>
//               <p className="text-gray-800">{admin.name}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600">Email</label>
//               <p className="text-gray-800">{admin.email}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Role</label>
//               <select
//                 name="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="admin">Admin</option>
//                 <option value="moderator">Moderator</option>
//                 <option value="editor">Editor</option>
//               </select>
//             </div>

//             <div className="flex justify-between pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 text-sm text-white bg-blue-700 rounded hover:bg-blue-800"
//               >
//                 Update Role
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiCheck } from "react-icons/fi";

interface EditRoleDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, newRole: string) => void;
  admin: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  loading?: boolean;
}

export default function EditRoleDrawer({
  open,
  onClose,
  onSubmit,
  admin,
  loading = false,
}: EditRoleDrawerProps) {
  const [role, setRole] = useState("admin");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (admin) {
      setRole(admin.role || "admin");
    }
  }, [admin]);

  useEffect(() => {
    if (!open) {
      setShowSuccess(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admin) {
      await onSubmit(admin._id, role);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "viewer", label: "Moderator" },
    { value: "editor", label: "Editor" },
    
  ];

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Overlay with smooth transition */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel with better animations */}
      <div
        className={`absolute top-0 right-0 w-full h-full max-w-md p-6 overflow-y-auto bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Admin Role
          </h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close drawer"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {admin && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info Section */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <label className="block mb-1 text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <p className="font-medium text-gray-900">{admin.name}</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <label className="block mb-1 text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="font-medium text-gray-900">{admin.email}</p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Administrators have full access, moderators can manage content,
                and editors can create content.
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="flex items-center gap-2 p-3 text-green-700 rounded-lg bg-green-50">
                <FiCheck className="w-5 h-5" />
                <span>Role updated successfully!</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading || role === admin.role}
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Role"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
