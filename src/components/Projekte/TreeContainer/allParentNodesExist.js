import isEqual from 'lodash/isEqual'

const allParentNodesExist = (nodes, nodePassed) => {
  let parentNodes = []
  const nodeUrl = [...nodePassed.url]
  // pop own url - check only for parents
  nodeUrl.pop()
  for (let i = 1; i < nodeUrl.length; i++) {
    parentNodes.push(nodeUrl.slice(0, i))
  }
  // remove 'Projekte' as that is not contained in openNodes
  parentNodes = parentNodes.filter(
    (n) => !(n.length === 1 && n[0] === 'Projekte'),
  )
  if (parentNodes.length === 0) return true
  const nodeUrls = nodes.map((n) => n.url)
  return parentNodes.every((n) => nodeUrls.some((url) => isEqual(url, n)))
}

export default allParentNodesExist
