import gql from 'graphql-tag'

export default gql`
  query allPopsQuery($showFilter: Boolean!, $popFilter: PopFilter!) {
    allPops @include(if: $showFilter) {
      totalCount
    }
    popsFiltered: allPops(filter: $popFilter) @include(if: $showFilter) {
      totalCount
    }
  }
`
