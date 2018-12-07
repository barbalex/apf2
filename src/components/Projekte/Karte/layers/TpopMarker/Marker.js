import React, { useContext } from 'react'
import { Marker } from 'react-leaflet'
import get from 'lodash/get'

import mobxStoreContext from '../../../../../mobxStoreContext'
import tpopIcon from '../../../../../etc/tpop.png'
import tpopIconHighlighted from '../../../../../etc/tpopHighlighted.png'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const TpopMarker = ({ treeName, tpop }: { treeName: string, tpop: Object }) => {
  const mobxStore = useContext(mobxStoreContext)
  const { apfloraLayers, tpopLabelUsingNr } = mobxStore
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  //const { ap, projekt } = activeNodes
  const { idsFiltered: mapIdsFiltered } = mobxStore[treeName].map

  const tpopNr = get(tpop, 'nr', '(keine Nr)')
  const nrLabel = `${get(
    tpop,
    'popByPopId.nr',
    '(keine Nr)',
  )}.${tpopNr}`.toString()
  const isHighlighted = mapIdsFiltered.includes(tpop.id)
  const latLng = new window.L.LatLng(...epsg2056to4326(tpop.x, tpop.y))
  const icon = window.L.icon({
    iconUrl: isHighlighted ? tpopIconHighlighted : tpopIcon,
    iconSize: [24, 24],
    className: isHighlighted ? 'tpopIconHighlighted' : 'tpopIcon',
  })
  const title = tpopLabelUsingNr ? tpop.flurname : nrLabel
  const zIndexOffset = -apfloraLayers.findIndex(
    apfloraLayer => apfloraLayer.value === 'tpop',
  )
  return <Marker position={latLng} icon={icon} />
}

export default TpopMarker
