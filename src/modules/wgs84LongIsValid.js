export const isValid = x => !x || (x >= -180 && x <= 180)
export const message = `Der Längengrad muss zwischen -180 und 180 liegen`
