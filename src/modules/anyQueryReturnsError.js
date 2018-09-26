// @flow
/**
 * Gets an array of query results passed
 * returns true if any of them returns an error
 */
export default queryArray => {
  const errors = queryArray.map(q => q.error).filter(o => !!o)
  if (errors.length && errors[0]) return errors[0]
  return null
}
