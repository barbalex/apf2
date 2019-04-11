/**
 * Gets an array of query results passed
 * returns true if any of them returns an error
 */
export default queryArray => {
  const errors = queryArray.filter(o => !!o)
  //console.log('anQueryReturnsError, errors.length:', errors.length)
  if (errors.length && errors[0]) return errors[0]
  return null
}
