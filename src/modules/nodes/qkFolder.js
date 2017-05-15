// @flow
import findIndex from 'lodash/findIndex'
import reduce from 'lodash/reduce'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId },
  )

  const qk = store.qk.get(apArtId)
  let nrOfQkMessages = 0
  if (qk && qk.messagesFiltered) {
    // need to count nr of urls, not nr of messages
    const nrOfUrls = reduce(
      qk.messagesFiltered,
      (sum, n) => sum + n.url.length,
      0,
    )
    nrOfQkMessages = nrOfUrls
  }
  if (qk && qk.filter) {
    nrOfQkMessages = `${nrOfQkMessages} gefiltert`
  }
  if (!tree.activeNodes.qk) {
    // only show number when qk is active
    nrOfQkMessages = null
  }
  if (store.loading.includes('qk')) {
    nrOfQkMessages = '...'
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'qkFolder',
      id: apArtId,
      urlLabel: 'Qualitaetskontrollen',
      label: `Qualitätskontrollen${nrOfQkMessages ? ` (${nrOfQkMessages})` : ''}`,
      url: ['Projekte', projId, 'Arten', apArtId, 'Qualitaetskontrollen'],
      sort: [projIndex, 1, apIndex, 10],
      hasChildren: false,
    },
  ]
}
