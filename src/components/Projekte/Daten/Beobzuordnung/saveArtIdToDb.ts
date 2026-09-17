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

interface SaveArtIdToDbParams {
  value: string
  row: {
    id?: string
  }
  search: string
}

export const saveArtIdToDb = async ({
  value,
  row,
  search,
}: SaveArtIdToDbParams) => {
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  // both clients are set during app startup
  const apolloClient = store.get(apolloClientAtom) as ApolloClient
  const tsQueryClient = store.get(tsQueryClientAtom) as QueryClient
  const navigate = store.get(navigateAtom)

  if (!value) return

  const variables = {
    id: row.id,
    artId: value,
  }
  await apolloClient.mutate({
    mutation: updateBeobById,
    variables,
  })

  const result = await apolloClient.query({
    query: graphql(`
      query saveArtIdToDbQuery($id: UUID!) {
        aeTaxonomyById(id: $id) {
          id
          apByArtId {
            id
          }
        }
      }
    `),
    variables: { id: value },
  })
  // activeNodeArray is already loaded
  const newApId = result?.data?.aeTaxonomyById?.apByArtId?.id

  // do not navigate if newApId is not found
  if (!newApId) return

  const newANA = [
    activeNodeArray[0],
    activeNodeArray[1],
    activeNodeArray[2],
    newApId,
    activeNodeArray[4],
    activeNodeArray[5],
  ] as (string | number)[]
  const oldParentNodeUrl = activeNodeArray.toSpliced(-1)
  const oldGParentNodeUrl = oldParentNodeUrl.toSpliced(-1)

  // need to close:
  // - beobNode
  // - beobNichtBeurteiltFolderNode
  // - apNode

  // then need to open:
  // - new apNode
  // - new beobNichtBeurteiltFolderNode
  // - new beobNode
  const newOpenNodes = [
    ...openNodes.filter(
      (n) =>
        !isEqual(n, activeNodeArray) &&
        !isEqual(n, oldParentNodeUrl) &&
        !isEqual(n, oldGParentNodeUrl),
    ),
    [activeNodeArray[0], activeNodeArray[1], activeNodeArray[2], newApId],
    [
      activeNodeArray[0],
      activeNodeArray[1],
      activeNodeArray[2],
      newApId,
      activeNodeArray[4],
    ],
    [
      activeNodeArray[0],
      activeNodeArray[1],
      activeNodeArray[2],
      newApId,
      activeNodeArray[4],
      activeNodeArray[5],
    ],
  ] as (string | number)[][]
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  navigate?.(`/Daten/${newANA.join('/')}${search}`)
  void tsQueryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
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
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobnichtbeurteilt`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
  })
  store.set(setTreeLastTouchedNodeAtom, newANA)
}
