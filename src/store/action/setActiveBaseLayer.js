// @flow
export default (store: Object, layer: Object): void => {
  if (layer === store.map.activeBaseLayer) {
    store.map.activeBaseLayer = null
  } else {
    store.map.activeBaseLayer = layer
  }
}
