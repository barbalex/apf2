import gql from 'graphql-tag'

import { popber, tpopber } from '../../../shared/fragments'

export default gql`
  query apByIdForBMengen($apId: UUID!, $jahr: Int!) {
    apById(id: $apId) {
      id
      oneLPop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
          popbersByPopId(filter: { jahr: { equalTo: $jahr } }) {
            totalCount
            nodes {
              ...PopberFields
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
                { apberRelevant: { equalTo: true } }
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
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
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
              ...PopberFields
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
                { apberRelevant: { equalTo: true } }
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
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
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
                { apberRelevant: { equalTo: true } }
              ]
            }
          ) {
            totalCount
          }
        }
      }
    }
  }
  ${popber}
  ${tpopber}
`
