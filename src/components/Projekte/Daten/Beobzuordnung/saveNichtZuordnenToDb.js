//@flow
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'

import setTreeKeyGql from './setTreeKey'
import updateBeobByIdGql from './updateBeobById'

export default async ({ value, id, tree, refetch, refetchTree, client }) => {
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
  let newActiveNodeArray = clone(activeNodeArray)
  newActiveNodeArray[4] = value
    ? 'nicht-zuzuordnende-Beobachtungen'
    : 'nicht-beurteilte-Beobachtungen'
  newActiveNodeArray[5] = id
  newActiveNodeArray = newActiveNodeArray.slice(0, 6)
  const oldParentNodeUrl = clone(activeNodeArray)
  oldParentNodeUrl.pop()
  const newParentNodeUrl = clone(newActiveNodeArray)
  newParentNodeUrl.pop()
  let newOpenNodes = openNodes.map(n => {
    if (isEqual(n, activeNodeArray)) return newActiveNodeArray
    if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
    return n
  })
  await client.mutate({
    mutation: setTreeKeyGql,
    variables: {
      tree: tree.name,
      value1: newActiveNodeArray,
      key1: 'activeNodeArray',
      value2: newOpenNodes,
      key2: 'openNodes',
    },
  })
  refetch()
  refetchTree('local')
  refetchTree('aps')
  refetchTree('pops')
  refetchTree('tpops')
  refetchTree('beobNichtZuzuordnens')
  refetchTree('beobNichtBeurteilts')
  refetchTree('beobZugeordnets')
}
