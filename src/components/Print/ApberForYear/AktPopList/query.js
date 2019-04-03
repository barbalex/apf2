import gql from 'graphql-tag'

import { aeEigenschaften } from '../../../shared/fragments'

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
        aeEigenschaftenByArtId {
          ...AeEigenschaftenFields
        }
        pops100: popsByApId(filter: { status: { equalTo: 100 } }) {
          nodes {
            id
            status
            tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
              totalCount
            }
          }
        }
        pops200: popsByApId(filter: { status: { equalTo: 200 } }) {
          nodes {
            id
            status
            tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
              totalCount
            }
          }
        }
      }
    }
  }
  ${aeEigenschaften}
`
