import { RealEstateDetails } from "@/types/product";

type props = {
  details: RealEstateDetails;
};

export function RealEstateDetailsView({ details }: props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>Localisation</div>
      <div>{details.location}</div>

      <div>Surface</div>
      <div>{details.surface} m²</div>

      <div>Nombre de pièces</div>
      <div>{details.rooms}</div>

      <div>Prix</div>
      <div>{details.price}</div>

      {details.propertyType && (
        <>
          <div>Type de bien</div>
          <div>{details.propertyType}</div>
        </>
      )}
    </div>
  );
}
