// in development should return local path
import { isElectron } from './isElectron.js'

export const appBaseUrl = () => {
  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'
  const hostname = isLocalhost ? 'localhost' : window.location.hostname

  const isElectronApp = isElectron()
  if (isElectronApp) {
    return `https://apflora.ch/`
  }

  const appHost =
    isLocalhost ?
      `http://${hostname}:5173/`
      // : 'https://apflora.ch/'
      // also works on apf3.vercel.app with this:
    : `https://${hostname}/`

  return appHost
}
