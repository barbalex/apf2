import { graphql } from '../../../../gql/index.ts'

export const queryAeTaxonomies = graphql(`
  query ApFilterAeTaxonomiesQuery($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        id
        value: id
        label: artname
      }
    }
  }
`)
