/**
 * Gets an array of query results passed
 * returns true if any of them returns permission denied
 */
export default queryArray =>
  queryArray.some(
    error =>
      error.message.includes('permission denied') ||
      error.message.includes('keine Berechtigung'),
  )
