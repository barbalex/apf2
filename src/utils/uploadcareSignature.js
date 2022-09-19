import md5 from 'blueimp-md5'

const secret = process.env.GATSBY_UPLOADCARE_SECRET_KEY
// Expire in 30 min e.g. 1454903856
export const expire = Math.round(Date.now() / 1000) + 60 * 60 // make it last 60 minutes
// console.log('uploadcareSignature, expire:', expire)
// console.log('uploadcareSignature, expire:', expire?.toUTCString())
const toSign = secret + expire
export const signature = md5(toSign)
