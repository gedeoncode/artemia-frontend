// import { FiUpload } from 'react-icons/fi';

type VerificationSectionProps = {
  sellerInfo: {
    documentVerified: boolean;
    documentUrl?: string;
  } | null;
  documentUploading: boolean;
  handleDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const VerificationSection = ({ 
  sellerInfo, 
  documentUploading, 
  handleDocumentUpload 
}: VerificationSectionProps) => (
  <div className="p-4 transition-all bg-white rounded-lg shadow-sm hover:shadow-md lg:col-span-1 sm:p-6">
    <h2 className="mb-3 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 sm:text-xl">
      Account Verification
    </h2>
    
    {sellerInfo?.documentVerified ? (
      <div className="p-3 text-center rounded-md bg-gradient-to-r from-green-50 to-green-100 sm:p-4">
        <p className="font-medium text-green-800">Your account is verified</p>
      </div>
    ) : (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 sm:text-base">
          Please upload your ID or passport for verification
        </p>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Document Type</label>
          <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-base">
            <option value="id">National ID</option>
            <option value="passport">Passport</option>
            <option value="business_license">Business License</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Document</label>
          <div className="flex items-center mt-1">
            <label className="flex flex-col items-center px-3 py-1 text-sm font-medium text-white transition-all rounded-md cursor-pointer bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 hover:from-red-800 hover:via-blue-500 hover:to-purple-600 hover:shadow-md sm:px-4 sm:py-2 sm:text-base">
              <span>Choose File</span>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleDocumentUpload}
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </label>
            <span className="ml-2 text-xs text-gray-500 sm:text-sm">PDF, JPG, or PNG</span>
          </div>
          {documentUploading && (
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Uploading document...</p>
          )}
        </div>
        
        {sellerInfo?.documentUrl && !sellerInfo.documentVerified && (
          <p className="text-xs text-yellow-600 sm:text-sm">Your document is under review</p>
        )}
      </div>
    )}
  </div>
);