export const isValid = (y: unknown): boolean =>
  !y || (Number(y) > 1075346 && Number(y) < 1299942)
export const message = `Die Y-Koordinate muss zwischen 1'075'346 und 1'299'942 liegen`
