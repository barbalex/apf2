import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import isEqual from 'date-fns/isEqual'

import queryBeob from './queryBeob'
import createPop from './createPop'
import createTpop from './createTpop'
import updateBeobById from './updateBeobById'

const createNewPopFromBeob = async ({ treeName, id, client, store }) => {
  const { enqueNotification, refetch } = store
  const tree = store[treeName]
  const {
    setActiveNodeArray,
    addOpenNodes,
    apIdInActiveNodeArray,
    projIdInActiveNodeArray,
  } = tree

  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'

  let beobResult
  try {
    beobResult = await client.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const beob = beobResult?.data?.beobById
  const { geomPoint, datum, data } = beob
  const datumIsValid = isValid(new Date(datum))
  const bekanntSeit = datumIsValid ? +format(new Date(datum), 'yyyy') : null

  const newGeomPoint = geomPoint?.geojson
    ? JSON.parse(geomPoint?.geojson)
    : null

  // create new pop for ap
  let popResult
  try {
    popResult = await client.mutate({
      mutation: createPop,
      variables: {
        apId,
        geomPoint: newGeomPoint,
        bekanntSeit,
      },
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const pop = popResult?.data?.createPop?.pop

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await client.mutate({
      mutation: createTpop,
      variables: {
        popId: pop.id,
        geomPoint: newGeomPoint,
        bekannt_seit: bekanntSeit,
        gemeinde: data.NOM_COMMUNE ? data.NOM_COMMUNE : null,
        flurname: data.DESC_LOCALITE_ ? data.DESC_LOCALITE_ : null,
      },
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpop = tpopResult?.data?.createTpop?.tpop

  try {
    await client.mutate({
      mutation: updateBeobById,
      variables: {
        id,
        tpopId: tpop.id,
      },
    })
  } catch (error) {
    return enqueNotification({
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
    id,
  ]

  let newOpenNodes = [
    ...tree.openNodes,
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
      id,
    ],
  ]
    // and remove old node
    .filter((n) => !isEqual(n, tree.activeNodeArray))

  addOpenNodes(newOpenNodes)
  setActiveNodeArray(newActiveNodeArray)

  // TODO: what is this for?
  //refetchTree('local')
  refetch.tree()
  if (refetch.beobNichtZuzuordnenForMap) refetch.beobNichtZuzuordnenForMap()
}

export default createNewPopFromBeob
