//@flow
/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import get from 'lodash/get'

import dataGql from './data'

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
}) => {
  const tree = mobxStore[treeName]
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { setTreeKey } = mobxStore
  const { projekt, ap, pop } = activeNodes
  const { openNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const tpopkontrs = get(data, 'tpopById.tpopkontrsByTpopId.nodes', [])
  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    ...openNodes,
    [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      pop,
      'Teil-Populationen',
      id,
      'Feld-Kontrollen',
    ],
  ]
  tpopkontrs.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
      ],
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        ap,
        'Populationen',
        pop,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
        'Zaehlungen',
      ],
    ]
    const zaehls = get(k, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
    zaehls.forEach(z => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          ap,
          'Populationen',
          pop,
          'Teil-Populationen',
          id,
          'Feld-Kontrollen',
          k.id,
          'Zaehlungen',
          z.id,
        ],
      ]
    })
  })

  // 3. update openNodes
  setTreeKey({
    tree: tree.name,
    value: newOpenNodes,
    key: 'openNodes',
  })

  // 4. refresh tree
  refetchTree('tpopfeldkontrs')
}
