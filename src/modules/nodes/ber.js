import sortBy from 'lodash/sortBy'

export default (store, apArtId) => {
  const { activeUrlElements } = store
  // grab ber as array and sort them by year
  let ber = Array.from(store.table.ber.values())
  // show only nodes of active ap
  ber = ber.filter(a => a.ApArtId === apArtId)
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`ber`)
  if (filterString) {
    ber = ber.filter((p) => {
      const filterValue = `${p.BerJahr || `(kein Jahr)`}: ${p.BerTitel || `(kein Titel)`}`
      return filterValue.includes(filterString)
    })
  }
  // sort
  ber = sortBy(ber, () => `${ber.BerJahr || `(kein Jahr)`}: ${ber.BerTitel || `(kein Titel)`}`)
  // map through all projekt and create array of nodes
  return ber.map((el) => {
    const projId = store.table.ap.get(el.ApArtId).ProjId
    return {
      nodeType: `table`,
      menuType: `ber`,
      id: el.BerId,
      parentId: el.ApArtId,
      label: `${el.BerJahr || `(kein Jahr)`}: ${el.BerTitel || `(kein Titel)`}`,
      expanded: el.BerId === activeUrlElements.ber,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Berichte`, el.BerId],
    }
  })
}
