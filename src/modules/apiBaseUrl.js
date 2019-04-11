// in development should return local path

const hostnameWithoutWww = window.location.hostname.replace('www.', '')
const isLocalhost = hostnameWithoutWww === 'localhost'
const apiHost = isLocalhost
  ? 'http://localhost:4001'
  : `https://${window.location.hostname}/api`

export default apiHost
