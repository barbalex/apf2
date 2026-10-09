const projekteTabsSortOrder: Record<string, number | undefined> = {
  tree: 1,
  daten: 2,
  filter: 3,
  karte: 4,
  exporte: 5,
  tree2: 6,
  daten2: 7,
  filter2: 8,
}
export const projekteTabsSortFunction = (a: string, b: string) => {
  const aOrder = projekteTabsSortOrder[a]
  const bOrder = projekteTabsSortOrder[b]
  if ((aOrder ?? 0) < (bOrder ?? 0)) return -1
  return 1
}
