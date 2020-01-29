import gql from 'graphql-tag'

import { popber, tpopber, tpopmassnber } from '../../shared/fragments'

export default gql`
  query apByIdForMengen($apId: UUID!, $startJahr: Int!, $jahr: Int!) {
    apById(id: $apId) {
      id
      a3LPop: popsByApId(
        filter: {
          status: { equalTo: 100 }
          tpopsByPopId: { some: { apberRelevant: { equalTo: true } } }
        }
      ) {
        nodes {
          id
        }
      }
      a3LTpop: popsByApId(
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
      a4LPop: popsByApId(
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
      a4LTpop: popsByApId(
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
      a5LPop: popsByApId(
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
      a5LTpop: popsByApId(
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
      a7LPop: popsByApId(
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
      a7LTpop: popsByApId(
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
      a8LPop: popsByApId(
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
      a8LTpop: popsByApId(
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
      a9LPop: popsByApId(filter: { status: { equalTo: 201 } }) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      a9LTpop: popsByApId {
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
      a10LPop: popsByApId(filter: { status: { equalTo: 300 } }) {
        totalCount
      }
      a10LTpop: popsByApId {
        nodes {
          id
          tpopsByPopId(filter: { status: { equalTo: 300 } }) {
            totalCount
          }
        }
      }
      b1LPop: popsByApId(
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
      b1LTpop: popsByApId(
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
      b1RPop: popsByApId(
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
      b1RTpop: popsByApId(
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
      b7LPop: popsByApId(filter: { status: { lessThan: 300 } }) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: true } }) {
            totalCount
          }
        }
      }
      b7LTpop: popsByApId(
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
      c1LTpop: popsByApId(
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
      c1RTpop: popsByApId(
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
