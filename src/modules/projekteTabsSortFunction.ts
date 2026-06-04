const projekteTabsSortOrder = {
  tree: 1,
  daten: 2,
  filter: 3,
  karte: 4,
  exporte: 5,
  tree2: 6,
  daten2: 7,
  filter2: 8,
}
export const projekteTabsSortFunction = (a, b) => {
  const aOrder = projekteTabsSortOrder[a]
  const bOrder = projekteTabsSortOrder[b]
  if (aOrder < bOrder) return -1
  return 1
}
