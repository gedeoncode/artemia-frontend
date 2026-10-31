// components/shared/TableSkeleton.tsx
export function TableSkeleton({
  rowCount = 5,
  columnCount = 5,
  headers = [],
}: {
  rowCount?: number;
  columnCount?: number;
  headers?: string[];
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.length > 0
            ? headers.map((header, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))
            : Array.from({ length: columnCount }).map((_, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                </th>
              ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rowCount }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {Array.from({ length: columnCount }).map((_, colIdx) => (
              <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                <div className="w-full h-4 bg-gray-100 rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
