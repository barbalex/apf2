import { gql } from '@apollo/client'

export const queryAeTaxonomies = gql`
  query TpopmassnAeTaxonomiesQueryForTpopmassn($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: artname
        label: artname
      }
    }
  }
`
