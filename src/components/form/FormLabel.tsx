import { ReactNode } from "react";
import { Label } from "../ui";

type Props = {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
};

export function FormLabel({ htmlFor, required, children }: Props) {
  return (
    <Label
      htmlFor={htmlFor}
      className=  "block mb-1 " >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </Label>
  );
}
