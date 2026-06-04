import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import { isEqual } from 'date-fns/isEqual'
import { gql } from '@apollo/client'

import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeOpenNodesAtom,
  treeAddOpenNodesAtom,
  treeActiveNodeArrayAtom,
} from '../store/index.ts'
import {
  beob as beobFragment,
  tpop,
  aeTaxonomies,
  popStatusWerte,
} from '../components/shared/fragments.ts'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

const createTpop = gql`
  mutation createTpopFroCreateNewTpopFromBeob(
    $popId: UUID
    $gemeinde: String
    $flurname: String
    $geomPoint: GeoJSON
    $bekanntSeit: Int
  ) {
    createTpop(
      input: {
        tpop: {
          popId: $popId
          gemeinde: $gemeinde
          flurname: $flurname
          geomPoint: $geomPoint
          bekanntSeit: $bekanntSeit
        }
      }
    ) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
const updateBeobById = gql`
  mutation updateBeobForCreateNewTpopFromBeob($beobId: UUID!, $tpopId: UUID) {
    updateBeobById(
      input: {
        id: $beobId
        beobPatch: { id: $beobId, tpopId: $tpopId, nichtZuordnen: false }
      }
    ) {
      beob {
        ...BeobFields
        aeTaxonomyByArtId {
          ...AeTaxonomiesFields
          apByArtId {
            id
            popsByApId {
              nodes {
                id
                tpopsByPopId {
                  nodes {
                    ...TpopFields
                    popStatusWerteByStatus {
                      ...PopStatusWerteFields
                    }
                    popByPopId {
                      id
                      nr
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${aeTaxonomies}
  ${beobFragment}
  ${popStatusWerte}
  ${tpop}
`

export const createNewTpopFromBeob = async ({
  pop,
  beobId,
  projId = '99999999-9999-9999-9999-999999999999',
  apId = '99999999-9999-9999-9999-999999999999',
  search,
}) => {
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)
  const navigate = store.get(navigateAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  let beobResult
  try {
    beobResult = await apolloClient.query({
      query: gql`
        query creteNewTpopFromBeobQuery($beobId: UUID!) {
          beobById(id: $beobId) {
            ...BeobFields
          }
        }
        ${beobFragment}
      `,
      variables: { beobId },
    })
  } catch (error) {
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const beob = beobResult?.data?.beobById ?? {}
  const { datum, data } = beob
  const datumIsValid = isValid(new Date(datum))
  const bekanntSeit = datumIsValid ? +format(new Date(datum), 'yyyy') : null
  const geomPoint =
    beob?.geomPoint?.geojson ? JSON.parse(beob.geomPoint.geojson) : null

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await apolloClient.mutate({
      mutation: createTpop,
      variables: {
        popId: pop.id,
        geomPoint,
        bekannt_seit: bekanntSeit,
        gemeinde: data?.NOM_COMMUNE ? data.NOM_COMMUNE : null,
        flurname: data?.DESC_LOCALITE_ ? data.DESC_LOCALITE_ : null,
      },
    })
  } catch (error) {
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpop = tpopResult?.data?.createTpop?.tpop
  if (!tpop) {
    return addNotification({
      message:
        'Sorry, ein Fehler ist aufgetreten: Die Datenbank hat die ID der neu geschaffenen TPop nicht retourniert',
      options: {
        variant: 'error',
      },
    })
  }

  try {
    await apolloClient.mutate({
      mutation: updateBeobById,
      variables: {
        beobId,
        tpopId: tpop.id,
      },
    })
  } catch (error) {
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }

  // set new activeNodeArray
  const newActiveNodeArray = [
    `Projekte`,
    projId,
    `Arten`,
    apId,
    `Populationen`,
    tpop.popId,
    `Teil-Populationen`,
    tpop.id,
    `Beobachtungen`,
    beobId,
  ]

  const newOpenNodes = [
    ...openNodes,
    // add Beob and it's not yet existing parents to open nodes
    [`Projekte`, projId, `Arten`, apId, `Populationen`],
    [`Projekte`, projId, `Arten`, apId, `Populationen`, tpop.popId],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
      `Beobachtungen`,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
      `Beobachtungen`,
      beobId,
    ],
  ]
    // and remove old node
    .filter((n) => !isEqual(n, activeNodeArray))

  store.set(treeAddOpenNodesAtom, newOpenNodes)
  navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)

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
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeAp`],
  })
  store.set(setTreeLastTouchedNodeAtom, newActiveNodeArray)
}
