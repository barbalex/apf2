import { gql } from '@apollo/client'

export default gql`
  query BeobzuordnungAeTaxonomiesQuery($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: id
        label: artname
      }
    }
  }
`
