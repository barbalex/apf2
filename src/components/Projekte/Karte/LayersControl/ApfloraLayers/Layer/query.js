import { gql } from '@apollo/client'

export default gql`
  query ApfloraLayersQuery(
    $ap: [UUID!]
    $pop: Boolean!
    $tpop: Boolean!
    $showBeobNichtBeurteilt: Boolean!
    $beobNichtBeurteiltFilter: BeobFilter!
    $showBeobNichtZuzuordnen: Boolean!
    $beobNichtZuzuordnenFilter: BeobFilter!
    $showBeobZugeordnet: Boolean!
    $beobZugeordnetFilter: BeobFilter!
    $showBeobZugeordnetAssignPolylines: Boolean!
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
    beobNichtBeurteilt: allBeobs(filter: $beobNichtBeurteiltFilter)
      @include(if: $showBeobNichtBeurteilt) {
      nodes {
        id
        wgs84Lat
        wgs84Long
      }
    }
    beobNichtZuzuordnen: allBeobs(filter: $beobNichtZuzuordnenFilter)
      @include(if: $showBeobNichtZuzuordnen) {
      nodes {
        id
        wgs84Lat
        wgs84Long
      }
    }
    beobZugeordnet: allBeobs(filter: $beobZugeordnetFilter)
      @include(if: $showBeobZugeordnet) {
      nodes {
        id
        wgs84Lat
        wgs84Long
      }
    }
    beobZugeordnetAssignPolylines: allBeobs(filter: $beobZugeordnetFilter)
      @include(if: $showBeobZugeordnetAssignPolylines) {
      nodes {
        id
        wgs84Lat
        wgs84Long
      }
    }
  }
`
