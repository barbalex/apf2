import { gql } from '@apollo/client'

export default gql`
  query tpopmassnsFilterQuery(
    $apIdExists: Boolean!
    $apIdNotExists: Boolean!
    $tpopmassnFilter: TpopmassnFilter!
    $allTpopmassnFilter: TpopmassnFilter!
    $apId: UUID
  ) {
    allTpopmassns(filter: $allTpopmassnFilter) @include(if: $apIdNotExists) {
      totalCount
    }
    tpopmassnsFiltered: allTpopmassns(filter: $tpopmassnFilter)
      @include(if: $apIdNotExists) {
      totalCount
    }
    popsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $apIdExists) {
      nodes {
        id
        tpops: tpopsByPopId {
          nodes {
            id
            tpopmassns: tpopmassnsByTpopId {
              totalCount
            }
            tpopmassnsFiltered: tpopmassnsByTpopId(filter: $tpopmassnFilter) {
              totalCount
            }
          }
        }
      }
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
    allTpopmassnTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
        anpflanzung
      }
    }
    allTpopkontrzaehlEinheitWertes(orderBy: SORT_ASC) {
      nodes {
        id
        value: code
        label: text
      }
    }
  }
`
