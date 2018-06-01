//@flow
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import deleteDatasetDeletedById from './deleteDatasetDeletedById.graphql'
import listError from '../../../../../modules/listError'
import setTreeKey from './setTreeKey.graphql'

const addNodeToOpenNodes = (openNodes, url) => {
  if (url.length === 0) return
  if (url.length === 1) return openNodes.push(url)
  const newUrl = [...url].pop()
  openNodes.push(newUrl)
  addNodeToOpenNodes(openNodes, newUrl)
}

export default async ({
  client,
  datasetsDeleted,
  dataset,
  tree,
  refetchTree,
  setShowDeletions,
}:{
  client: Object,
  datasetsDeleted: Array<Object>,
  dataset: Object,
  tree: Object,
  refetchTree: () => void,
  setShowDeletions: () => void,
}) => {
  const { table, url, data } = dataset
  // 1. create new dataset
  const queryName = `create${upperFirst(camelCase(table))}`
  let mutation
  try {
    mutation = await import('./' + queryName + '.graphql')
  } catch (error) {
    return listError('Hm. Die Abfrage, um einen Datensatz für diese Tabelle zu erstellen, fehlt. Sorry!')
  }
  try {
    await client.mutate({
      mutation,
      variables: data,
    }) 
  } catch (error) {
    return listError(error)
  }

  // set it as new activeNodeArray and open node
  const { openNodes } = tree
  const newOpenNodes = [...openNodes]
  addNodeToOpenNodes(newOpenNodes, url)
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      tree: tree.name,
      value1: url,
      key1: 'activeNodeArray',
      value2: newOpenNodes,
      key2: 'openNodes'
    }
  })

  // 2. remove dataset from datasetsDeleted
  if (datasetsDeleted.length === 1) setShowDeletions(false)
  await client.mutate({
    mutation: deleteDatasetDeletedById,
    variables: { id: dataset.id }
  })

  // refetch tree
  refetchTree()
}