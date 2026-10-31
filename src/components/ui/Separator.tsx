import React from "react";

interface SeparatorProps {
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ className = "" }) => (
  <hr className={`border-t border-gray-200 my-4 ${className}`} />
);

export default Separator;
