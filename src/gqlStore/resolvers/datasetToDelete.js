// @flow
export default {
  Mutation: {
    setDatasetToDelete: (_, {
      table,
      id,
      label,
      url,
      data,
    }, {
      cache
    }) => {
      cache.writeData({
        data: {
          datasetToDelete: {
            table,
            id,
            label,
            url,
            data,
            __typename: 'DatasetToDelete'
          }
        }
      })
      return null
    },
  },
}
