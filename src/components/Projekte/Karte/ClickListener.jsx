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
  // idea 2:
  // get all layers
  // fetch all layers features using turf.inside
  // https://gis.stackexchange.com/a/277207/13491
  // turf.intersect(myPt.toGeoJSON(), myPoly.toGeoJSON()); if (intersection != undefined){ // must be inside }
  // idea 3:
  // use a FeatureGroup https://leafletjs.com/reference.html#featuregroup

  return null
}

export default ClickListener
