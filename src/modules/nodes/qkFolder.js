import reduce from 'lodash/reduce'

export default (store, projId, apArtId) => {
  const qk = store.qk.get(apArtId)
  let nrOfQkMessages = 0
  if (qk && qk.messagesFiltered) {
    // need to count nr of urls, not nr of messages
    const nrOfUrls = reduce(qk.messagesFiltered, (sum, n) => sum + n.url.length, 0)
    nrOfQkMessages = nrOfUrls
  }
  if (qk && qk.filter) {
    nrOfQkMessages = `${nrOfQkMessages} gefiltert`
  }
  if (!store.activeUrlElements.qk) {
    // only show number when qk is active
    nrOfQkMessages = null
  }
  if (store.qkLoading) {
    nrOfQkMessages = `...`
  }
  const label = `Qualitätskontrollen${nrOfQkMessages ? ` (${nrOfQkMessages})` : ``}`
  return {
    nodeType: `folder`,
    menuType: `qkFolder`,
    id: apArtId,
    label,
    expanded: false,
    url: [`Projekte`, projId, `Arten`, apArtId, `Qualitaetskontrollen`],
  }
}
