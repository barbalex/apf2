import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import isEqual from 'date-fns/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'

import {
  beob as beobFragment,
  tpop,
  aeEigenschaften,
  beobQuelleWerte,
  popStatusWerte,
} from '../components/shared/fragments'

const createTpop = gql`
  mutation createTpop(
    $popId: UUID
    $gemeinde: String
    $flurname: String
    $geomPoint: String
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
  mutation updateBeob($beobId: UUID!, $tpopId: UUID) {
    updateBeobById(
      input: { id: $beobId, beobPatch: { id: $beobId, tpopId: $tpopId } }
    ) {
      beob {
        ...BeobFields
        aeEigenschaftenByArtId {
          ...AeEigenschaftenFields
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
        beobQuelleWerteByQuelleId {
          ...BeobQuelleWerteFields
        }
      }
    }
  }
  ${aeEigenschaften}
  ${beobFragment}
  ${beobQuelleWerte}
  ${popStatusWerte}
  ${tpop}
`

export default async ({ treeName, pop, beobId, client, store }) => {
  const { addError, refetch } = store
  const tree = store[treeName]
  const { setActiveNodeArray, setOpenNodes } = tree
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  let beobResult
  try {
    beobResult = await client.query({
      query: gql`
        query Query($beobId: UUID!) {
          beobById(id: $beobId) {
            ...BeobFields
          }
        }
        ${beobFragment}
      `,
      variables: { beobId },
    })
  } catch (error) {
    return addError(error)
  }
  const beob = get(beobResult, 'data.beobById')
  const { geomPoint, datum, data } = beob
  const datumIsValid = isValid(new Date(datum))
  const bekanntSeit = datumIsValid ? +format(new Date(datum), 'yyyy') : null

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await client.mutate({
      mutation: createTpop,
      variables: {
        popId: pop.id,
        geomPoint,
        bekannt_seit: bekanntSeit,
        gemeinde: data.NOM_COMMUNE ? data.NOM_COMMUNE : null,
        flurname: data.DESC_LOCALITE_ ? data.DESC_LOCALITE_ : null,
      },
    })
  } catch (error) {
    return addError(error)
  }
  const tpop = get(tpopResult, 'data.createTpop.tpop')

  try {
    await client.mutate({
      mutation: updateBeobById,
      variables: {
        beobId,
        tpopId: tpop.id,
      },
    })
  } catch (error) {
    return addError(error)
  }

  // set new activeNodeArray
  const newActiveNodeArray = [
    `Projekte`,
    projekt,
    `Aktionspläne`,
    ap,
    `Populationen`,
    tpop.popId,
    `Teil-Populationen`,
    tpop.id,
    `Beobachtungen`,
    beobId,
  ]

  let newOpenNodes = [
    ...tree.openNodes,
    // add Beob and it's not yet existing parents to open nodes
    [`Projekte`, projekt, `Aktionspläne`, ap, `Populationen`],
    [`Projekte`, projekt, `Aktionspläne`, ap, `Populationen`, tpop.popId],
    [
      `Projekte`,
      projekt,
      `Aktionspläne`,
      ap,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
    ],
    [
      `Projekte`,
      projekt,
      `Aktionspläne`,
      ap,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
    ],
    [
      `Projekte`,
      projekt,
      `Aktionspläne`,
      ap,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
      `Beobachtungen`,
    ],
    [
      `Projekte`,
      projekt,
      `Aktionspläne`,
      ap,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
      `Beobachtungen`,
      beobId,
    ],
  ]
    // and remove old node
    .filter(n => !isEqual(n, tree.activeNodeArray))

  setOpenNodes(newOpenNodes)
  setActiveNodeArray(newActiveNodeArray)

  refetch.aps()
  refetch.pops()
  refetch.tpops()
  refetch.beobNichtZuzuordnens()
  if (refetch.beobNichtZuzuordnenForMap) refetch.beobNichtZuzuordnenForMap()
  refetch.beobNichtBeurteilts()
  refetch.beobZugeordnets()
}
