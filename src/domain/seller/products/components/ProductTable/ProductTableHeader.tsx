import { Checkbox } from "@/components/ui/Checkbox";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

type ProductTableHeaderProps = {
  sortConfig: {
    sort?: string;
    order?: string;
  };
  onSort: (field: string) => void;
};

export const ProductTableHeader = ({
  sortConfig,
  onSort,
}: ProductTableHeaderProps) => {
  const getSortIcon = (field: string) => {
    if (sortConfig.sort !== field) return null;
    return sortConfig.order === "asc" ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
        >
          <Checkbox size="sm" />
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
          onClick={() => onSort("name")}
        >
          <div className="flex items-center">
            Name
            <span className="ml-1">{getSortIcon("name")}</span>
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
          onClick={() => onSort("price")}
        >
          <div className="flex items-center">
            Price
            <span className="ml-1">{getSortIcon("price")}</span>
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
        >
          Stock
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
        >
          Sales
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
        >
          Category
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
        >
          Status
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
};
