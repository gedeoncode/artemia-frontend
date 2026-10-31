"use client";

import { Avatar } from "@/components/ui/avatar-enhanced";
import { UserProfileResponse } from "@/domain/auth/types";



export function UserProfileDropdown({
user
}: UserProfileResponse) {
  return (
    <div className="relative">
      <button className="flex items-center space-x-2">
        <Avatar
          src={user.avatar || "/placeholder-user.jpg"}
          alt="User profile"
          size="sm"
          border="subtle"
          status="online"
          badge="verified"
          name={user.name}
          email={user.email}
          className="transition-transform hover:scale-105"
        />
      </button>
    </div>
  );
}