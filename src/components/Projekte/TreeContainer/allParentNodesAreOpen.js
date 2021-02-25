import isNodeOpen from './isNodeOpen'

const allParentNodesAreOpen = (openNodes, urlPassed) => {
  let parentNodes = []
  const url = [...urlPassed]
  for (let i = 1; i < url.length; i++) {
    parentNodes.push(url.slice(0, i))
  }
  // remove 'Projekte' as that is not contained in openNodes
  parentNodes = parentNodes.filter(
    (n) => !(n.length === 1 && n[0] === 'Projekte'),
  )
  if (parentNodes.length === 0) return true
  return parentNodes.every((n) => isNodeOpen({ openNodes, url: n }))
}

export default allParentNodesAreOpen
