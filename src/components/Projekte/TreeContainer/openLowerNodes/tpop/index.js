/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import dataGql from './data'

const openLowerNodesTpop = async ({ treeName, id, client, store }) => {
  const tree = store[treeName]
  const { refetch } = store
  const {
    addOpenNodes,
    popIdInActiveNodeArray,
    projIdInActiveNodeArray,
    apIdInActiveNodeArray,
  } = tree
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const popId = popIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const tpopmassns = data?.tpopById?.tpopmassnsByTpopId?.nodes ?? []
  const tpopmassnbers = data?.tpopById?.tpopmassnbersByTpopId?.nodes ?? []
  const tpopfeldkontrs = data?.tpopById?.tpopfeldkontrs?.nodes ?? []
  const tpopfreiwkontrs = data?.tpopById?.tpopfreiwkontrs?.nodes ?? []
  const tpopbers = data?.tpopById?.tpopbersByTpopId?.nodes ?? []
  const tpopbeobs = data?.tpopById?.beobsByTpopId?.nodes ?? []
  // 2. add activeNodeArrays for all data to openNodes
  // 2.0 add all folders
  let newOpenNodes = [
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Massnahmen',
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Massnahmen-Berichte',
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Feld-Kontrollen',
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Freiwilligen-Kontrollen',
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Kontroll-Berichte',
    ],
    [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      id,
      'Beobachtungen',
    ],
  ]
  // 2.1: tpopmassns
  tpopmassns.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Massnahmen',
        k.id,
      ],
    ]
  })

  // 2.2: tpopmassnbers
  tpopmassnbers.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Massnahmen-Berichte',
        k.id,
      ],
    ]
  })

  // 2.3: tpopfeldkontrs
  tpopfeldkontrs.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
      ],
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Feld-Kontrollen',
        k.id,
        'Zaehlungen',
      ],
    ]
    /*
    const zaehls = (k?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
    zaehls.forEach(z => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          id,
          'Feld-Kontrollen',
          k.id,
          'Zaehlungen',
          z.id,
        ],
      ]
    })*/
  })

  // 2.4: tpopfreiwkontrs
  tpopfreiwkontrs.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
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
        'Aktionspläne',
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
    /*
    const zaehls = (k?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
    zaehls.forEach(z => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Aktionspläne',
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
    })*/
  })

  // 2.5: tpopbers
  tpopbers.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Kontroll-Berichte',
        k.id,
      ],
    ]
  })

  // 2.6: tpopbeobs
  tpopbeobs.forEach((k) => {
    newOpenNodes = [
      ...newOpenNodes,
      [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        id,
        'Beobachtungen',
        k.id,
      ],
    ]
  })

  // 3. update openNodes
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.tree()
}

export default openLowerNodesTpop
