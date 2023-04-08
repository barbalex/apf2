import { useMapEvent } from 'react-leaflet/hooks'

const ClickListener = () => {
  const map = useMapEvent('click', (event) => {
    // console.log('ClickListener', { event, map })
    // map.eachLayer((layer) => {
    //   console.log('ClickListener, layer:', layer)
    // })
  })
  // idea 1:
  // get all layers
  // run onEachFeature on all layers
  // not possible because onEachFeature is not called when layer is added

  // idea 2:
  // get all layers
  // fetch all layers features using turf.inside
  // https://gis.stackexchange.com/a/277207/13491
  // turf.intersect(myPt.toGeoJSON(), myPoly.toGeoJSON()); if (intersection != undefined){ // must be inside }
  // possible but not efficient

  // idea 3:
  // use a FeatureGroup https://leafletjs.com/reference.html#featuregroup
  // does not seem to work

  // idea 4:
  // get all active layers
  // filter queryable ones
  // directly query them
  // build popup from responses

  return null
}

export default ClickListener
