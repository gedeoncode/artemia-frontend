// DataCard.tsx
import { Edit2 } from "lucide-react";

interface DataCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
}

export function DataCard({ title, icon, children, onEdit }: DataCardProps) {
  return (
    <div className="p-2 bg-white border border-gray-200 shadow-sm md:p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 text-blue-600 rounded-lg bg-blue-50">{icon}</div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {onEdit && (
          <button
            type="button"
            data-ignore-submit="true"
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}


 