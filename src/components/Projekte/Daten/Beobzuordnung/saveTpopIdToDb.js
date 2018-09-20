//@flow
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import setTreeKeyGql from './setTreeKey.graphql'

export default async ({ value, id, updateBeob, tree, refetchTree, type }) => {
  const { client } = app
  const variables = {
    id,
    tpopId: value,
  }
  if (value) variables.nichtZuordnen = false
  // if value, set nichtZuordnen false
  if (!!value) variables.nichtZuordnen = false
  updateBeob({ variables })

  // need to update activeNodeArray and openNodes
  const { activeNodeArray: aNA, openNodes } = tree

  if (value) {
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
    const tpopId = get(result, 'data.tpopById.id')
    const newANA = [
      aNA[0],
      aNA[1],
      aNA[2],
      aNA[3],
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
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
          tpopId,
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
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
          tpopId,
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
          tpopId,
        ],
        [
          aNA[0],
          aNA[1],
          aNA[2],
          aNA[3],
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
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
          tpopId,
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
  }
  refetchTree('beobZugeordnets')
  refetchTree('beobNichtBeurteilts')
  refetchTree('beobNichtZuzuordnens')
}
