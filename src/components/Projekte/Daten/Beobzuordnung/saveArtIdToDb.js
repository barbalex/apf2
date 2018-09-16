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
  type,
}) => {
  const variables = {
    id: row.id,
    artId: value,
  }
  updateBeob({ variables })

  // need to close:
  // - beobNode
  // - beobNichtBeurteiltFolderNode
  // - apNode

  // then need to open:
  // - new apNode
  // - new beobNichtBeurteiltFolderNode
  // - new beobNode

  // need to update activeNodeArray and openNodes
  const { activeNodeArray: aNA, openNodes } = tree

  if (value) {
    /*
    let result = {}
    result = await client.query({
      query: gql`
        query Query($id: UUID!) {
          tpopById(id: $id) {
            id
            popId
          }
        }
      `,
      variables: { id: value },
    })
    // aNA = activeNodeArray
    const popId = get(result, 'data.tpopById.popId')
    const artId = get(result, 'data.tpopById.id')
    const newANA = [
      aNA[0],
      aNA[1],
      aNA[2],
      aNA[3],
      'Populationen',
      popId,
      'Teil-Populationen',
      artId,
      'Beobachtungen',
      id,
    ]
    const oldParentNodeUrl = clone(aNA)
    oldParentNodeUrl.pop()
    const oldGParentNodeUrl = clone(oldParentNodeUrl)
    oldGParentNodeUrl.pop()
    const oldGGParentNodeUrl = clone(oldGParentNodeUrl)
    oldGGParentNodeUrl.pop()
    const oldGGGParentNodeUrl = clone(oldGGParentNodeUrl)
    oldGGGParentNodeUrl.pop()
    let newOpenNodes
    if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
      newOpenNodes = [
        ...openNodes.filter(
          n => !isEqual(n, aNA) && !isEqual(n, oldParentNodeUrl),
        ),
        [aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen'],
        [aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          artId,
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          artId,
          'Beobachtungen',
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          artId,
          'Beobachtungen',
          id,
        ],
      ]
    } else {
      newOpenNodes = [
        ...openNodes.filter(
          n =>
            !isEqual(n, aNA) &&
            !isEqual(n, oldParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGGParentNodeUrl),
        ),
        [aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          artId,
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          artId,
          'Beobachtungen',
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          artId,
          'Beobachtungen',
          id,
        ],
      ]
    }
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
  } else {
    const newANA = [
      aNA[0],
      aNA[1],
      aNA[2],
      aNA[3],
      'nicht-beurteilte-Beobachtungen',
      id,
    ]
    const oldParentNodeUrl = clone(aNA)
    oldParentNodeUrl.pop()
    const oldGParentNodeUrl = clone(oldParentNodeUrl)
    oldGParentNodeUrl.pop()
    const oldGGParentNodeUrl = clone(oldGParentNodeUrl)
    oldGGParentNodeUrl.pop()
    const oldGGGParentNodeUrl = clone(oldGGParentNodeUrl)
    oldGGGParentNodeUrl.pop()
    const oldGGGGParentNodeUrl = clone(oldGGGParentNodeUrl)
    oldGGGGParentNodeUrl.pop()
    let newOpenNodes
    if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
      newOpenNodes = [
        ...openNodes.filter(
          n => !isEqual(n, aNA) && !isEqual(n, oldParentNodeUrl),
        ),
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen'],
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen', id],
      ]
    } else {
      newOpenNodes = [
        ...openNodes.filter(
          n =>
            !isEqual(n, aNA) &&
            !isEqual(n, oldParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGGParentNodeUrl) &&
            !isEqual(n, oldGGGParentNodeUrl),
        ),
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen'],
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen', id],
      ]
    }
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
  */
  }
  refetchTree()
}
