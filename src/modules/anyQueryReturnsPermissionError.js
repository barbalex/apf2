// @flow
/**
 * Gets an array of query results passed
 * returns true if any of them returns permission denied
 */
export default queryArray =>
  queryArray.some(
    q =>
      q.error &&
      (q.error.message.includes('permission denied') ||
        q.error.message.includes('keine Berechtigung')),
  )
