import gql from 'graphql-tag'

import { popber, tpopber, tpopmassnber } from '../../shared/fragments'

export default gql`
  query apByIdForMengen($apId: UUID!, $startJahr: Int!, $jahr: Int!) {
    apById(id: $apId) {
      id
      aThreeLPop: popsByApId(filter: { status: { equalTo: 100 } }) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      aThreeLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 100 }
              apberRelevant: { equalTo: true }
            }
          ) {
            totalCount
          }
        }
      }
      aFourLPop: popsByApId(
        filter: {
          status: { equalTo: 200 }
          bekanntSeit: { lessThan: $startJahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      aFourLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 200 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThan: $startJahr }
            }
          ) {
            totalCount
          }
        }
      }
      aFiveLPop: popsByApId(
        filter: {
          status: { equalTo: 200 }
          bekanntSeit: { greaterThanOrEqualTo: $startJahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      aFiveLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 200 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { greaterThanOrEqualTo: $startJahr }
            }
          ) {
            totalCount
          }
        }
      }
      aSevenLPop: popsByApId(
        filter: {
          status: { equalTo: 101 }
          or: [
            { status: { equalTo: 202 } }
            {
              or: [
                { bekanntSeit: { isNull: true } }
                { bekanntSeit: { lessThan: $startJahr } }
              ]
            }
          ]
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      aSevenLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              apberRelevant: { equalTo: true }
              or: [
                { status: { equalTo: 101 } }
                {
                  status: { equalTo: 202 }
                  or: [
                    { bekanntSeit: { isNull: true } }
                    { bekanntSeit: { lessThan: $startJahr } }
                  ]
                }
              ]
            }
          ) {
            totalCount
          }
        }
      }
      aEightLPop: popsByApId(
        filter: {
          status: { equalTo: 202 }
          bekanntSeit: { greaterThanOrEqualTo: $startJahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      aEightLTpop: popsByApId(
        filter: {
          or: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 202 }
              bekanntSeit: { greaterThanOrEqualTo: $startJahr }
              apberRelevant: { equalTo: true }
            }
          ) {
            totalCount
          }
        }
      }
      aNineLPop: popsByApId(filter: { status: { equalTo: 201 } }) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      aNineLTpop: popsByApId {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 201 }
              apberRelevant: { equalTo: true }
            }
          ) {
            totalCount
          }
        }
      }
      aTenLPop: popsByApId(filter: { status: { equalTo: 300 } }) {
        totalCount
      }
      aTenLTpop: popsByApId {
        nodes {
          id
          tpopsByPopId(filter: { status: { equalTo: 300 } }) {
            totalCount
          }
        }
      }
      bOneLPop: popsByApId(
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
      bOneLTpop: popsByApId(
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
      bOneRPop: popsByApId(
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
      bOneRTpop: popsByApId(
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
      bSevenLPop: popsByApId(filter: { status: { lessThan: 300 } }) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      bSevenLTpop: popsByApId(
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
      cOneLTpop: popsByApId(
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
              popId
              tpopmassnsByTpopId(filter: { jahr: { equalTo: $jahr } }) {
                totalCount
              }
            }
          }
        }
      }
      cOneRTpop: popsByApId(
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
  ${popber}
  ${tpopber}
  ${tpopmassnber}
`
