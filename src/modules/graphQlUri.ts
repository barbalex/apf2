import { isElectron } from './isElectron.js'

export const graphQlUri = () => {
  const isElectronApp = isElectron()
  if (isElectronApp) {
    return `https://api.apflora.ch/graphql`
  }

  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'

  return isLocalhost ?
      'http://localhost:5000/graphql'
    : 'https://api.apflora.ch/graphql'
}
