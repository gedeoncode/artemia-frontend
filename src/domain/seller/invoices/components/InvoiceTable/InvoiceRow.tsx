import {
  FiChevronRight,
  FiClock,
  FiCheck,
  FiAlertTriangle,
  FiDollarSign,
} from "react-icons/fi";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import type { Invoice } from "../../../dashboard/types/invoiceTypes";

type InvoiceRowProps = {
  invoice: Invoice;
  onViewDetails: (invoiceId: string) => void;
};

const statusIcons = {
  pending: <FiClock className="text-yellow-500" />,
  paid: <FiCheck className="text-green-500" />,
  overdue: <FiAlertTriangle className="text-red-500" />,
  refunded: <FiDollarSign className="text-purple-500" />,
  cancelled: <FiDollarSign className="text-gray-500" />,
};

export const InvoiceRow = ({ invoice, onViewDetails }: InvoiceRowProps) => {
  const statusIcon = statusIcons[invoice.status] || <FiClock />;

  return (
    <tr
      className="border-b cursor-pointer hover:bg-gray-50"
      onClick={() => onViewDetails(invoice.id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">{statusIcon}</div>
          <div className="ml-2">
            <div className="font-medium text-gray-900">
              #{invoice.invoiceNumber}
            </div>
            <div className="text-sm text-gray-500">
              Order #{invoice.orderId.slice(0, 8)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-gray-900">{invoice.customer.name}</div>
        <div className="text-sm text-gray-500">{invoice.customer.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-gray-900">
          {new Date(invoice.issueDate).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          Due {new Date(invoice.dueDate).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <InvoiceStatusBadge status={invoice.status} />
      </td>
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <div className="font-medium text-gray-900">
          ${invoice.totalAmount.toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <FiChevronRight className="text-gray-400" />
      </td>
    </tr>
  );
};
