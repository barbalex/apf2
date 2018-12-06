// @flow
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import isEqual from 'date-fns/isEqual'
import get from 'lodash/get'

import queryBeob from './queryBeob'
import createPop from './createPop'
import createTpop from './createTpop'
import updateBeobById from './updateBeobById'

export default async ({
  treeName,
  id,
  refetchTree,
  client,
  mobxStore,
}: {
  treeName: Object,
  id: String,
  refetchTree: () => void,
  client: Object,
  mobxStore: Object,
}): Promise<void> => {
  const { setTreeKey, addError } = mobxStore
  const tree = mobxStore[treeName]
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  let beobResult
  try {
    beobResult = await client.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return addError(error)
  }
  const beob = get(beobResult, 'data.beobById')
  const { x, y, datum, data } = beob
  const datumIsValid = isValid(new Date(datum))
  const bekanntSeit = datumIsValid ? format(new Date(datum), 'YYYY') : null

  // create new pop for ap
  let popResult
  try {
    popResult = await client.mutate({
      mutation: createPop,
      variables: {
        apId: ap,
        x,
        y,
        bekanntSeit,
      },
    })
  } catch (error) {
    return addError(error)
  }
  const pop = get(popResult, 'data.createPop.pop')

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await client.mutate({
      mutation: createTpop,
      variables: {
        popId: pop.id,
        x,
        y,
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
        id,
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
    id,
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
      id,
    ],
  ]
    // and remove old node
    .filter(n => !isEqual(n, tree.activeNodeArray))

  setTreeKey({
    value: newOpenNodes,
    tree: tree.name,
    key: 'openNodes',
  })
  // set new activeNodeArray
  setTreeKey({
    value: newActiveNodeArray,
    tree: tree.name,
    key: 'activeNodeArray',
  })

  refetchTree('local')
  refetchTree('aps')
  refetchTree('pops')
  refetchTree('tpops')
  refetchTree('beobNichtZuzuordnens')
  refetchTree('beobNichtBeurteilts')
  refetchTree('beobZugeordnets')
}
