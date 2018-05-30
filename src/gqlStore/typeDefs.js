//@flow
export default `
  type DatasetToDelete {
    table: String!
    id: String!
    label: String,
    url: String,
  }

  type Query {
    datasetToDelete: DatasetToDelete
    datasetsDeleted: [DatasetToDelete]
  }
`