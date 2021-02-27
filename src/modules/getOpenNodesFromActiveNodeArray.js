const getOpenNodesFromActiveNodeArray = (activeNodeArray) =>
  activeNodeArray.map((n, index) => activeNodeArray.slice(0, index + 1))

export default getOpenNodesFromActiveNodeArray
