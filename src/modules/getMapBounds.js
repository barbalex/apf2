import getEncompassingBound from './getEncompassingBound'

export default (store) => {
  const ktZhBounds = [[47.159, 8.354], [47.696, 8.984]]
  const { idOfTpopBeingLocalized } = store.map.tpop
  if (idOfTpopBeingLocalized) {
    return store.map.tpop.bounds
  } if (store.map.tpopBeob.visible) {
    return store.map.tpopBeob.bounds
  } else if (
    !store.map.pop.visible &&
    !store.map.tpop.visible &&
    !store.map.beobNichtZuzuordnen.visible &&
    !store.map.beobNichtBeurteilt.visible
  ) {
    return ktZhBounds
  } else {
    const popBounds = store.map.pop.bounds
    const tpopBounds = store.map.tpop.bounds
    const beobNichtZuzuordnenBounds = store.map.beobNichtZuzuordnen.bounds
    const beobNichtBeurteiltBounds = store.map.beobNichtBeurteilt.bounds
    const boundsToUse = []
    if (store.map.pop.visible && popBounds) {
      boundsToUse.push(popBounds)
    }
    if (store.map.tpop.visible && tpopBounds) {
      boundsToUse.push(tpopBounds)
    }
    if (store.map.beobNichtZuzuordnen.visible && beobNichtZuzuordnenBounds) {
      boundsToUse.push(beobNichtZuzuordnenBounds)
    }
    if (store.map.beobNichtBeurteilt.visible && beobNichtBeurteiltBounds) {
      boundsToUse.push(beobNichtBeurteiltBounds)
    }
    if (boundsToUse.length === 0) {
      boundsToUse.push(ktZhBounds)
    }
    return getEncompassingBound(boundsToUse)
  }
}
