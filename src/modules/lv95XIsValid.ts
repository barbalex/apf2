export const isValid = (x: unknown): boolean =>
  !x || (Number(x) > 2485071 && Number(x) < 2828516)
export const message = `Die X-Koordinate muss zwischen 2'485'071 und 2'828'516 liegen`
