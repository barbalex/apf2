export default () => {
  if (typeof window === 'undefined') {
    return 'https://api.apflora.ch/graphql'
  }
  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'

  return isLocalhost
    ? //? 'http://localhost:5000/graphql'
      'https://api2.apflora.ch/graphql'
    : 'https://api.apflora.ch/graphql'
  //: 'https://api-test.apflora.ch/graphql'
}
