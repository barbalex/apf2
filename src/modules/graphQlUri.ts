export const graphQlUri = () => {
  // check localhost BEFORE electron:
  // embedded browsers (electron host, IDE previews) would otherwise
  // silently talk to the production api while developing locally
  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'

  return isLocalhost ?
      'http://localhost:5000/graphql'
    : 'https://api.apflora.ch/graphql'
}
