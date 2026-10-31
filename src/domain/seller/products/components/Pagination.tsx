const Pagination = ({ page, pages, onPageChange }: { page: number; pages: number; onPageChange: (page: number) => void }) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-purple-500 text-white' : ''}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};
export default Pagination;
