import gql from 'graphql-tag'

export default gql`
  query apById($apId: UUID!, $startJahr: Int!) {
    apById(id: $apId) {
      id
      threeLPop: popsByApId(filter: { status: { equalTo: 100 } }) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
        }
      }
      threeLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: { status: { equalTo: 100 }, apberRelevant: { equalTo: 1 } }
          ) {
            totalCount
          }
        }
      }
      fourLPop: popsByApId(
        filter: {
          status: { equalTo: 200 }
          bekanntSeit: { lessThan: $startJahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
        }
      }
      fourLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 200 }
              apberRelevant: { equalTo: 1 }
              bekanntSeit: { lessThan: $startJahr }
            }
          ) {
            totalCount
          }
        }
      }
      fiveLPop: popsByApId(
        filter: {
          status: { equalTo: 200 }
          bekanntSeit: { greaterThanOrEqualTo: $startJahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
        }
      }
      fiveLTpop: popsByApId(
        filter: {
          and: [{ status: { notEqualTo: 300 } }, { status: { isNull: false } }]
        }
      ) {
        nodes {
          id
          tpopsByPopId(
            filter: {
              status: { equalTo: 200 }
              apberRelevant: { equalTo: 1 }
              bekanntSeit: { greaterThanOrEqualTo: $startJahr }
            }
          ) {
            totalCount
          }
        }
      }
      sevenLPop: popsByApId(
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
              apberRelevant: { equalTo: 1 }
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
      eightLPop: popsByApId(
        filter: {
          status: { equalTo: 202 }
          bekanntSeit: { greaterThanOrEqualTo: $startJahr }
        }
      ) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
        }
      }
      eightLTpop: popsByApId(
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
              apberRelevant: { equalTo: 1 }
            }
          ) {
            totalCount
          }
        }
      }
      nineLPop: popsByApId(filter: { status: { equalTo: 201 } }) {
        nodes {
          id
          tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
            totalCount
          }
        }
      }
      nineLTpop: popsByApId {
        nodes {
          id
          tpopsByPopId(
            filter: { status: { equalTo: 201 }, apberRelevant: { equalTo: 1 } }
          ) {
            totalCount
          }
        }
      }
      tenLPop: popsByApId(filter: { status: { equalTo: 300 } }) {
        totalCount
      }
      tenLTpop: popsByApId {
        nodes {
          id
          tpopsByPopId(filter: { status: { equalTo: 300 } }) {
            totalCount
          }
        }
      }
    }
  }
`
