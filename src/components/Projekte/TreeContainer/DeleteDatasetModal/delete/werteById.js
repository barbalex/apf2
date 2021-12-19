import { gql } from '@apollo/client'
import camelCase from 'lodash/camelCase'

const werteById = (table) => {
  const tableName = camelCase(table)

  return gql`
    query werteByIdForDelete($id: UUID!) {
      ${tableName}ById(id: $id) {
        id
        code
        text
        sort
        changedBy
      }
    }
  `
}

export default werteById
