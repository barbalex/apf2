// @flow
export default {
  Mutation: {
    setDatasetToDelete: (_, {
      table,
      id,
      label,
      url,
    }, {
      cache
    }) => {
      console.log('resolver setDatasetToDelete:', {table, id, label, url})
      cache.writeData({
        data: {
          datasetToDelete: {
            table,
            id,
            label,
            url,
            __typename: 'DatasetToDelete'
          }
        }
      })
      return null
    },
  },
}
