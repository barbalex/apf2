/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. make sure every nodeArray is unique in openNodes
 * 4. update openNodes
 * 5. refresh tree
 */
import dataGql from './data'

const openLowerNodesTpopfreiwkontrFolder = async ({
  treeName,
  id,
  client,
  store,
}) => {
  const tree = store[treeName]
  const { refetch } = store
  const {
    addOpenNodes,
    projIdInActiveNodeArray,
    apIdInActiveNodeArray,
    popIdInActiveNodeArray,
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
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  refetch.tree()
}

export default openLowerNodesTpopfreiwkontrFolder
