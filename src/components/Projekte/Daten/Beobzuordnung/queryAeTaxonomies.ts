import { graphql } from '../../../../gql'

export const queryAeTaxonomies = graphql(`
  query BeobzuordnungAeTaxonomiesQuery($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: id
        label: artname
      }
    }
  }
`)
