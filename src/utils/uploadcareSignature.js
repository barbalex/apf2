import md5 from 'blueimp-md5'

const secret = process.env.GATSBY_UPLOADCARE_SECRET_KEY
// Expire in 30 min e.g. 1454903856
export const expire = Math.round(new Date().getTime() / 1000) + 60 * 30
const toSign = secret + expire
export const signature = md5(toSign)
