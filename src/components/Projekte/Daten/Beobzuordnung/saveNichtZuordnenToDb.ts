import { isEqual } from 'es-toolkit'
import type { ApolloClient } from '@apollo/client'
import type { QueryClient } from '@tanstack/react-query'

import { updateBeobById } from './updateBeobById.ts'
import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeAddOpenNodesAtom,
  treeActiveNodeArrayAtom,
  treeOpenNodesAtom,
} from '../../../../store/index.ts'

interface SaveNichtZuordnenToDbParams {
  value: boolean
  id: string
  refetch: () => unknown
  search: string
}

export const saveNichtZuordnenToDb = async ({
  value,
  id,
  refetch: refetchPassed,
  search,
}: SaveNichtZuordnenToDbParams) => {
  // both clients are set during app startup
  const apolloClient = store.get(apolloClientAtom) as ApolloClient
  const tsQueryClient = store.get(tsQueryClientAtom) as QueryClient
  const navigate = store.get(navigateAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  const variables: {
    id: string
    nichtZuordnen: boolean
    tpopId?: null
  } = {
    id,
    nichtZuordnen: value,
  }
  // if true, empty tpopId
  if (value) variables.tpopId = null
  await apolloClient.mutate({
    mutation: updateBeobById,
    variables,
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeAp`],
  })
  // need to update activeNodeArray and openNodes

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
  store.set(treeAddOpenNodesAtom, newOpenNodes)
  navigate?.(`/Daten/${newActiveNodeArray.join('/')}${search}`)
  store.set(setTreeLastTouchedNodeAtom, newActiveNodeArray)
  if (refetchPassed) refetchPassed()
}
