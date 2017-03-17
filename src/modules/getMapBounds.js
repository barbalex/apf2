import getEncompassingBound from './getEncompassingBound'

export default (store) => {
  const ktZhBounds = [[47.159, 8.354], [47.696, 8.984]]
  const { idOfTpopBeingLocalized } = store.map.tpop
  if (idOfTpopBeingLocalized) {
    return store.map.tpop.bounds
  } if (store.map.activeOverlays.includes(`tpopBeob`)) {
    return store.map.tpopBeob.bounds
  } else if (
    !store.map.activeOverlays.includes(`pop`) &&
    !store.map.activeOverlays.includes(`tpop`) &&
    !store.map.activeOverlays.includes(`beobNichtZuzuordnen`) &&
    !store.map.activeOverlays.includes(`beobNichtBeurteilt`)
  ) {
    return ktZhBounds
  } else {
    const popBounds = store.map.pop.bounds
    const tpopBounds = store.map.tpop.bounds
    const beobNichtZuzuordnenBounds = store.map.beobNichtZuzuordnen.bounds
    const beobNichtBeurteiltBounds = store.map.beobNichtBeurteilt.bounds
    const boundsToUse = []
    if (store.map.activeOverlays.includes(`pop`) && popBounds) {
      boundsToUse.push(popBounds)
    }
    if (store.map.activeOverlays.includes(`tpop`) && tpopBounds) {
      boundsToUse.push(tpopBounds)
    }
    if (store.map.activeOverlays.includes(`beobNichtZuzuordnen`) && beobNichtZuzuordnenBounds) {
      boundsToUse.push(beobNichtZuzuordnenBounds)
    }
    if (store.map.activeOverlays.includes(`beobNichtBeurteilt`) && beobNichtBeurteiltBounds) {
      boundsToUse.push(beobNichtBeurteiltBounds)
    }
    if (boundsToUse.length === 0) {
      boundsToUse.push(ktZhBounds)
    }
    return getEncompassingBound(boundsToUse)
  }
}
