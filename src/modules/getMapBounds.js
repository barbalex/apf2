import getEncompassingBound from './getEncompassingBound'

export default (store) => {
  const ktZhBounds = [[47.159, 8.354], [47.696, 8.984]]
  const { idOfTpopBeingLocalized } = store.map.tpop
  if (idOfTpopBeingLocalized) {
    return store.map.tpop.bounds
  } if (store.map.activeApfloraLayers.includes(`TpopBeob`)) {
    return store.map.tpopBeob.bounds
  } else if (
    !store.map.activeApfloraLayers.includes(`Pop`) &&
    !store.map.activeApfloraLayers.includes(`Tpop`) &&
    !store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`) &&
    !store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
  ) {
    return ktZhBounds
  } else {
    const popBounds = store.map.pop.bounds
    const tpopBounds = store.map.tpop.bounds
    const beobNichtZuzuordnenBounds = store.map.beobNichtZuzuordnen.bounds
    const beobNichtBeurteiltBounds = store.map.beobNichtBeurteilt.bounds
    const boundsToUse = []
    if (store.map.activeApfloraLayers.includes(`Pop`) && popBounds) {
      boundsToUse.push(popBounds)
    }
    if (store.map.activeApfloraLayers.includes(`Tpop`) && tpopBounds) {
      boundsToUse.push(tpopBounds)
    }
    if (store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`) && beobNichtZuzuordnenBounds) {
      boundsToUse.push(beobNichtZuzuordnenBounds)
    }
    if (store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`) && beobNichtBeurteiltBounds) {
      boundsToUse.push(beobNichtBeurteiltBounds)
    }
    if (boundsToUse.length === 0) {
      boundsToUse.push(ktZhBounds)
    }
    return getEncompassingBound(boundsToUse)
  }
}
