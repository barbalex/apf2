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
  treeName: string,
  id: String,
  refetchTree: () => void,
  client: Object,
  mobxStore: Object,
}) => {
  const tree = mobxStore[treeName]
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { setTreeKey } = mobxStore
  const { projekt } = activeNodes
  const { openNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const pops = get(data, 'apById.popsByApId.nodes', [])

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    ...openNodes,
    ['Projekte', projekt, 'Aktionspläne', id, 'Populationen'],
  ]

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

      const tpopmassns = get(tpop, 'tpopmassnsByTpopId.nodes', [])
      const tpopmassnbers = get(tpop, 'tpopmassnbersByTpopId.nodes', [])
      const tpopfeldkontrs = get(tpop, 'tpopfeldkontrs.nodes', [])
      const tpopfreiwkontrs = get(tpop, 'tpopfreiwkontrs.nodes', [])
      const tpopbers = get(tpop, 'tpopbersByTpopId.nodes', [])
      const tpopbeobs = get(tpop, 'beobsByTpopId.nodes', [])

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
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Massnahmen',
        ],
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Massnahmen-Berichte',
        ],
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Feld-Kontrollen',
        ],
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Freiwilligen-Kontrollen',
        ],
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Kontroll-Berichte',
        ],
        [
          'Projekte',
          projekt,
          'Aktionspläne',
          id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Beobachtungen',
        ],
      ]
      tpopmassns.forEach(o => {
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
            'Massnahmen',
            o.id,
          ],
        ]
      })
      tpopmassnbers.forEach(o => {
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
            'Massnahmen-Berichte',
            o.id,
          ],
        ]
      })
      tpopfeldkontrs.forEach(o => {
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
            'Feld-Kontrollen',
            o.id,
          ],
          [
            'Projekte',
            projekt,
            'Aktionspläne',
            id,
            'Populationen',
            pop.id,
            'Teil-Populationen',
            tpop.id,
            'Feld-Kontrollen',
            o.id,
            'Zaehlungen',
          ],
        ]
        const zaehls = get(o, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
        zaehls.forEach(z => {
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
              'Feld-Kontrollen',
              o.id,
              'Zaehlungen',
              z.id,
            ],
          ]
        })
      })
      tpopfreiwkontrs.forEach(o => {
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
            'Freiwilligen-Kontrollen',
            o.id,
          ],
          [
            'Projekte',
            projekt,
            'Aktionspläne',
            id,
            'Populationen',
            pop.id,
            'Teil-Populationen',
            tpop.id,
            'Freiwilligen-Kontrollen',
            o.id,
            'Zaehlungen',
          ],
        ]
        const zaehls = get(o, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
        zaehls.forEach(z => {
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
              'Freiwilligen-Kontrollen',
              o.id,
              'Zaehlungen',
              z.id,
            ],
          ]
        })
      })
      tpopbers.forEach(o => {
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
            'Kontroll-Berichte',
            o.id,
          ],
        ]
      })
      tpopbeobs.forEach(o => {
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
            'Beobachtungen',
            o.id,
          ],
        ]
      })
    })
  })

  // 3. update openNodes
  setTreeKey({
    tree: tree.name,
    value: newOpenNodes,
    key: 'openNodes',
  })

  // 4. refresh tree
  refetchTree('pops')
}
