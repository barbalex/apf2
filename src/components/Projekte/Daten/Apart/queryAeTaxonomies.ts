import { graphql } from '../../../../gql'

export const queryAeTaxonomies = graphql(`
  query TpopmassnAeTaxonomiesQueryForApart($filter: AeTaxonomyFilter!) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: TAX_ART_NAME_ASC) {
      nodes {
        value: id
        label: taxArtName
      }
    }
  }
`)
