import { Input } from "@/components/ui/Input";

const PRICE_INPUT_PROPS = {
  min: 0,
  step: 0.01,
  pattern: "^[0-9]*[.,]?[0-9]*$",
} as const;

export const PriceInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ id, label, value, onChange, placeholder = "0" }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.,]/g, "");
    onChange(rawValue);
  };

  const handleBlur = () => {
    if (value) {
      const num = parseFloat(value.replace(",", "."));
      onChange(isNaN(num) ? value : num.toString());
    }
  };

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500 text-sm">$</span>
        </div>

        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pl-7 py-2 text-sm focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
          {...PRICE_INPUT_PROPS}
        />
      </div>
    </div>
  );
};