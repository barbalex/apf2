import { useContext } from 'react'
import { Marker as LeafletMarker, Popup } from 'react-leaflet'
import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router'

import { MobxContext } from '../../../../../mobxContext.js'
import { beobIconString } from './beobIconString.js'
import { beobIconAbsenzString } from './beobIconAbsenzString.js'
import { beobIconHighlightedString } from './beobIconHighlightedString.js'
import { beobIconHighlightedAbsenzString } from './beobIconHighlightedAbsenzString.js'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.js'
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
const AbsenzDiv = styled.div`
  color: red;
  font-weight: bold;
`

export const Marker = observer(({ beob }) => {
  const { apId, projId, beobId } = useParams()
  const { search } = useLocation()

  const store = useContext(MobxContext)
  const { openTree2WithActiveNodeArray } = store

  const isHighlighted = beobId === beob.id
  const isAbsenz = beob.absenz
  const latLng = new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
  // use divIcon instead? https://leafletjs.com/reference.html#divicon
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

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const openBeobInTree2 = () =>
    openTree2WithActiveNodeArray({
      activeNodeArray: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'nicht-zuzuordnende-Beobachtungen',
        beob.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })

  const openBeobInTab = () => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/nicht-zuzuordnende-Beobachtungen/${
      beob.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  return (
    <LeafletMarker
      position={latLng}
      icon={icon}
      title={label}
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
          <div>
            {`Koordinaten: ${beob.lv95X?.toLocaleString(
              'de-ch',
            )} / ${beob.lv95Y?.toLocaleString('de-ch')}`}
          </div>
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
            onClick={openBeobInTree2}
            color="inherit"
            fullWidth
          >
            Formular in Navigationsbaum 2 öffnen
          </StyledButton>
          <Data id={beob.id} />
        </>
      </Popup>
    </LeafletMarker>
  )
})
