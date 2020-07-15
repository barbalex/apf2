import { gql } from '@apollo/client'

export default gql`
  query TpopmassnAeTaxonomiesQueryForTpopmassn($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: artname
        label: artname
      }
    }
  }
`
