import { graphql } from '../../../../gql'

export const query = graphql(`
  query popStatusWerteForEkplanHeaderFixed {
    allPopStatusWertes(orderBy: CODE_ASC) {
      nodes {
        id
        code
        text
      }
    }
  }
`)
