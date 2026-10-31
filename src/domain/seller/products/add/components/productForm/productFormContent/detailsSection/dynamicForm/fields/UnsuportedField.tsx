import { AlertTriangle } from "lucide-react";

export function UnsupprtedField({fieldType}:{fieldType:string}){
return (
  <div className="rounded-md border border-destructive p-4">
    <AlertTriangle className="h-4 w-4" />
    <p>
      Unsupported field type:
      {fieldType}
    </p>
  </div>
)
};