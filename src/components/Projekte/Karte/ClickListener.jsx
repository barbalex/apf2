import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useMapEvent } from 'react-leaflet/hooks'

import storeContext from '../../../storeContext'

const ClickListener = () => {
  const store = useContext(storeContext)
  const { activeOverlays: activeOverlaysRaw } = store
  const activeOverlays = getSnapshot(activeOverlaysRaw)

  const map = useMapEvent('click', (event) => {
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
    // get all activeOverlays
    // filter queryable ones (Markierungen, Gemeinden, Betreuungsgebiete, Detailplaene, Massnahmen)
    // directly query them using ST_Contains
    // using https://postgis.net/docs/ST_Contains.html, https://github.com/graphile-contrib/postgraphile-plugin-connection-filter-postgis#operators
    // build popup from responses (https://leafletjs.com/reference.html#popup)
    // remove onEachFeature from queryable layers
    // seems to be the best solution
    // may even be more efficient as no need to bind popups when adding layers

    console.log('ClickListener', { event, map })
    map.eachLayer((layer) => {
      const pane = layer.options?.pane
      console.log('ClickListener', { layer, pane })
    })
  })

  return null
}

export default observer(ClickListener)
