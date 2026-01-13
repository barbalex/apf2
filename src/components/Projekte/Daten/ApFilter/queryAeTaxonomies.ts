import { gql } from '@apollo/client'

export const queryAeTaxonomies = gql`
  query ApFilterAeTaxonomiesQuery($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        id
        value: id
        label: artname
      }
    }
  }
`
