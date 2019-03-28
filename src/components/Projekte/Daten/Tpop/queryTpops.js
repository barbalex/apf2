import gql from 'graphql-tag'

export default gql`
  query tpopsQuery($showFilter: Boolean!, $tpopFilter: TpopFilter!) {
    allTpops @include(if: $showFilter) {
      totalCount
    }
    tpopsFiltered: allTpops(filter: $tpopFilter) @include(if: $showFilter) {
      totalCount
    }
  }
`
