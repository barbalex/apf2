import { gql } from '@apollo/client'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

export default (table) => {
  const tableName = camelCase(table)
  const mutation = gql`
      mutation createWerteForUndelete(
        $id: UUID
        $code: Int
        $text: String
        $sort: Int
        $changed: Date
        $changedBy: String
      ) {
        create${upperFirst(tableName)}(input: { ${tableName}: {
          id: $id
          code: $code
          text: $text
          sort: $sort
          changed: $changed
          changedBy: $changedBy
        } }) {
          ${tableName} {
            id
            code
            text
            sort
            changed
            changedBy
          }
        }
      }
    `
  return mutation
}
