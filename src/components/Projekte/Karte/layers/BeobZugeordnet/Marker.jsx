import React, { useContext, useCallback } from 'react'
import { Marker, Popup } from 'react-leaflet'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import Button from '@mui/material/Button'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import storeContext from '../../../../../storeContext'
import beobIcon from './beob.svg'
import beobIconHighlighted from './beobHighlighted.svg'
import getNearestTpop from '../../../../../modules/getNearestTpop'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import updateBeobByIdGql from './updateBeobById'
import useSearchParamsState from '../../../../../modules/useSearchParamsState'
import isMobilePhone from '../../../../../modules/isMobilePhone'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledButton = styled(Button)`
  margin-top: 5px !important;
`

const BeobZugeordnetMarker = ({ beob }) => {
  const { apId, projId, beobId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  const client = useApolloClient()
  const store = useContext(storeContext)
  const { assigningBeob, openTree2WithActiveNodeArray } = store

  const isHighlighted = beobId === beob.id
  const latLng = new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
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
  } else if (beob.datum) {
    datum = format(new Date(beob.datum), 'yyyy.MM.dd')
  }
  const autor = beob.autor ?? '(kein Autor)'
  const quelle = beob?.quelle ?? ''
  const label = `${datum}: ${autor} (${quelle})`

  const onMoveend = useCallback(
    async (event) => {
      /**
       * assign to nearest tpop
       * point url to moved beob
       */
      const nearestTpop = await getNearestTpop({
        apId,
        latLng: event.target._latlng,
        client,
      })
      const newActiveNodeArray = [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        nearestTpop.popId,
        'Teil-Populationen',
        nearestTpop.id,
        'Beobachtungen',
        beob.id,
      ]
      navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
      await client.mutate({
        mutation: updateBeobByIdGql,
        variables: {
          id: beob.id,
          tpopId: nearestTpop.id,
        },
      })

      client.refetchQueries({
        include: [
          'BeobZugeordnetForMapQuery',
          'BeobNichtBeurteiltForMapQuery',
          'BeobAssignLinesQuery',
        ],
      })
      //map.redraw()
    },
    [apId, client, projId, beob.id, navigate, search],
  )
  const popId = beob?.tpopByTpopId?.popId ?? ''
  const tpopId = beob?.tpopByTpopId?.id ?? ''

  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const openBeobInTree2 = useCallback(() => {
    openTree2WithActiveNodeArray({
      activeNodeArray: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Beobachtungen',
        beob.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })
  }, [
    apId,
    beob.id,
    openTree2WithActiveNodeArray,
    popId,
    projId,
    projekteTabs,
    search,
    setProjekteTabs,
    tpopId,
  ])
  const openBeobInTab = useCallback(() => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen/${
      beob.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [apId, beob.id, popId, projId, tpopId])

  return (
    <Marker
      position={latLng}
      icon={icon}
      title={label}
      draggable={assigningBeob}
      eventHandlers={{ moveend: onMoveend }}
    >
      <Popup>
        <>
          <div>{`Beobachtung von ${
            beob?.aeTaxonomyByArtId?.artname ?? ''
          }`}</div>
          <StyledH3>{label}</StyledH3>
          <div>
            {`Koordinaten: ${beob.lv95X?.toLocaleString(
              'de-ch',
            )} / ${beob.lv95Y?.toLocaleString('de-ch')}`}
          </div>
          <div>{`Teil-Population: ${beob?.tpopByTpopId?.nr ?? '(keine Nr)'}: ${
            beob?.tpopByTpopId?.flurname ?? '(kein Flurname)'
          }`}</div>
          <StyledButton
            size="small"
            variant="outlined"
            onClick={openBeobInTab}
            color="inherit"
          >
            Formular in neuem Fenster öffnen
          </StyledButton>
          <StyledButton
            size="small"
            variant="outlined"
            color="inherit"
            onClick={openBeobInTree2}
          >
            Formular in Strukturbaum 2 öffnen
          </StyledButton>
        </>
      </Popup>
    </Marker>
  )
}

export default observer(BeobZugeordnetMarker)
