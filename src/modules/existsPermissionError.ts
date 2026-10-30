/**
 * Gets an array of query results passed
 * returns true if any of them returns permission denied
 * or a JWT verification failure (e.g. "invalid signature" after the
 * signing secret was rotated - the token is not expired then, so the
 * client-side exp check does not catch it)
 *
 * All these mean the same thing: the user has to (re)authenticate.
 * The apollo error link then swallows the notification and the Error
 * component logs out, which opens the login dialog.
 */
export const existsPermissionError = (
  errors: { message?: string }[] | undefined,
) => {
  //console.log('existsPermissionError, errors:', errors)
  if (!errors) {
    //console.log('existsPermissionError, !errors')
    return false
  }
  if (!errors.some) {
    //console.log('existsPermissionError, !errors.some')
    return false
  }
  //console.log('existsPermissionError, errors.some')
  const exists = errors.some(
    (error) =>
      (error.message ?? '').includes('permission denied') ||
      (error.message ?? '').includes('keine Berechtigung') ||
      // JWT verification failures (jsonwebtoken messages, via PostGraphile)
      (error.message ?? '').includes('invalid signature') ||
      (error.message ?? '').includes('jwt expired') ||
      (error.message ?? '').includes('jwt malformed') ||
      (error.message ?? '').includes('jwt audience invalid') ||
      (error.message ?? '').includes('jwt issuer invalid'),
  )
  //console.log('existsPermissionError, exists:', exists)
  return exists
}
