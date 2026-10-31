// Orders Table component
export function OrdersTable({ orders }: { orders: any[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Order
          </th>
          <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Customer
          </th>
          <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Amount
          </th>
          <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
              #{order.id.slice(-6)}
            </td>
            <td className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap truncate max-w-[100px]">
              {order.user}
            </td>
            <td className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap">
              ${order?.amount?.toFixed(2)}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
