import gql from 'graphql-tag'

export default gql`
  query tpopkontrQuery(
    $showFilter: Boolean!
    $tpopkontrFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(
      filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
    ) @include(if: $showFilter) {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $tpopkontrFilter)
      @include(if: $showFilter) {
      totalCount
    }
  }
`
