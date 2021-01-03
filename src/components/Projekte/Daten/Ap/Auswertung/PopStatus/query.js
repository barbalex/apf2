import { gql } from '@apollo/client'

export default gql`
  query popDataForPopStatus($apId: UUID!, $startJahr: Int!, $query: Boolean!) {
    years: allPopHistories(filter: { apId: { equalTo: $apId } })
      @include(if: $query) {
      nodes {
        id
        year
      }
    }
    a3LPop: allPopHistories(
      filter: {
        apId: { equalTo: $apId }
        status: { equalTo: 100 }
        tpopHistoriesByYearAndPopId: {
          some: { apberRelevant: { equalTo: true } }
        }
      }
    ) @include(if: $query) {
      nodes {
        year
        id
      }
    }
    a4LPop: allPopHistories(
      filter: {
        apId: { equalTo: $apId }
        status: { equalTo: 200 }
        bekanntSeit: { lessThan: $startJahr }
        tpopHistoriesByYearAndPopId: {
          some: { apberRelevant: { equalTo: true } }
        }
      }
    ) @include(if: $query) {
      nodes {
        year
        id
      }
    }
    a5LPop: allPopHistories(
      filter: {
        apId: { equalTo: $apId }
        status: { equalTo: 200 }
        bekanntSeit: { greaterThanOrEqualTo: $startJahr }
        tpopHistoriesByYearAndPopId: {
          some: { apberRelevant: { equalTo: true } }
        }
      }
    ) @include(if: $query) {
      nodes {
        year
        id
      }
    }
    a7LPop: allPopHistories(
      filter: {
        apId: { equalTo: $apId }
        tpopHistoriesByYearAndPopId: {
          some: { apberRelevant: { equalTo: true } }
        }
        or: [
          { status: { equalTo: 101 } }
          {
            and: [
              { status: { equalTo: 202 } }
              {
                or: [
                  { bekanntSeit: { isNull: true } }
                  { bekanntSeit: { lessThan: $startJahr } }
                ]
              }
            ]
          }
        ]
      }
    ) @include(if: $query) {
      nodes {
        year
        id
      }
    }
    a8LPop: allPopHistories(
      filter: {
        apId: { equalTo: $apId }
        status: { equalTo: 202 }
        bekanntSeit: { greaterThanOrEqualTo: $startJahr }
        tpopHistoriesByYearAndPopId: {
          some: { apberRelevant: { equalTo: true } }
        }
      }
    ) @include(if: $query) {
      nodes {
        year
        id
      }
    }
    a9LPop: allPopHistories(
      filter: {
        apId: { equalTo: $apId }
        status: { equalTo: 201 }
        tpopHistoriesByYearAndPopId: {
          some: { apberRelevant: { equalTo: true } }
        }
      }
    ) @include(if: $query) {
      nodes {
        year
        id
      }
    }
    a10LPop: allPopHistories(
      filter: { apId: { equalTo: $apId }, status: { equalTo: 300 } }
    ) @include(if: $query) {
      nodes {
        year
        id
      }
    }
  }
`
