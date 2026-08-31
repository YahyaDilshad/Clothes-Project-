import { X } from 'lucide-react';
import { CATEGORIES, COLORS, OCCASIONS } from '../data/products.js';

function FilterContent({ filters, setFilters, onClear }) {
  const toggleArrayValue = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">Filters</h3>
        <button onClick={onClear} className="text-xs uppercase tracking-wide text-gold hover:underline">
          Clear all
        </button>
      </div>

      <div>
        <p className="eyebrow mb-3">Fabric</p>
        <div className="space-y-2.5">
          {CATEGORIES.map((c) => (
            <label key={c.slug} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fabric.includes(c.name)}
                onChange={() => toggleArrayValue('fabric', c.name)}
                className="accent-charcoal w-4 h-4"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Colour</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.name}
              title={c.name}
              onClick={() => toggleArrayValue('color', c.name)}
              className={`w-8 h-8 rounded-full border-2 ${filters.color.includes(c.name) ? 'border-gold' : 'border-transparent'}`}
              style={{ backgroundColor: c.hex }}
              aria-pressed={filters.color.includes(c.name)}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Occasion</p>
        <div className="space-y-2.5">
          {OCCASIONS.map((o) => (
            <label key={o} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.occasion.includes(o)}
                onChange={() => toggleArrayValue('occasion', o)}
                className="accent-charcoal w-4 h-4"
              />
              {o}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Price Range (PKR)</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            value={filters.priceMin}
            onChange={(e) => setFilters((p) => ({ ...p, priceMin: Number(e.target.value) || 0 }))}
            className="input-fk"
            placeholder="Min"
          />
          <span className="text-stone">–</span>
          <input
            type="number"
            min={0}
            value={filters.priceMax}
            onChange={(e) => setFilters((p) => ({ ...p, priceMax: Number(e.target.value) || 0 }))}
            className="input-fk"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Availability</p>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => setFilters((p) => ({ ...p, inStockOnly: !p.inStockOnly }))}
            className="accent-charcoal w-4 h-4"
          />
          In Stock Only
        </label>
      </div>
    </div>
  );
}

export default function FilterDrawer({ filters, setFilters, onClear, open, onClose }) {
  return (
    <>
      {/* Desktop inline sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <FilterContent filters={filters} setFilters={setFilters} onClear={onClear} />
      </aside>

      {/* Mobile slide-over */}
      {open && (
        <div className="fixed inset-0 z-[85] lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={onClose} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory p-6 overflow-y-auto animate-slideUp">
            <div className="flex justify-end mb-4">
              <button onClick={onClose} aria-label="Close filters"><X size={22} /></button>
            </div>
            <FilterContent filters={filters} setFilters={setFilters} onClear={onClear} />
            <button onClick={onClose} className="btn-primary w-full mt-8">Show Results</button>
          </div>
        </div>
      )}
    </>
  );
}
