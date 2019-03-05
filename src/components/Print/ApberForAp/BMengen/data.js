import gql from 'graphql-tag'

import { tpopber } from '../../../shared/fragments'

export default gql`
  query apById($apId: UUID!, $jahr: Int!) {
    apById(id: $apId) {
      id
      oneLPop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
          popbersByPopId(filter: { jahr: { equalTo: $jahr } }) {
            totalCount
            nodes {
              id
              entwicklung
            }
          }
        }
      }
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
              tpopbersByTpopId(filter: { jahr: { equalTo: $jahr } }) {
                totalCount
                nodes {
                  ...TpopberFields
                }
              }
            }
          }
        }
      }
      oneRPop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
          popbersByPopId(
            filter: {
              and: [
                { jahr: { isNull: false } }
                { jahr: { lessThanOrEqualTo: $jahr } }
                { entwicklung: { isNull: false } }
              ]
            }
          ) {
            totalCount
            nodes {
              id
              entwicklung
              jahr
              popId
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
              tpopbersByTpopId(
                filter: {
                  and: [
                    { jahr: { isNull: false } }
                    { jahr: { lessThanOrEqualTo: $jahr } }
                    { entwicklung: { isNull: false } }
                  ]
                }
              ) {
                totalCount
                nodes {
                  ...TpopberFields
                }
              }
            }
          }
        }
      }
      sevenLPop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
        }
      }
      sevenLTpop: popsByApId(
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
          }
        }
      }
    }
  }
  ${tpopber}
`
