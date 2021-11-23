/**
 * when formik submits
 * need to compare row and values
 * to find changed field
 */
const objectsFindChangedKey = (a, b = {}) => {
  for (const [key, value] of Object.entries(a)) {
    // DANGER
    // if query fetched dependent data, there will be objects with that data contained
    // these objects are always inequal so wrong field will be returned!
    // so do not compare object values!
    // BUT do respect null (which is an object!)
    // forms convert everything to strings!!!
    // eslint-disable-next-line eqeqeq
    if (value === null && value != b[key]) return key
    // eslint-disable-next-line eqeqeq
    if (typeof value !== 'object' && value != b[key]) return key
  }
  return null
}

export default objectsFindChangedKey
