import { graphql } from '../../../../gql/index.ts'

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
