import { FiUpload, FiPackage, FiShoppingCart, FiUser } from 'react-icons/fi';
type QuickActionProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const QuickAction = ({ icon, label, onClick }: QuickActionProps) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 text-xs transition-all border border-gray-200 rounded-md hover:shadow-md sm:text-sm sm:p-4 group"
  >
    <div className="p-2 mb-1 rounded-full bg-gradient-to-r from-red-100 via-blue-100 to-purple-100 sm:mb-2 sm:p-3">
      {icon}
    </div>
    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-700">
      {label}
    </span>
  </button>
);

type QuickActionsProps = {
  navigateTo: (path: string) => void;
};

export const QuickActions = ({ navigateTo }: QuickActionsProps) => (
  <div className="p-4 transition-all bg-white rounded-lg shadow-sm hover:shadow-md sm:p-6">
    <h2 className="mb-3 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 sm:text-xl">
      Quick Actions
    </h2>
    <div className="grid grid-cols-2 gap-3">
      <QuickAction
        icon={<FiUpload className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 sm:text-2xl" />}
        label="Add Product"
        onClick={() => navigateTo('/seller/dashboard/add-product')}
      />
      <QuickAction
        icon={<FiPackage className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 sm:text-2xl" />}
        label="Manage Products"
        onClick={() => navigateTo('/seller/dashboard/manage-products')}
      />
      <QuickAction
        icon={<FiShoppingCart className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 sm:text-2xl" />}
        label="View Orders"
        onClick={() => navigateTo('/seller/dashboard/orders')}
      />
      <QuickAction
        icon={<FiUser className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 sm:text-2xl" />}
        label="Profile Settings"
        onClick={() => navigateTo('/seller/dashboard/profile')}
      />
    </div>
  </div>
);