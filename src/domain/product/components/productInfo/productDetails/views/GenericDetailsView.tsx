// /ui/views/GenericDetailsView.tsx

import { formatLabel, formatValue, flattenObject } from "@/domain/product/utils";
import { Spec } from "./Spec";

const IGNORED_FIELDS = ["categoryType", "_id", "__v"];

export function GenericDetailsView({ details }) {
  if (!details || typeof details !== "object") {
    return null;
  }

  const flatDetails = flattenObject(details);

  const entries = Object.entries(flatDetails).filter(
    ([key, value]) =>
      !IGNORED_FIELDS.includes(key) &&
      value !== undefined &&
      value !== null &&
      value !== ""
  );

  if (entries.length === 0) {
    return <p className="text-gray-500">No additional details</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {entries.map(([key, value]) => (
        <Spec
          key={key}
          label={formatLabel(key)}
          value={formatValue(value)}
        />
      ))}
    </div>
  );
}

