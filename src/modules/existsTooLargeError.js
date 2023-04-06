/**
 * Gets an array of query results passed
 * returns true if any of them returns permission denied
 */
const existsTooLargeError = (errors) => {
  if (!errors) {
    return false
  }
  if (!errors.some) {
    return false
  }
  const exists = errors.some(
    (error) =>
      error.message.includes('request entity too large'),
  )
  return exists
}

export default existsTooLargeError
