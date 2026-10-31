// app/seller/dashboard/manage-leads/components/LeadTable/LeadTableHeader.tsx

"use client";

interface LeadTableHeaderProps {
  columnCount?: number;
}

export function LeadTableHeader({
  columnCount = 6,
}: LeadTableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          Customer
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          Product
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          Contact Method
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          Status
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          Created
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}