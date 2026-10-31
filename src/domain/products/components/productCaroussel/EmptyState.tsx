export const EmptyState = ({ message }: { message: string }) => (
  <div 
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
    role="status"
    aria-live="polite"
  >
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <svg 
        className="w-8 h-8 text-slate-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
        />
      </svg>
    </div>
    <p className="text-slate-600 text-sm sm:text-base font-medium">{message}</p>
    <p className="text-slate-400 text-xs sm:text-sm mt-1">Check back later for new items</p>
  </div>
);