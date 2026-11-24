'use client';

function ChipGroup({ label, options, active, onChange }) {
  if (!options.length) return null;

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange('')}
          aria-pressed={active === ''}
          className={`rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm ${
            active === ''
              ? 'border-blue-950 bg-blue-950 text-white'
              : 'border-gray-300 bg-white text-blue-950 hover:border-red-500 hover:text-red-600'
          }`}
        >
          Tout ({options.reduce((sum, option) => sum + option.count, 0)})
        </button>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active === option.value}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm ${
              active === option.value
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-gray-300 bg-white text-blue-950 hover:border-red-500 hover:text-red-600'
            }`}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterBar({
  sportOptions = [],
  yearOptions = [],
  sport = '',
  year = '',
  onSportChange,
  onYearChange,
}) {
  if (!sportOptions.length && !yearOptions.length) return null;

  return (
    <div className="mb-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <ChipGroup
        label="Sport"
        options={sportOptions}
        active={sport}
        onChange={onSportChange}
      />
      <ChipGroup
        label="Année"
        options={yearOptions}
        active={year}
        onChange={onYearChange}
      />
    </div>
  );
}
