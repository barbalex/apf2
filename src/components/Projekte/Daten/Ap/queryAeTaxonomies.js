import { gql } from '@apollo/client'

export const queryAeTaxonomies = gql`
  query ApAeTaxonomiesQuery($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: TAX_ART_NAME_ASC) {
      nodes {
        value: id
        label: taxArtName
      }
    }
  }
`
