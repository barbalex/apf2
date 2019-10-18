import gql from 'graphql-tag'

import { aeTaxonomies } from '../../../shared/fragments'

export default gql`
  query AktPopListAps($projektId: UUID!) {
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
            status
            tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
              totalCount
            }
          }
        }
        pops200: popsByApId(filter: { status: { equalTo: 200 } }) {
          nodes {
            id
            status
            tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
              totalCount
            }
          }
        }
      }
    }
  }
  ${aeTaxonomies}
`
