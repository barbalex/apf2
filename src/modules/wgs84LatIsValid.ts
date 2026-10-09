export const isValid = (x: unknown): boolean =>
  !x || (Number(x) >= -90 && Number(x) <= 90)
export const message = `Der Breitengrad muss zwischen -90 und 90 liegen`
