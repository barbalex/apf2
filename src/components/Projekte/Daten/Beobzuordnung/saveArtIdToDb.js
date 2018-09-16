//@flow
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'

import setTreeKeyGql from './setTreeKey.graphql'

export default async ({
  value,
  row,
  updateBeob,
  tree,
  client,
  refetchTree,
}) => {
  const variables = {
    id: row.id,
    artId: value,
  }
  await updateBeob({ variables })

  // need to update activeNodeArray and openNodes
  const { activeNodeArray: aNA, openNodes } = tree

  if (value) {
    let result = {}
    result = await client.query({
      query: gql`
        query Query($id: UUID!) {
          aeEigenschaftenById(id: $id) {
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
    const newApId = get(result, 'data.aeEigenschaftenById.apByArtId.id')
    const newANA = [aNA[0], aNA[1], aNA[2], newApId, aNA[4], aNA[5]]
    const oldParentNodeUrl = clone(aNA)
    oldParentNodeUrl.pop()
    const oldGParentNodeUrl = clone(oldParentNodeUrl)
    oldGParentNodeUrl.pop()

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
        n =>
          !isEqual(n, aNA) &&
          !isEqual(n, oldParentNodeUrl) &&
          !isEqual(n, oldGParentNodeUrl),
      ),
      [aNA[0], aNA[1], aNA[2], newApId],
      [aNA[0], aNA[1], aNA[2], newApId, aNA[4]],
      [aNA[0], aNA[1], aNA[2], newApId, aNA[4], aNA[5]],
    ]
    await client.mutate({
      mutation: setTreeKeyGql,
      variables: {
        tree: tree.name,
        value1: newANA,
        key1: 'activeNodeArray',
        value2: newOpenNodes,
        key2: 'openNodes',
      },
    })
    /*console.log('saveArtIdToDb done:', {
      aNA,
      openNodes,
      row,
      newApId,
      newANA,
      newOpenNodes,
    })*/
    //refetchTree()
  }
}
