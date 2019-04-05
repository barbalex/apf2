//@flow
import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

export default async ({
  treeName,
  url,
  mobxStore,
}: {
  treeName: string,
  url: Array<String>,
}) => {
  const {setOpenNodes,setActiveNodeArray}=mobxStore[treeName]
  const openNodes = getSnapshot(mobxStore[treeName].openNodes)
  const activeNodeArray = getSnapshot(mobxStore[treeName].activeNodeArray)
  const newOpenNodes = openNodes.filter(n => {
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
