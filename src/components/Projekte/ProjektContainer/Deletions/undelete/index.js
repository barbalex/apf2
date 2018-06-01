//@flow
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import deleteDatasetDeletedById from './deleteDatasetDeletedById.graphql'
import listError from '../../../../../modules/listError'

export default async ({
  client,
  datasetsDeleted,
  dataset,
  refetchTree,
}:{
  client: Object,
  datasetsDeleted: Array<Object>,
  dataset: Object,
  refetchTree: () => void,
}) => {
  // 1. create new dataset
  try {
    
  } catch (error) {
    listError(error)
  }

  // set it as new activeNodeArray...

  // ...and open node

  // 2. remove dataset from datasetsDeleted
  client.mutate({
    mutation: deleteDatasetDeletedById,
    variables: { id: dataset.id }
  })

  // refetch tree
  refetchTree()
}