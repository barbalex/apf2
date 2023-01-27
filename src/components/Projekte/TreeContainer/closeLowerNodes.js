import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

const closeLowerNodes = async ({ url, store,search }) => {
  const { setOpenNodes } = store.tree
  const openNodes = getSnapshot(store.tree.openNodes)
  const activeNodeArray = getSnapshot(store.tree.activeNodeArray)
  const newOpenNodes = openNodes.filter((n) => {
    const partWithEqualLength = n.slice(0, url.length)
    return !isEqual(partWithEqualLength, url)
  })
  setOpenNodes(newOpenNodes)
  if (isEqual(activeNodeArray.slice(0, url.length), url)) {
    // active node will be closed
    // navigate to url
    store.navigate(`/Daten/${url.join('/')}${search}`)
  }
}

export default closeLowerNodes
