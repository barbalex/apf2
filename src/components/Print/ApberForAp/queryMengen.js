import { gql } from '@apollo/client'

import { popber, tpopber, tpopmassnber } from '../../shared/fragments'

export default gql`
  query apByIdForMengen($apId: UUID!, $startJahr: Int!, $jahr: Int!) {
    apById(id: $apId) {
      id
      a3LPop: popsByApId(
        filter: {
          status: { equalTo: 100 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          }
        }
      ) {
        totalCount
      }
      a3LTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 100 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          ) {
            totalCount
          }
        }
      }
      a4LPop: popsByApId(
        filter: {
          status: { equalTo: 200 }
          and: [
            { bekanntSeit: { lessThan: $startJahr } }
            { bekanntSeit: { lessThanOrEqualTo: $jahr } }
          ]
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          }
        }
      ) {
        totalCount
      }
      a4LTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 200 }
              apberRelevant: { equalTo: true }
              and: [
                { bekanntSeit: { lessThan: $startJahr } }
                { bekanntSeit: { lessThanOrEqualTo: $jahr } }
              ]
            }
          ) {
            totalCount
          }
        }
      }
      a5LPop: popsByApId(
        filter: {
          status: { equalTo: 200 }
          and: [
            { bekanntSeit: { greaterThanOrEqualTo: $startJahr } }
            { bekanntSeit: { lessThanOrEqualTo: $jahr } }
          ]
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              and: [
                { bekanntSeit: { greaterThanOrEqualTo: $startJahr } }
                { bekanntSeit: { lessThanOrEqualTo: $jahr } }
              ]
            }
          }
        }
      ) {
        totalCount
      }
      a5LTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 200 }
              apberRelevant: { equalTo: true }
              and: [
                { bekanntSeit: { greaterThanOrEqualTo: $startJahr } }
                { bekanntSeit: { lessThanOrEqualTo: $jahr } }
              ]
            }
          ) {
            totalCount
          }
        }
      }
      a7LPop: popsByApId(
        filter: {
          bekanntSeit: { lessThanOrEqualTo: $jahr }
          or: [
            { status: { equalTo: 101 } }
            { status: { equalTo: 202 }, bekanntSeit: { lessThan: $startJahr } }
          ]
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          }
        }
      ) {
        totalCount
      }
      a7LTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
              or: [
                { status: { equalTo: 101 } }
                {
                  status: { equalTo: 202 }
                  bekanntSeit: { lessThan: $startJahr }
                }
              ]
            }
          ) {
            totalCount
          }
        }
      }
      a8LPop: popsByApId(
        filter: {
          status: { equalTo: 202 }
          and: [
            { bekanntSeit: { greaterThanOrEqualTo: $startJahr } }
            { bekanntSeit: { lessThanOrEqualTo: $jahr } }
          ]
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          }
        }
      ) {
        totalCount
      }
      a8LTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 202 }
              apberRelevant: { equalTo: true }
              and: [
                { bekanntSeit: { greaterThanOrEqualTo: $startJahr } }
                { bekanntSeit: { lessThanOrEqualTo: $jahr } }
              ]
            }
          ) {
            totalCount
          }
        }
      }
      a9LPop: popsByApId(
        filter: {
          status: { equalTo: 201 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          }
        }
      ) {
        totalCount
      }
      a9LTpop: popsByApId(
        filter: { bekanntSeit: { lessThanOrEqualTo: $jahr } }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 201 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          ) {
            totalCount
          }
        }
      }
      a10LPop: popsByApId(
        filter: {
          status: { equalTo: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        totalCount
      }
      a10LTpop: popsByApId {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 300 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          ) {
            totalCount
          }
        }
      }
      b1LPop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          }
        }
      ) {
        nodes {
          id
          popbersByPopId(filter: { jahr: { equalTo: $jahr } }) {
            totalCount
            nodes {
              ...PopberFields
            }
          }
        }
      }
      b1LTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { lessThan: 300 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
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
      b1RPop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
          tpopsByPopId: {
            some: {
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
            }
          }
        }
      ) {
        nodes {
          id
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
          }
        }
      }
      b1RTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { lessThan: 300 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
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
      c1LTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { lessThan: 300 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
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
      c1RTpop: popsByApId(
        filter: {
          status: { lessThan: 300 }
          bekanntSeit: { lessThanOrEqualTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { lessThan: 300 }
              apberRelevant: { equalTo: true }
              bekanntSeit: { lessThanOrEqualTo: $jahr }
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
