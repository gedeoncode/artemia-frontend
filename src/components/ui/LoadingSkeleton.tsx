 const  LoadingSkeleton = () => (
  <div className="max-w-3xl p-6 mx-auto">
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="w-64 h-8 mb-3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
      </div>
      
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-64 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-end p-6">
        <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);
export default LoadingSkeleton

