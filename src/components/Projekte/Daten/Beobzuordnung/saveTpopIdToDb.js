import isEqual from 'lodash/isEqual'
import { gql } from '@apollo/client'
import { getSnapshot } from 'mobx-state-tree'

import { updateBeobById } from './updateBeobById.js'

export const saveTpopIdToDb = async ({
  value,
  id,
  type,
  client,
  store,
  search,
}) => {
  const variables = {
    id,
    tpopId: value,
  }
  if (value) variables.nichtZuordnen = false
  // if value, set nichtZuordnen false
  if (value) variables.nichtZuordnen = false
  await client.mutate({
    mutation: updateBeobById,
    variables,
  })

  // need to update activeNodeArray and openNodes
  const { activeNodeArray, openNodes: openNodesRaw, setOpenNodes } = store.tree
  const aNA = getSnapshot(activeNodeArray)
  const openNodes = getSnapshot(openNodesRaw)
  let newANA
  let newOpenNodes

  if (value) {
    let result = {}
    result = await client.query({
      query: gql`
        query saveTpopIdToDbQuery($id: UUID!) {
          tpopById(id: $id) {
            id
            popId
          }
        }
      `,
      variables: { id: value },
    })
    // aNA = activeNodeArray
    const popId = result?.data?.tpopById?.popId
    const tpopId = result?.data?.tpopById?.id
    newANA = [
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
    const oldParentNodeUrl = aNA.toSpliced(-1)
    const oldGParentNodeUrl = oldParentNodeUrl.toSpliced(-1)
    const oldGGParentNodeUrl = oldGParentNodeUrl.toSpliced(-1)
    const oldGGGParentNodeUrl = oldGGParentNodeUrl.toSpliced(-1)

    if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
      newOpenNodes = [
        ...openNodes.filter(
          (n) => !isEqual(n, aNA) && !isEqual(n, oldParentNodeUrl),
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
      // type = zugeordnet?
      newOpenNodes = [
        ...openNodes.filter(
          (n) =>
            !isEqual(n, aNA) &&
            !isEqual(n, oldParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGGParentNodeUrl) &&
            !isEqual(n, oldGGGParentNodeUrl),
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
  } else {
    // needs to go to nicht-beurteilte-Beobachtungen
    newANA = [
      aNA[0],
      aNA[1],
      aNA[2],
      aNA[3],
      'nicht-beurteilte-Beobachtungen',
      id,
    ]
    const oldParentNodeUrl = aNA.toSpliced(-1)
    const oldGParentNodeUrl = oldParentNodeUrl.toSpliced(-1)
    const oldGGParentNodeUrl = oldGParentNodeUrl.toSpliced(-1)
    const oldGGGParentNodeUrl = oldGGParentNodeUrl.toSpliced(-1)
    const oldGGGGParentNodeUrl = oldGGGParentNodeUrl.toSpliced(-1)

    if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
      newOpenNodes = [
        ...openNodes.filter(
          (n) => !isEqual(n, aNA) && !isEqual(n, oldParentNodeUrl),
        ),
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen'],
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen', id],
      ]
    } else {
      newOpenNodes = [
        ...openNodes.filter(
          (n) =>
            !isEqual(n, aNA) &&
            !isEqual(n, oldParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGParentNodeUrl) &&
            !isEqual(n, oldGGParentNodeUrl) &&
            !isEqual(n, oldGGGParentNodeUrl) &&
            !isEqual(n, oldGGGGParentNodeUrl),
        ),
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen'],
        [aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen', id],
      ]
    }
  }
  store.navigate(`/Daten/${newANA.join('/')}${search}`)
  setOpenNodes(newOpenNodes)
  client.refetchQueries({
    include: [
      'KarteBeobNichtZuzuordnenQuery',
      'BeobZugeordnetForMapQuery',
      'BeobNichtBeurteiltForMapQuery',
      'BeobAssignLinesQuery',
    ],
  })
  store.queryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
  })
  store.queryClient.invalidateQueries({
    queryKey: [`treeBeobnichtbeurteilt`],
  })
  store.queryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
}
