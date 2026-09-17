import { graphql } from '../../../../gql/index.ts'

export const queryLists = graphql(`
  query apFilterListsQuery {
    allApBearbstandWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allApUmsetzungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`)
