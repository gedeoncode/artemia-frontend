type Props = {
  region: string;
};

export function DeliveryAvailabilityNotice({ region }: Props) {
  return (
    <div className="p-3 text-xs text-gray-700 rounded-md sm:text-sm bg-gray-50">
      Deliveries are currently available in <strong>{region}</strong>.
    </div>
  );
}
