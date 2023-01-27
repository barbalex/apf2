import { gql } from '@apollo/client'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

const createWerte = (table) => {
  const tableName = camelCase(table)
  const mutation = gql`
      mutation createWerteForUndelete(
        $id: UUID
        $code: Int
        $text: String
        $sort: Int
        $changedBy: String
      ) {
        create${upperFirst(tableName)}(input: { ${tableName}: {
          id: $id
          code: $code
          text: $text
          sort: $sort
          changedBy: $changedBy
        } }) {
          ${tableName} {
            id
            code
            text
            sort
            changedBy
          }
        }
      }
    `
  return mutation
}

export default createWerte
