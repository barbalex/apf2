import gql from 'graphql-tag'

export default gql`
  query tpopmassnsQuery(
    $showFilter: Boolean!
    $tpopmassnFilter: TpopmassnFilter!
  ) {
    allTpopmassns @include(if: $showFilter) {
      totalCount
    }
    tpopmassnsFiltered: allTpopmassns(filter: $tpopmassnFilter)
      @include(if: $showFilter) {
      totalCount
    }
  }
`
