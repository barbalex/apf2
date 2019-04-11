//@flow
import isEqual from 'lodash/isEqual'

import updateBeobByIdGql from './updateBeobById'

export default async ({
  value,
  id,
  treeName,
  refetch: refetchPassed,
  client,
  store,
}) => {
  const { refetch } = store
  const variables = {
    id,
    nichtZuordnen: value,
  }
  // if true, empty tpopId
  if (value) variables.tpopId = null
  await client.mutate({
    mutation: updateBeobByIdGql,
    variables,
  })
  // need to update activeNodeArray and openNodes
  const {
    activeNodeArray,
    setActiveNodeArray,
    openNodes,
    addOpenNodes,
  } = store[treeName]
  let newActiveNodeArray = [...activeNodeArray]
  newActiveNodeArray[4] = value
    ? 'nicht-zuzuordnende-Beobachtungen'
    : 'nicht-beurteilte-Beobachtungen'
  newActiveNodeArray[5] = id
  newActiveNodeArray = newActiveNodeArray.slice(0, 6)
  const oldParentNodeUrl = [...activeNodeArray]
  oldParentNodeUrl.pop()
  const newParentNodeUrl = [...newActiveNodeArray]
  newParentNodeUrl.pop()
  const newOpenNodes = openNodes.map(n => {
    if (isEqual(n, activeNodeArray)) return newActiveNodeArray
    if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
    return n
  })
  setActiveNodeArray(newActiveNodeArray)
  addOpenNodes(newOpenNodes)
  if (refetchPassed) refetchPassed()
  //refetchTree('local')
  refetch.aps()
  refetch.pops()
  refetch.tpops()
  refetch.beobNichtZuzuordnens()
  if (refetch.beobNichtZuzuordnenForMap) refetch.beobNichtZuzuordnenForMap()
  refetch.beobNichtBeurteilts()
  refetch.beobZugeordnets()
}
