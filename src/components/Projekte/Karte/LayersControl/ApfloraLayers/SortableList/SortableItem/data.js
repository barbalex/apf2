import gql from 'graphql-tag'

export default gql`
  query ApfloraLayersQuery(
    $ap: [UUID!]
    $pop: Boolean!
    $tpop: Boolean!
    $beobNichtBeurteilt: Boolean!
    $beobNichtZuzuordnen: Boolean!
    $beobZugeordnet: Boolean!
    $beobZugeordnetAssignPolylines: Boolean!
  ) {
    pop: allPops(
      filter: { apId: { in: $ap }, x: { isNull: false }, y: { isNull: false } }
    ) @include(if: $pop) {
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
    tpopByPop: allPops(filter: { apId: { in: $ap } }) @include(if: $tpop) {
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
    ) @include(if: $beobNichtBeurteilt) {
      nodes {
        id
        x
        y
      }
    }
    beobNichtZuzuordnen: allVApbeobs(
      filter: { apId: { in: $ap }, nichtZuordnen: { equalTo: true } }
    ) @include(if: $beobNichtZuzuordnen) {
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
    ) @include(if: $beobZugeordnet) {
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
    ) @include(if: $beobZugeordnetAssignPolylines) {
      nodes {
        id
        x
        y
      }
    }
  }
`
