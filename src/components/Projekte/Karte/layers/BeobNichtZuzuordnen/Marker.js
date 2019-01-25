import React, { useContext } from 'react'
import { Marker, Popup } from 'react-leaflet'
import get from 'lodash/get'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import mobxStoreContext from '../../../../../mobxStoreContext'
import beobIcon from './beob.svg'
import beobIconHighlighted from './beobHighlighted.svg'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

const BeobNichtZuzuordnenMarker = ({
  treeName,
  beob,
}: {
  treeName: string,
  beob: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered } = mobxStore[treeName].map

  const isHighlighted = idsFiltered.includes(beob.id)
  const latLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
  const icon = window.L.icon({
    iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
    iconSize: [24, 24],
    className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
  })
  // some dates are not valid
  // need to account for that
  let datum = '(kein Datum)'
  if (!isValid(new Date(beob.datum))) {
    datum = '(ungültiges Datum)'
  } else if (!!beob.datum) {
    datum = format(new Date(beob.datum), 'yyyy.MM.dd')
  }
  const autor = beob.autor || '(kein Autor)'
  const quelle = get(beob, 'beobQuelleWerteByQuelleId.name', '')
  const label = `${datum}: ${autor} (${quelle})`

  return (
    <Marker position={latLng} icon={icon} title={label}>
      <Popup>
        <>
          <div>{`Beobachtung von ${get(
            beob,
            'aeEigenschaftenByArtId.artname',
            '',
          )}`}</div>
          <StyledH3>{label}</StyledH3>
          <div>
            {`Koordinaten: ${beob.x.toLocaleString(
              'de-ch',
            )} / ${beob.y.toLocaleString('de-ch')}`}
          </div>
          <a
            href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/nicht-zuzuordnende-Beobachtungen/${
              beob.id
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formular in neuem Tab öffnen
          </a>
        </>
      </Popup>
    </Marker>
  )
}

export default observer(BeobNichtZuzuordnenMarker)
