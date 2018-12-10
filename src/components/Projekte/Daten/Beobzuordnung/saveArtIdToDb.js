//@flow
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'

import updateBeobByIdGql from './updateBeobById'

export default async ({ value, row, tree, refetchTree, client, mobxStore }) => {
  const { setTreeKey, refetch } = mobxStore
  const variables = {
    id: row.id,
    artId: value,
  }
  await client.mutate({
    mutation: updateBeobByIdGql,
    variables,
  })

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
    const oldParentNodeUrl = [...aNA]
    oldParentNodeUrl.pop()
    const oldGParentNodeUrl = [...oldParentNodeUrl]
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
    setTreeKey({
      tree: tree.name,
      value: newANA,
      key: 'activeNodeArray',
    })
    setTreeKey({
      tree: tree.name,
      value: newOpenNodes,
      key: 'openNodes',
    })
    //refetchTree('local')
    refetch.aps()
    refetch.pops()
    refetch.tpops()
    refetch.beobNichtZuzuordnens()
    refetch.beobNichtZuzuordnenForMap()
    refetch.beobNichtBeurteilts()
    refetch.beobZugeordnets()
  }
}
