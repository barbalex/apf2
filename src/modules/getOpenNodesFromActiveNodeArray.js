export const getOpenNodesFromActiveNodeArray = (activeNodeArray) =>
  activeNodeArray.map((n, index) => activeNodeArray.slice(0, index + 1))
