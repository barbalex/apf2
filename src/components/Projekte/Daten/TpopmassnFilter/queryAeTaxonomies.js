import gql from 'graphql-tag'

export default gql`
  query TpopmassnFilterAeTaxonomiesQueryForTpopmassn(
    $filter: AeTaxonomyFilter!
  ) {
    allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: artname
        label: artname
      }
    }
  }
`
