// @flow
import findIndex from 'lodash/findIndex'
import reduce from 'lodash/reduce'
import { toJS } from 'mobx'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )
  const { messages, filter } = store.qk
  let nrOfQkMessages = 0
  const pureMessages = toJS(messages)
  if (pureMessages) {
    let messagesFiltered = filter
      ? pureMessages.filter(m =>
          m.hw.toLowerCase().includes(filter.toLowerCase())
        )
      : pureMessages
    messagesFiltered = messagesFiltered.filter(
      m => m.hw !== 'Wow: Scheint alles i.O. zu sein!'
    )
    // need to count nr of urls, not nr of messages
    const nrOfUrls = reduce(
      messagesFiltered,
      (sum, n) => sum + (n && n.url && n.url.length ? n.url.length : 0),
      0
    )
    nrOfQkMessages = nrOfUrls
  }

  if (pureMessages && filter) {
    nrOfQkMessages = `${nrOfQkMessages} gefiltert`
  }

  if (!tree.activeNodes.qk) {
    // only show number when qk is active
    nrOfQkMessages = null
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'qkFolder',
      id: apArtId,
      urlLabel: 'Qualitaetskontrollen',
      label: `Qualitätskontrollen${nrOfQkMessages !== null
        ? ` (${nrOfQkMessages})`
        : ''}`,
      url: ['Projekte', projId, 'Arten', apArtId, 'Qualitaetskontrollen'],
      sort: [projIndex, 1, apIndex, 10],
      hasChildren: false,
    },
  ]
}
