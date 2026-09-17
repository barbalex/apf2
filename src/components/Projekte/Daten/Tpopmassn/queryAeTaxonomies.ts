import { graphql } from '../../../../gql/index.ts'

export const queryAeTaxonomies = graphql(`
  query TpopmassnAeTaxonomiesQueryForTpopmassn($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: artname
        label: artname
      }
    }
  }
`)
