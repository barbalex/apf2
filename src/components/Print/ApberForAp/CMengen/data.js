import gql from 'graphql-tag'

import { tpopmassnber } from '../../../shared/fragments'

export default gql`
  query apById($apId: UUID!, $jahr: Int!) {
    apById(id: $apId) {
      id
      oneLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              and: [
                { status: { notEqualTo: 300 } }
                { status: { isNull: false } }
                { apberRelevant: { equalTo: 1 } }
              ]
            }
          ) {
            totalCount
            nodes {
              id
              popId
              tpopmassnsByTpopId(filter: { jahr: { equalTo: $jahr } }) {
                totalCount
              }
            }
          }
        }
      }
      oneRTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              and: [
                { status: { notEqualTo: 300 } }
                { status: { isNull: false } }
                { apberRelevant: { equalTo: 1 } }
              ]
            }
          ) {
            totalCount
            nodes {
              id
              popId
              tpopmassnsByTpopId(
                filter: {
                  and: [
                    { jahr: { isNull: false } }
                    { jahr: { lessThanOrEqualTo: $jahr } }
                    { typ: { isNull: false } }
                  ]
                }
              ) {
                totalCount
                nodes {
                  id
                  jahr
                  tpopByTpopId {
                    id
                    popId
                  }
                }
              }
              tpopmassnbersByTpopId(
                filter: {
                  and: [
                    { jahr: { isNull: false } }
                    { jahr: { lessThanOrEqualTo: $jahr } }
                    { beurteilung: { isNull: false } }
                  ]
                }
              ) {
                totalCount
                nodes {
                  ...TpopmassnberFields
                  tpopByTpopId {
                    id
                    popId
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${tpopmassnber}
`
