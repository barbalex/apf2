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
  client,
  store,
}: {
  treeName: Object,
  id: String,
  client: Object,
  store: Object,
}) => {
  const tree = store[treeName]
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { refetch } = store
  const { projekt, ap, pop } = activeNodes
  const { addOpenNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const tpopkontrs = get(data, 'tpopById.tpopkontrsByTpopId.nodes', [])
  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
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
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.tpopfeldkontrs()
}
