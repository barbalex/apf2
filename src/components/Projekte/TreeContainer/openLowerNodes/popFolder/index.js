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
  treeName: string,
  id: String,
  client: Object,
  store: Object,
}) => {
  const tree = store[treeName]
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { refetch } = store
  const { projekt } = activeNodes
  const { addOpenNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const pops = get(data, 'apById.popsByApId.nodes', [])

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [['Projekte', projekt, 'Aktionspläne', id, 'Populationen']]

  pops.forEach(pop => {
    const tpops = get(pop, 'tpopsByPopId.nodes', [])
    const popbers = get(pop, 'popbersByPopId.nodes', [])
    const popmassnbers = get(pop, 'popmassnbersByPopId.nodes', [])
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projekt, 'Aktionspläne', id, 'Populationen', pop.id],
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
      ],
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        id,
        'Populationen',
        pop.id,
        'Kontroll-Berichte',
      ],
      [
        'Projekte',
        projekt,
        'Aktionspläne',
        id,
        'Populationen',
        pop.id,
        'Massnahmen-Berichte',
      ],
    ]
    popbers.forEach(o => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Kontroll-Berichte',
          o.id,
        ],
      ]
    })
    popmassnbers.forEach(o => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Massnahmen-Berichte',
          o.id,
        ],
      ]
    })
    tpops.forEach(tpop => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
        ],
      ]
    })
  })

  // 3. update openNodes
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.pops()
}
