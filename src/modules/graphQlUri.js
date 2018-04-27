// @flow
export default () => {
  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'
  return isLocalhost
    ? 'http://localhost:5000/graphql'
    : `https://${window.location.hostname}/graphql`
}
