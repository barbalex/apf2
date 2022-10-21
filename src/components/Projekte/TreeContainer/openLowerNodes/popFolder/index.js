/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import dataGql from './data'

const openLowerNodesPopFolder = async ({ treeName, id, client, store }) => {
  const tree = store[treeName]
  const { addOpenNodes, projIdInActiveNodeArray } = tree
  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const pops = data?.apById?.popsByApId?.nodes ?? []

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [['Projekte', projId, 'Arten', id, 'Populationen']]

  pops.forEach((pop) => {
    const tpops = pop?.tpopsByPopId?.nodes ?? []
    const popbers = pop?.popbersByPopId?.nodes ?? []
    const popmassnbers = pop?.popmassnbersByPopId?.nodes ?? []
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', id, 'Populationen', pop.id],
      [
        'Projekte',
        projId,
        'Arten',
        id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
      ],
      [
        'Projekte',
        projId,
        'Arten',
        id,
        'Populationen',
        pop.id,
        'Kontroll-Berichte',
      ],
      [
        'Projekte',
        projId,
        'Arten',
        id,
        'Populationen',
        pop.id,
        'Massnahmen-Berichte',
      ],
    ]
    popbers.forEach((o) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'Populationen',
          pop.id,
          'Kontroll-Berichte',
          o.id,
        ],
      ]
    })
    popmassnbers.forEach((o) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'Populationen',
          pop.id,
          'Massnahmen-Berichte',
          o.id,
        ],
      ]
    })
    tpops.forEach((tpop) => {
      newOpenNodes = [
        ...newOpenNodes,
        [
          'Projekte',
          projId,
          'Arten',
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
  client.refetchQueries({
    include: ['TreeAllQuery'],
  })
}

export default openLowerNodesPopFolder
