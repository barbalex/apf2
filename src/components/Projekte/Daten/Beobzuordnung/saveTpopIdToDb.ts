import { isEqual } from 'es-toolkit'
import type { ApolloClient } from '@apollo/client'
import type { QueryClient } from '@tanstack/react-query'
import { graphql } from '../../../../gql/index.ts'

import { updateBeobById } from './updateBeobById.ts'
import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeActiveNodeArrayAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

interface SaveTpopIdToDbParams {
  value: string | number | null
  id: string
  type: string
  search: string
}

export const saveTpopIdToDb = async ({
  value,
  id,
  type,
  search,
}: SaveTpopIdToDbParams) => {
  // both clients are set during app startup
  const apolloClient = store.get(apolloClientAtom) as ApolloClient
  const tsQueryClient = store.get(tsQueryClientAtom) as QueryClient
  const navigate = store.get(navigateAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  const openNodesRaw = store.get(treeOpenNodesAtom)
  const openNodes = openNodesRaw ?? []

  const variables: {
    id: string
    tpopId: string | number | null
    nichtZuordnen?: boolean
  } = {
    id,
    tpopId: value,
  }
  if (value) variables.nichtZuordnen = false
  // if value, set nichtZuordnen false
  if (value) variables.nichtZuordnen = false
  await apolloClient.mutate({
    mutation: updateBeobById,
    variables,
  })

  // need to update activeNodeArray and openNodes
  let newANA: (string | number)[]
  let newOpenNodes: (string | number)[][]

  if (value) {
    const result = await apolloClient.query({
      query: graphql(`
        query saveTpopIdToDbQuery($id: UUID!) {
          tpopById(id: $id) {
            id
            popId
          }
        }
      `),
      // value is a tpop id (a UUID string)
      variables: { id: value as string },
    })
    // activeNodeArray is already loaded
    const popId = result?.data?.tpopById?.popId
    const tpopId = result?.data?.tpopById?.id
    newANA = [
      activeNodeArray[0],
      activeNodeArray[1],
      activeNodeArray[2],
      activeNodeArray[3],
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Beobachtungen',
      id,
    ] as (string | number)[]
    const oldParentNodeUrl = activeNodeArray.toSpliced(-1)
    const oldGParentNodeUrl = oldParentNodeUrl.toSpliced(-1)
    const oldGGParentNodeUrl = oldGParentNodeUrl.toSpliced(-1)
    const oldGGGParentNodeUrl = oldGGParentNodeUrl.toSpliced(-1)

    if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
      newOpenNodes = [
        ...openNodes.filter(
          (n) => !isEqual(n, activeNodeArray) && !isEqual(n, oldParentNodeUrl),
        ),
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Beobachtungen',
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Beobachtungen',
          id,
        ],
      ] as (string | number)[][]
    } else {
      // type = zugeordnet?
      newOpenNodes = [
        ...openNodes.filter(
          (n) =>
            !isEqual(n, activeNodeArray) &&
            !isEqual(n, oldParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGGParentNodeUrl) &&
            !isEqual(n, oldGGGParentNodeUrl),
        ),
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Beobachtungen',
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Beobachtungen',
          id,
        ],
      ] as (string | number)[][]
    }
  } else {
    // needs to go to nicht-beurteilte-Beobachtungen
    newANA = [
      activeNodeArray[0],
      activeNodeArray[1],
      activeNodeArray[2],
      activeNodeArray[3],
      'nicht-beurteilte-Beobachtungen',
      id,
    ] as (string | number)[]
    const oldParentNodeUrl = activeNodeArray.toSpliced(-1)
    const oldGParentNodeUrl = oldParentNodeUrl.toSpliced(-1)
    const oldGGParentNodeUrl = oldGParentNodeUrl.toSpliced(-1)
    const oldGGGParentNodeUrl = oldGGParentNodeUrl.toSpliced(-1)
    const oldGGGGParentNodeUrl = oldGGGParentNodeUrl.toSpliced(-1)

    if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
      newOpenNodes = [
        ...openNodes.filter(
          (n) => !isEqual(n, activeNodeArray) && !isEqual(n, oldParentNodeUrl),
        ),
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'nicht-beurteilte-Beobachtungen',
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'nicht-beurteilte-Beobachtungen',
          id,
        ],
      ] as (string | number)[][]
    } else {
      newOpenNodes = [
        ...openNodes.filter(
          (n) =>
            !isEqual(n, activeNodeArray) &&
            !isEqual(n, oldParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGGParentNodeUrl) &&
            !isEqual(n, oldGGGParentNodeUrl) &&
            !isEqual(n, oldGGGGParentNodeUrl),
        ),
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'nicht-beurteilte-Beobachtungen',
        ],
        [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
          activeNodeArray[3],
          'nicht-beurteilte-Beobachtungen',
          id,
        ],
      ] as (string | number)[][]
    }
  }
  navigate?.(`/Daten/${newANA.join('/')}${search}`)
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  void tsQueryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`BeobZugeordnetForMapQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`BeobNichtBeurteiltForMapQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`BeobAssignLinesQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeAp`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobnichtbeurteilt`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  setTimeout(() => store.set(setTreeLastTouchedNodeAtom, newANA), 1000)
}
