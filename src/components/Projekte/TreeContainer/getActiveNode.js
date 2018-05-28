//@flow
import isEqual from 'lodash/isEqual'

export default ({
  nodes,
  activeNodeArray
}:{
  nodes: Array<Object>,
  activeNodeArray: Array<String>
}) => nodes.find(n => isEqual(n.url, activeNodeArray))
