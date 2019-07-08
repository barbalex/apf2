export default pathnamePassed => {
  if (typeof window !== 'undefined') {
    const pathname = pathnamePassed || window.location.pathname
    /*console.log('getActiveNodeArrayFromPathname', {
      pathnamePassed,
      windowPathname: window.location.pathname,
    })*/
    return (
      pathname
        .split('/')
        .filter(e => !!e && e !== 0)
        .filter(e => e !== 'Daten')
        // need to decode in case of Umlaute
        .map(e => decodeURIComponent(e))
        // convert numbers to numbers
        .map(e => {
          if (!isNaN(e)) {
            return +e
          }
          return e
        })
    )
  }
  return []
}
