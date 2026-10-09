// A palette from named colors: its list (for the mesher) and each name's color index (index + 1, for painting).
export function namedPalette<K extends string>(entries: Record<K, number>): { colors: number[]; C: Record<K, number> } {
  return {
    colors: Object.values(entries) as number[],
    C: Object.fromEntries(Object.keys(entries).map((name, i) => [name, i + 1])) as Record<K, number>,
  };
}
