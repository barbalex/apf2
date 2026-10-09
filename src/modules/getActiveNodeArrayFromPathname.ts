export const getActiveNodeArrayFromPathname = (
  pathnamePassed?: string,
): (string | number)[] => {
  const pathname = pathnamePassed ?? window.location.pathname

  return (
    pathname
      .split('/')
      .filter((e) => !!e)
      .filter((e) => e !== 'Daten')
      // need to decode in case of Umlaute
      .map((e) => decodeURIComponent(e))
      // convert numbers to numbers
      .map((e) => {
        if (!isNaN(Number(e))) {
          return +e
        }
        return e
      })
  )
}
