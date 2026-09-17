import { graphql } from '../../../../gql/index.ts'

export const queryEkfrequenz = graphql(`
  query EkfrequenzQuery($id: UUID!) {
    allEkfrequenzs(filter: { id: { equalTo: $id }, ektyp: { isNull: false } }) {
      nodes {
        id
        kontrolljahre
        ektyp
      }
    }
  }
`)
