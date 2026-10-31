import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import { useEffect, useState } from "react";

type ProfileHeaderProps = {
  profile: {
    name: string;
    email: string;
    avatar?: string;
    businessName: string;
    documentVerified: boolean;
  };
  onAvatarUpload: (file: File) => void;
  uploading?: boolean;
};

export const ProfileHeader = ({
  profile,
  onAvatarUpload,
  uploading = false,
}: ProfileHeaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show temporary preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    onAvatarUpload(file);

  };
  // Revoke preview URL later to free memory
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);


  const displayAvatar = previewUrl || profile.avatar || "";

  return (
    <div className="flex flex-col items-center mb-8 space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
      <div className="relative group">
        <div className="w-24 h-24 overflow-hidden bg-gray-200 rounded-full ring-2 ring-gray-300">
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt={`${profile.name}'s avatar`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-2xl font-semibold text-gray-500 bg-gray-100">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Upload button */}
        <label
          className={`absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer transition-opacity duration-200 group-hover:opacity-100 ${
            uploading ? "opacity-0 pointer-events-none" : "opacity-0"
          }`}
          title="Change avatar"
        >
          <FiCamera className="text-gray-600" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {/* Uploading spinner overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
        <p className="text-gray-600">{profile.email}</p>
        <p className="font-medium text-gray-900">{profile.businessName}</p>
        <div className="mt-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              profile.documentVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {profile.documentVerified ? "Vérifié" : "Non vérifié"}
          </span>
        </div>
      </div>
    </div>
  );
};
