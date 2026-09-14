import { gql as dynamicGql } from '../../../../../../apolloGql.ts'
import { camelCase } from 'es-toolkit'

const werteById = (table) => {
  const tableName = camelCase(table)

  return dynamicGql`
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
