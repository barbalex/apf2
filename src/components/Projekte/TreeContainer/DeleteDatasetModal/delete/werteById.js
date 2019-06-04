import gql from 'graphql-tag'
import camelCase from 'lodash/camelCase'

export default table => {
  const tableName = camelCase(table)
  return gql`
    query werteById($id: UUID!) {
      ${tableName}ById(id: $id) {
        id
        code
        text
        sort
        changed
        changedBy
      }
    }
  `
}
