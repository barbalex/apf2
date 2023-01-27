import isEqual from 'lodash/isEqual'

import updateBeobByIdGql from './updateBeobById'

const saveNichtZuordnenToDb = async ({
  value,
  id,
  refetch: refetchPassed,
  client,
  store,
  queryClient,
  search,
}) => {
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
  queryClient.invalidateQueries({ queryKey: [`treeQuery`] })
  // need to update activeNodeArray and openNodes
  const { activeNodeArray, openNodes, addOpenNodes } = store.tree

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
  const newOpenNodes = openNodes.map((n) => {
    if (isEqual(n, activeNodeArray)) return newActiveNodeArray
    if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
    return n
  })
  addOpenNodes(newOpenNodes)
  store.navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
  if (refetchPassed) refetchPassed()
}

export default saveNichtZuordnenToDb
