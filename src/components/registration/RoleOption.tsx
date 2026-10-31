"use client";

import { Role } from "@/config/index";
import { CheckCircle } from "lucide-react";


interface RoleOptionProps {
  role: Role;
  title: string;
  desc: string;
  note: string;
  icon: React.ElementType;
  selected: Role | null;
  onSelect: (role: Role) => void;
}

export default function RoleOption({
  role,
  title,
  desc,
  note,
  icon: Icon,
  selected,
  onSelect,
}: RoleOptionProps) {
  const isActive = selected === role;

  return (
    <label
      className={`relative flex cursor-pointer gap-4 rounded-xl border p-4 transition-all
        ${
          isActive
            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
            : "border-gray-200 bg-white hover:border-blue-400"
        }
      `}
    >
      <input
        type="radio"
        name="role"
        value={role}
        checked={isActive}
        onChange={() => onSelect(role)}
        className="sr-only"
      />

      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
        <Icon className="w-5 h-5 text-gray-700" />
      </div>

      <div className="flex-1">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          {title}
          {isActive && <CheckCircle className="w-4 h-4 text-blue-600" />}
        </h3>
        <p className="mt-1 text-xs text-gray-600">{desc}</p>
        <p className="mt-1 text-xs text-gray-500">{note}</p>
      </div>
    </label>
  );
}
