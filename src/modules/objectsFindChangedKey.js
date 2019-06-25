/**
 * when formik submits
 * need to compare row and values
 * to find changed field
 */
export default (a, b) => {
  for (const [key, value] of Object.entries(a)) {
    // forms convert everything to strings!!!
    // eslint-disable-next-line eqeqeq
    if (value != b[key]) return key
  }
  return null
}
