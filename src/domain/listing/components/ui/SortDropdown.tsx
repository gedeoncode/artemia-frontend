interface SortDropdownProps {
    sortBy: string;
    onChange: (value: string) => void;
}

export function SortDropdown({ sortBy, onChange }: SortDropdownProps) {
    const options = [
        { value: '', label: 'Default' },
        { value: 'priceLowToHigh', label: 'Price: Low to High' },
        { value: 'priceHighToLow', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest Arrivals' },
    ];

    return (
        <select
            value={sortBy}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border rounded"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}