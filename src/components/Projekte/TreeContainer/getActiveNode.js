import isEqual from 'lodash/isEqual'

export default ({ nodes, activeNodeArray }) =>
  nodes.find(n => isEqual(n.url, activeNodeArray))
