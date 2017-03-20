export default (store, layer) => {
  if (layer === store.map.activeBaseLayer) {
    store.map.activeBaseLayer = null
  } else {
    store.map.activeBaseLayer = layer
  }
}
