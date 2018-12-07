//@flow
import isEqual from 'lodash/isEqual'

import updateBeobByIdGql from './updateBeobById'

export default async ({
  value,
  id,
  tree,
  refetch,
  refetchTree,
  client,
  mobxStore,
}) => {
  const { setTreeKey } = mobxStore
  const variables = {
    id,
    nichtZuordnen: value,
  }
  // if true, empty tpopId
  if (value) variables.tpopId = null
  await client.mutate({
    mutation: updateBeobByIdGql,
    variables,
  })
  // need to update activeNodeArray and openNodes
  const { activeNodeArray, openNodes } = tree
  let newActiveNodeArray = [...activeNodeArray]
  newActiveNodeArray[4] = value
    ? 'nicht-zuzuordnende-Beobachtungen'
    : 'nicht-beurteilte-Beobachtungen'
  newActiveNodeArray[5] = id
  newActiveNodeArray = newActiveNodeArray.slice(0, 6)
  const oldParentNodeUrl = [...activeNodeArray]
  oldParentNodeUrl.pop()
  const newParentNodeUrl = [...newActiveNodeArray]
  newParentNodeUrl.pop()
  let newOpenNodes = openNodes.map(n => {
    if (isEqual(n, activeNodeArray)) return newActiveNodeArray
    if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
    return n
  })
  setTreeKey({
    tree: tree.name,
    value: newActiveNodeArray,
    key: 'activeNodeArray',
  })
  setTreeKey({
    tree: tree.name,
    value: newOpenNodes,
    key: 'openNodes',
  })
  if (refetch) refetch()
  refetchTree('local')
  refetchTree('aps')
  refetchTree('pops')
  refetchTree('tpops')
  refetchTree('beobNichtZuzuordnens')
  refetchTree('beobNichtBeurteilts')
  refetchTree('beobZugeordnets')
}
