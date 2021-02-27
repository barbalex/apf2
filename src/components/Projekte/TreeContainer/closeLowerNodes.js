import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

const closeLowerNodes = async ({ treeName, url, store }) => {
  const { setOpenNodes, setActiveNodeArray } = store[treeName]
  const openNodes = getSnapshot(store[treeName].openNodes)
  const activeNodeArray = getSnapshot(store[treeName].activeNodeArray)
  const newOpenNodes = openNodes.filter((n) => {
    const partWithEqualLength = n.slice(0, url.length)
    return !isEqual(partWithEqualLength, url)
  })
  setOpenNodes(newOpenNodes)
  if (isEqual(activeNodeArray.slice(0, url.length), url)) {
    // active node will be closed
    // set activeNodeArray to url
    setActiveNodeArray(url)
  }
}

export default closeLowerNodes
