/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import dataGql from './data'

const openLowerNodesPop = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
  client,
  store,
  queryClient,
}) => {
  const tree = store.tree
  const { addOpenNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id },
  })
  const tpops = data?.popById?.tpopsByPopId?.nodes ?? []
  const popbers = data?.popById?.popbersByPopId?.nodes ?? []
  const popmassnbers = data?.popById?.popmassnbersByPopId?.nodes ?? []
  // 2. add activeNodeArrays for all data to openNodes
  const newOpenNodes = [
    ['Projekte', projId, 'Arten', apId, 'Populationen', id],
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Teil-Populationen',
    ],
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Kontroll-Berichte',
    ],
    [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Massnahmen-Berichte',
    ],
    ...popbers.map((o) => [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Kontroll-Berichte',
      o.id,
    ]),
    ...popmassnbers.map((o) => [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Massnahmen-Berichte',
      o.id,
    ]),
    ...tpops.map((o) => [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      id,
      'Teil-Populationen',
      o.id,
    ]),
  ]

  // 3. update openNodes
  addOpenNodes(newOpenNodes)

  // 4. refresh tree
  queryClient.invalidateQueries({ queryKey: [`treeQuery`] })
}

export default openLowerNodesPop
