/** Years available in the artwork year select (admin enumeration). */
export const ARTWORK_YEAR_OPTIONS: string[] = Array.from({ length: 2035 - 1970 + 1 }, (_, i) =>
  String(1970 + i)
);
