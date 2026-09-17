import { graphql } from '../../../../gql/index.ts'

export const query = graphql(`
  query tpopkontrByIdQueryForEkFilter {
    allTpopkontrIdbiotuebereinstWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allTpopEntwicklungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allAeLrDelarzes(orderBy: LABEL_ASC) {
      nodes {
        id
        label
        einheit
      }
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`)
