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

export const saveTpopIdToDb = async ({ value, id, type, search }) => {
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)
  const navigate = store.get(navigateAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  const openNodesRaw = store.get(treeOpenNodesAtom)

  const variables = {
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
  let newANA
  let newOpenNodes

  if (value) {
    let result = {}
    result = await apolloClient.query({
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
    ]
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
      ]
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
      ]
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
    ]
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
      ]
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
      ]
    }
  }
  navigate(`/Daten/${newANA.join('/')}${search}`)
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  tsQueryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`BeobZugeordnetForMapQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`BeobNichtBeurteiltForMapQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`BeobAssignLinesQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
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
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  setTimeout(() => store.set(setTreeLastTouchedNodeAtom, newANA), 1000)
}
