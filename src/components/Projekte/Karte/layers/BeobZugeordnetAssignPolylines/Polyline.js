import React, { useContext } from 'react'
import { Polyline, Popup } from 'react-leaflet'
import get from 'lodash/get'
import styled from 'styled-components'
import format from 'date-fns/format'
import { observer } from 'mobx-react-lite'

import mobxStoreContext from '../../../../../mobxStoreContext'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'
import appBaseUrl from '../../../../../modules/appBaseUrl'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

const Line = ({ treeName, beob }: { treeName: string, beob: Object }) => {
  const mobxStore = useContext(mobxStoreContext)
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const { ap, projekt } = activeNodes
  const { idsFiltered } = mobxStore[treeName].map

  const isHighlighted = idsFiltered.includes(beob.id)
  const beobLatLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
  const tpopX = get(beob, 'tpopByTpopId.x')
  const tpopY = get(beob, 'tpopByTpopId.y')
  const tpopLatLng =
    tpopX && tpopY
      ? new window.L.LatLng(...epsg2056to4326(tpopX, tpopY))
      : beobLatLng
  const datum = beob.datum ? format(beob.datum, 'yyyy.MM.dd') : '(kein Datum)'
  const autor = beob.autor || '(kein Autor)'
  const quelle = get(beob, 'beobQuelleWerteByQuelleId.name', '')
  return (
    <Polyline
      positions={[beobLatLng, tpopLatLng]}
      color={isHighlighted ? 'yellow' : '#FF00FF'}
    >
      <Popup>
        <>
          <StyledH3>Zuordnung</StyledH3>
          <div>einer Beobachtung</div>
          <div>{`von ${get(beob, 'aeEigenschaftenByArtId.artname', '')}`}</div>
          <div>{`am ${datum}`}</div>
          <div>{`durch ${autor}`}</div>
          <div>
            {`bei: ${beob.x.toLocaleString('de-ch')} / ${beob.y.toLocaleString(
              'de-ch',
            )}`}
          </div>
          <div>{`zur Teil-Population: ${get(
            beob,
            'tpopByTpopId.nr',
            '(keine Nr)',
          )}: ${get(beob, 'tpopByTpopId.flurname', '(kein Flurname)')}`}</div>
          <div>{`Quelle: ${quelle}`}</div>
          <a
            href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${get(
              beob,
              'tpopByTpopId.popId',
              '',
            )}/Teil-Populationen/${get(
              beob,
              'tpopByTpopId.id',
              '',
            )}/Beobachtungen/${beob.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Formular in neuem Tab öffnen
          </a>
        </>
      </Popup>
    </Polyline>
  )
}

export default observer(Line)
