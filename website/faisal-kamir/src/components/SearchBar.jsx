import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search for fabrics, colours, occasions...', autoFocus = false }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-charcoal/15 pl-11 pr-4 py-4 text-sm focus:outline-none focus:border-gold"
      />
    </div>
  );
}
