/* Country code selector matching Figma design — powered by country-telephone-data */
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { allCountries } from "country-telephone-data";

export type Country = {
  name: string;
  code: string; // dial code without +
  iso: string; // ISO 3166-1 alpha-2 (lowercase)
  flag: string; // emoji flag
};

/**
 * Convert ISO 3166-1 alpha-2 code to a regional-indicator emoji flag.
 * e.g. "in" → 🇮🇳, "us" → 🇺🇸
 */
function isoToFlag(iso: string): string {
  return iso
    .toUpperCase()
    .split("")
    .map((ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65))
    .join("");
}

/** Strip parenthesised native/local name, e.g. "Afghanistan (...)" → "Afghanistan" */
function cleanName(raw: string): string {
  return raw.replace(/\s*\(.*\)\s*/g, "").trim();
}

// Build the country list once from the library data
const COUNTRIES: Country[] = allCountries.map((c) => ({
  name: cleanName(c.name),
  code: c.dialCode,
  iso: c.iso2,
  flag: isoToFlag(c.iso2),
}));

export default function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string; // dial code without +
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selected =
    COUNTRIES.find((c) => c.code === value) ||
    COUNTRIES.find((c) => c.code === "91")!;

  const filtered = useMemo(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.iso.includes(q),
    );
  }, [search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (open) searchInputRef.current?.focus();
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button — matches Figma: bg-gray-50 border rounded-2xl, shows +CODE + chevron */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 h-full px-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all min-w-[100px] justify-between"
        style={{ minHeight: 58 }}
      >
        <span className="text-base font-bold text-gray-900">
          +{selected.code}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
        >
          {/* Search input */}
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Country list */}
          <div className="max-h-36 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400 font-medium">
                No countries found
              </div>
            ) : (
              filtered.map((country) => (
                <button
                  key={country.iso + country.code}
                  type="button"
                  onClick={() => {
                    onChange(country.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left ${
                    country.code === selected.code ? "bg-blue-50/60" : ""
                  }`}
                >
                  <span className="text-lg leading-none">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {country.name}
                    </div>
                    <div className="text-xs font-medium text-gray-400">
                      +{country.code}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
