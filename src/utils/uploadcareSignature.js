import md5Hex from 'md5-hex'

const secret = process.env.UPLOADCARE_SECRET_KEY
// Expire in 30 min e.g. 1454903856
export const expire = Math.round(new Date().getTime() / 1000) + 60 * 30
const toSign = secret + expire
export const signature = md5Hex(toSign)
