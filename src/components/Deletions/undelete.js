//@flow
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import deleteDatasetDeletedById from './deleteDatasetDeletedById.graphql'
import listError from '../../modules/listError'

export default async ({
  client,
  datasetsDeleted,
  dataset,
}:{
  client: Object,
  datasetsDeleted: Array<Object>,
  dataset: Object,
}) => {
  // 1. create new dataset
  try {
    
  } catch (error) {
    listError(error)
  }

  // set it as new 

  // 2. remove dataset from datasetsDeleted
  client.mutate({
    mutation: deleteDatasetDeletedById,
    variables: { id: dataset.id }
  })

  // refetch tree
}