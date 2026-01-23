/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. make sure every nodeArray is unique in openNodes
 * 4. update openNodes
 * 5. refresh tree
 */
import { query } from './query.ts'
import {
  store,
  apolloClientAtom,
  treeAddOpenNodesAtom,
} from '../../../../../store/index.ts'

export const tpopfreiwkontrFolder = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  popId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
}) => {
  const apolloClient = store.get(apolloClientAtom)

  // 1. load all data
  const { data } = await apolloClient.query({
    query: query,
    variables: { id },
  })
  const tpopkontrs = data?.tpopById?.tpopkontrsByTpopId?.nodes ?? []
  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Freiwilligen-Kontrollen',
    ],
  ]
  tpopkontrs.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Freiwilligen-Kontrollen',
        k.id,
      ],
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Freiwilligen-Kontrollen',
        k.id,
        'Zaehlungen',
      ],
    ]
    const zaehls = k?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
    zaehls.forEach((z) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          id,
          'Freiwilligen-Kontrollen',
          k.id,
          'Zaehlungen',
          z.id,
        ],
      ]
    })
  })

  // 3. update openNodes
  store.set(treeAddOpenNodesAtom, newOpenNodes)
}
