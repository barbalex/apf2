import { memo, useContext, useCallback } from 'react'
import { Marker as LeafletMarker, Popup } from 'react-leaflet'
import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import Button from '@mui/material/Button'
import { useParams, useNavigate, useLocation } from 'react-router'

import { MobxContext } from '../../../../../mobxContext.js'
import { beobIconString } from './beobIconString.js'
import { beobIconAbsenzString } from './beobIconAbsenzString.js'
import { beobIconHighlightedString } from './beobIconHighlightedString.js'
import { beobIconHighlightedAbsenzString } from './beobIconHighlightedAbsenzString.js'
import { getNearestTpop } from '../../../../../modules/getNearestTpop.js'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.js'
import { updateBeobById } from './updateBeobById.js'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.js'
import { Data } from '../BeobData/index.jsx'

const StyledH3 = styled.h3`
  margin: 7px 0;
`
const StyledButton = styled(Button)`
  text-transform: none;
  justify-content: left;
  padding: 2px 0;
`
export const Info = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 15px;
`
const AbsenzDiv = styled.div`
  color: red;
  font-weight: bold;
`

export const Marker = memo(
  observer(({ beob }) => {
    const { apId, projId, beobId } = useParams()
    const navigate = useNavigate()
    const { search } = useLocation()

    const store = useContext(MobxContext)
    const { assigningBeob, openTree2WithActiveNodeArray } = store

    const apolloClient = useApolloClient()

    const isHighlighted = beobId === beob.id
    const isAbsenz = beob.absenz
    const latLng = new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
    const icon = window.L.divIcon({
      html:
        isHighlighted ?
          isAbsenz ? beobIconHighlightedAbsenzString
          : beobIconHighlightedString
        : isAbsenz ? beobIconAbsenzString
        : beobIconString,
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
          apolloClient,
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
        await apolloClient.mutate({
          mutation: updateBeobById,
          variables: {
            id: beob.id,
            tpopId: nearestTpop.id,
          },
        })

        apolloClient.refetchQueries({
          include: [
            'BeobZugeordnetForMapQuery',
            'BeobNichtBeurteiltForMapQuery',
            'BeobAssignLinesQuery',
          ],
        })
        //map.redraw()
      },
      [apId, apolloClient, projId, beob.id, navigate, search],
    )
    const popId = beob?.tpopByTpopId?.popId ?? ''
    const tpopId = beob?.tpopByTpopId?.id ?? ''

    const [projekteTabs, setProjekteTabs] = useProjekteTabs()
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
    const pop = beob?.tpopByTpopId?.popByPopId

    return (
      <LeafletMarker
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
            {beob?.absenz ?
              <AbsenzDiv>Absenzmeldung</AbsenzDiv>
            : null}
            <StyledH3>{label}</StyledH3>
            <Info>
              <div>Koordinaten:</div>
              <div>
                {`${beob.lv95X?.toLocaleString(
                  'de-ch',
                )} / ${beob.lv95Y?.toLocaleString('de-ch')}`}
              </div>
              <div>Population:</div>
              <div>{pop?.label ?? ''}</div>
              <div>Teil-Population:</div>
              <div>{`${beob?.tpopByTpopId?.nr ?? '(keine Nr)'}: ${
                beob?.tpopByTpopId?.flurname ?? '(kein Flurname)'
              }`}</div>
            </Info>
            <StyledButton
              size="small"
              variant="text"
              onClick={openBeobInTab}
              color="inherit"
              fullWidth
            >
              Formular in neuem Fenster öffnen
            </StyledButton>
            <StyledButton
              size="small"
              variant="text"
              color="inherit"
              fullWidth
              onClick={openBeobInTree2}
            >
              Formular in Navigationsbaum 2 öffnen
            </StyledButton>
            <Data id={beob.id} />
          </>
        </Popup>
      </LeafletMarker>
    )
  }),
)
