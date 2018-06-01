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
}:{
  client: Object,
  datasetsDeleted: Array<Object>,
  dataset: Object,
  tree: Object,
  refetchTree: () => void,
}) => {
  const { table, id, url, data } = dataset
  // 1. create new dataset
  const queryName = `create${upperFirst(camelCase(table))}`
  console.log('undelete:', { table, id, url, data, queryName })
  let query
  try {
    query = await import('./' + queryName + '.graphql')
  } catch (error) {
    listError(error)
  }
  console.log('undelete:', { query })
  try {
    await client.query({
      query,
      variables: data,
    }) 
  } catch (error) {
    listError(error)
  }
  console.log('undelete: data crated')

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
  console.log('undelete: activeNodeArray and openNodes set:', {openNodes,newOpenNodes,url})

  // 2. remove dataset from datasetsDeleted
  client.mutate({
    mutation: deleteDatasetDeletedById,
    variables: { id: dataset.id }
  })
  console.log('undelete: removed dataset from datasetsDeleted:')

  // refetch tree
  refetchTree()
}