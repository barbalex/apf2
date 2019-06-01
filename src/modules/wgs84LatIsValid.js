export const isValid = x => !x || (x >= -180 && x <= 180)
export const message = `Der Breitengrad muss zwischen -180 und 180 liegen`
