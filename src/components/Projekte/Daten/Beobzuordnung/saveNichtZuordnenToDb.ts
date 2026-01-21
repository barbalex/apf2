import { isEqual } from 'es-toolkit'

import { updateBeobById } from './updateBeobById.ts'
import {
  store as jotaiStore,
  apolloClientAtom,
  tsQueryClientAtom,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
} from '../../../../JotaiStore/index.ts'

export const saveNichtZuordnenToDb = async ({
  value,
  id,
  refetch: refetchPassed,
  store,
  search,
}) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const tsQueryClient = jotaiStore.get(tsQueryClientAtom)
  const navigate = jotaiStore.get(navigateAtom)
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
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  tsQueryClient.invalidateQueries({
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
  navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
  jotaiStore.set(setTreeLastTouchedNodeAtom, newActiveNodeArray)
  if (refetchPassed) refetchPassed()
}
