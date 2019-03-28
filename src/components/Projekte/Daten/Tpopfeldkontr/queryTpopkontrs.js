import gql from 'graphql-tag'

export default gql`
  query tpopkontrQuery(
    $showFilter: Boolean!
    $tpopkontrFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(
      filter: {
        or: [
          { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
          { typ: { isNull: true } }
        ]
      }
    ) @include(if: $showFilter) {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $tpopkontrFilter)
      @include(if: $showFilter) {
      totalCount
    }
  }
`
