// components/InventoryAlerts.tsx
import { useState } from "react";
import { 
  AlertTriangle, 
  Package, 
  ShoppingCart, 
  Clock, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { InventoryAlert, Product } from "../../types";
import { formatPrice } from "@/lib";

interface InventoryAlertsProps {
  lowStockProducts: Product[];
  inventoryAlerts: InventoryAlert[];
  onViewInventory: () => void;
  onReorder: (productId: string) => void;
  onBulkReorder?: (productIds: string[]) => void;
}

const severityColors = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800'
  },
  medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  low: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-800'
  }
};

export function InventoryAlerts({
  lowStockProducts,
  inventoryAlerts,
  onViewInventory,
  onReorder,
  onBulkReorder
}: InventoryAlertsProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const hasAlerts = lowStockProducts.length > 0 || inventoryAlerts.length > 0;

  if (!hasAlerts) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900">Inventory Status</h3>
            </div>
            <button
              onClick={onViewInventory}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Manage Inventory →
            </button>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <p className="mt-3 text-sm text-gray-600">All inventory levels are healthy</p>
          <p className="text-xs text-gray-500">No low stock alerts at this time</p>
        </div>
      </div>
    );
  }

  const handleBulkReorder = () => {
    if (selectedProducts.length > 0 && onBulkReorder) {
      onBulkReorder(selectedProducts);
      setSelectedProducts([]);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-900">Inventory Alerts</h3>
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              {lowStockProducts.length + inventoryAlerts.length} Alert{lowStockProducts.length !== 1 && 's'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedProducts.length > 0 && (
              <button
                onClick={handleBulkReorder}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Reorder Selected ({selectedProducts.length})
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="divide-y divide-gray-200">
          {/* System alerts */}
          {inventoryAlerts.map((alert, idx) => {
            const colors = severityColors[alert.severity];
            return (
              <div key={`alert-${idx}`} className={`p-6 ${colors.bg} ${colors.border} border-l-8`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
                      <h4 className={`font-medium ${colors.text}`}>
                        {alert.type === 'out_of_stock' && 'Out of Stock Items'}
                        {alert.type === 'low_stock' && 'Low Stock Warning'}
                        {alert.type === 'high_demand_low_stock' && 'High Demand - Low Stock'}
                      </h4>
                    </div>
                    
                    {alert.count && (
                      <p className="mt-1 text-sm">
                        {alert.count} product{alert.count !== 1 && 's'} {alert.type === 'out_of_stock' ? 'are out of stock' : 'are running low'}
                      </p>
                    )}
                    
                    {alert.products && alert.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {alert.products.map((product, productIdx) => (
                          <div key={productIdx} className="flex items-center justify-between text-sm">
                            <span>{product.name}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-500">Stock: {product.stock}</span>
                              {product.soldLast30Days && (
                                <span className="text-gray-500">Sold: {product.soldLast30Days}</span>
                              )}
                              <button
                                onClick={() => onReorder(product.name)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Reorder
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Low stock products list */}
          {lowStockProducts.length > 0 && (
            <div>
              <div className="px-6 py-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Low Stock Products ({lowStockProducts.length})
                    </span>
                  </div>
                  <button
                    onClick={onViewInventory}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <div key={product._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      {/* Product image */}
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="object-cover w-16 h-16 rounded-lg"
                        />
                      )}
                      
                      {/* Product info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">
                              Price: ${formatPrice(product.price)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => toggleProductSelection(product._id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm font-medium ${
                              product.stock === 0 ? 'text-red-600' :
                              product.stock <= 2 ? 'text-orange-600' :
                              'text-yellow-600'
                            }`}>
                              {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => onReorder(product._id)}
                            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <span>Reorder Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Stock level bar */}
                        {product.stock > 0 && product.stock <= 5 && (
                          <div className="mt-3">
                            <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                              <div 
                                className="h-full transition-all duration-300 bg-yellow-500 rounded-full"
                                style={{ width: `${(product.stock / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}