import { gql } from '@apollo/client'

import { aeTaxonomies } from '../../../shared/fragments'

export default gql`
  query AktPopListAps($projektId: UUID!, $previousYear: Int!) {
    allAps(
      filter: {
        bearbeitung: { in: [1, 2, 3] }
        projId: { equalTo: $projektId }
      }
    ) {
      nodes {
        id
        aeTaxonomyByArtId {
          ...AeTaxonomiesFields
        }
        pops100: popsByApId(filter: { status: { equalTo: 100 } }) {
          nodes {
            id
            tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
              totalCount
            }
          }
        }
        pops100previous: popHistoriesByApId(
          filter: { year: { equalTo: $previousYear }, status: { equalTo: 100 } }
        ) {
          nodes {
            id
            tpopHistoriesByYearAndPopId(
              filter: {
                year: { equalTo: $previousYear }
                apberRelevant: { equalTo: true }
              }
            ) {
              totalCount
            }
          }
        }
        pops200: popsByApId(filter: { status: { equalTo: 200 } }) {
          nodes {
            id
            tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
              totalCount
            }
          }
        }
        pops200previous: popHistoriesByApId(
          filter: { year: { equalTo: $previousYear }, status: { equalTo: 200 } }
        ) {
          nodes {
            id
            tpopHistoriesByYearAndPopId(
              filter: {
                year: { equalTo: $previousYear }
                apberRelevant: { equalTo: true }
              }
            ) {
              totalCount
            }
          }
        }
      }
    }
  }
  ${aeTaxonomies}
`
