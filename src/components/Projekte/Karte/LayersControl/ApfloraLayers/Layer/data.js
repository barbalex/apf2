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
    pop: allPops(filter: { apId: { in: $ap }, wgs84Lat: { isNull: false } })
      @include(if: $pop) {
      nodes {
        id
        wgs84Lat
        wgs84Long
        tpopsByPopId(filter: { wgs84Lat: { isNull: false } }) {
          nodes {
            id
            wgs84Lat
            wgs84Long
          }
        }
      }
    }
    # need to also show tpops with pops that do not have coordinates
    tpopByPop: allPops(filter: { apId: { in: $ap } }) @include(if: $tpop) {
      nodes {
        id
        wgs84Lat
        wgs84Long
        tpopsByPopId(filter: { wgs84Lat: { isNull: false } }) {
          nodes {
            id
            wgs84Lat
            wgs84Long
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
        wgs84Lat
        wgs84Long
      }
    }
    beobNichtZuzuordnen: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: true }
        tpopId: { isNull: true }
      }
    ) @include(if: $beobNichtZuzuordnen) {
      nodes {
        id
        wgs84Lat
        wgs84Long
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
        wgs84Lat
        wgs84Long
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
        wgs84Lat
        wgs84Long
      }
    }
  }
`
