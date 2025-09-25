import { isEqual } from 'es-toolkit'
import { gql } from '@apollo/client'
import { getSnapshot } from 'mobx-state-tree'

import { updateBeobById } from './updateBeobById.js'

export const saveArtIdToDb = async ({ value, row, client, store, search }) => {
  const { activeNodeArray, openNodes: openNodesRaw, setOpenNodes } = store.tree
  const aNA = getSnapshot(activeNodeArray)
  const openNodes = getSnapshot(openNodesRaw)

  if (!value) return

  const variables = {
    id: row.id,
    artId: value,
  }
  await client.mutate({
    mutation: updateBeobById,
    variables,
  })

  let result = {}
  result = await client.query({
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
  // aNA = activeNodeArray
  const newApId = result?.data?.aeTaxonomyById?.apByArtId?.id

  // do not navigate if newApId is not found
  if (!newApId) return

  const newANA = [aNA[0], aNA[1], aNA[2], newApId, aNA[4], aNA[5]]
  const oldParentNodeUrl = aNA.toSpliced(-1)
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
        !isEqual(n, aNA) &&
        !isEqual(n, oldParentNodeUrl) &&
        !isEqual(n, oldGParentNodeUrl),
    ),
    [aNA[0], aNA[1], aNA[2], newApId],
    [aNA[0], aNA[1], aNA[2], newApId, aNA[4]],
    [aNA[0], aNA[1], aNA[2], newApId, aNA[4], aNA[5]],
  ]
  setOpenNodes(newOpenNodes)
  store.navigate(`/Daten/${newANA.join('/')}${search}`)
  store.queryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
  })
  store.queryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
}
