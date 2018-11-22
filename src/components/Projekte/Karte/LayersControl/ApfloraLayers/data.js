import gql from 'graphql-tag'

export default gql`
  query Query($isAp: Boolean!, $ap: [UUID!]) {
    tree @client {
      activeNodeArray
    }
    tree2 @client {
      activeNodeArray
    }
    pop: allPops(
      filter: { apId: { in: $ap }, x: { isNull: false }, y: { isNull: false } }
    ) @include(if: $isAp) {
      nodes {
        id
        x
        y
        tpopsByPopId(filter: { x: { isNull: false }, y: { isNull: false } }) {
          nodes {
            id
            x
            y
          }
        }
      }
    }
    # need to also show tpops with pops that do not have coordinates
    tpopByPop: allPops(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        x
        y
        tpopsByPopId(filter: { x: { isNull: false }, y: { isNull: false } }) {
          nodes {
            id
            x
            y
          }
        }
      }
    }
    beobNichtBeurteilt: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: true }
      }
    ) @include(if: $isAp) {
      nodes {
        id
        x
        y
      }
    }
    beobNichtZuzuordnen: allVApbeobs(
      filter: { apId: { in: $ap }, nichtZuordnen: { equalTo: true } }
    ) @include(if: $isAp) {
      nodes {
        id
        x
        y
      }
    }
    beobZugeordnet: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: false }
      }
    ) @include(if: $isAp) {
      nodes {
        id
        x
        y
      }
    }
    beobZugeordnetAssignPolylines: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: false }
      }
    ) @include(if: $isAp) {
      nodes {
        id
        x
        y
      }
    }
  }
`
