import { CarDetails } from "@/types/product";
import { Spec } from "./Spec";
type props = {
  details: CarDetails;
};
export function CarDetailsView({ details }: props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Spec label="Brand" value={details.brand} />
      <Spec label="Model" value={details.model} />
      <Spec label="Year" value={details.year} />
      <Spec label="Mileage" value={`${details.mileage ?? 0} km`} />
      <Spec label="Fuel" value={details.fuelType} />
      <Spec label="Transmission" value={details.transmission} />
    </div>
  );
}
