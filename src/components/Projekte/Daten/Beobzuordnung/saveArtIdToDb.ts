import { isEqual } from 'es-toolkit'
import { gql } from '@apollo/client'

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

export const saveArtIdToDb = async ({ value, row, search }) => {
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)
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

  let result = {}
  result = await apolloClient.query({
    query: gql`
      query saveArtIdToDbQuery($id: UUID!) {
        aeTaxonomyById(id: $id) {
          id
          apByArtId {
            id
          }
        }
      }
    `,
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
  ]
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
  ]
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  navigate(`/Daten/${newANA.join('/')}${search}`)
  tsQueryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
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
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobnichtbeurteilt`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
  })
  store.set(setTreeLastTouchedNodeAtom, newANA)
}
