import { ReactNode } from "react";

interface SpecProps {
  label: string;
  value?: ReactNode;
}

export function Spec({ label, value }: SpecProps) {
  return (
    <>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value ?? "-"}</div>
    </>
  );
}