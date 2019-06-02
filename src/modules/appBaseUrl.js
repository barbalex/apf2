// in development should return local path

export default () => {
  if (typeof window === 'undefined') return
  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'
  const hostname = isLocalhost ? 'localhost' : window.location.hostname

  const appHost = isLocalhost
    ? `http://${hostname}:8000/`
    : 'https://apflora.ch/'
  //: `https://${hostname}/`

  return appHost
}
