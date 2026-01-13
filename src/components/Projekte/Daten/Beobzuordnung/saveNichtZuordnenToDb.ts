import { isEqual } from 'es-toolkit'

import { updateBeobById } from './updateBeobById.js'

export const saveNichtZuordnenToDb = async ({
  value,
  id,
  refetch: refetchPassed,
  apolloClient,
  store,
  search,
}) => {
  const variables = {
    id,
    nichtZuordnen: value,
  }
  // if true, empty tpopId
  if (value) variables.tpopId = null
  await apolloClient.mutate({
    mutation: updateBeobById,
    variables,
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeAp`],
  })
  // need to update activeNodeArray and openNodes
  const { activeNodeArray, openNodes, addOpenNodes } = store.tree

  let newActiveNodeArray = [...activeNodeArray]
  newActiveNodeArray[4] =
    value ?
      'nicht-zuzuordnende-Beobachtungen'
    : 'nicht-beurteilte-Beobachtungen'
  newActiveNodeArray[5] = id
  newActiveNodeArray = newActiveNodeArray.slice(0, 6)
  const oldParentNodeUrl = activeNodeArray.toSpliced(-1)
  const newParentNodeUrl = newActiveNodeArray.toSpliced(-1)
  const newOpenNodes = openNodes.map((n) => {
    if (isEqual(n, activeNodeArray)) return newActiveNodeArray
    if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
    return n
  })
  addOpenNodes(newOpenNodes)
  store.navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
  store.tree.setLastTouchedNode(newActiveNodeArray)
  if (refetchPassed) refetchPassed()
}
