import { Polyline as LeafletPolyline, Popup } from 'react-leaflet'
import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.ts'
import { openTree2WithActiveNodeArray } from '../../../../../modules/openTree2WithActiveNodeArray.ts'
import { Data } from '../BeobData/index.tsx'

import markerStyles from '../BeobNichtBeurteilt/Marker.module.css'

export const Polyline = ({ beob }) => {
  const { apId, projId, beobId } = useParams()
  const { search } = useLocation()

  const isHighlighted = beobId === beob.id
  const beobLatLng = new window.L.LatLng(beob.wgs84Lat, beob.wgs84Long)
  const tpopLong = beob?.tpopByTpopId?.wgs84Long
  const tpopLat = beob?.tpopByTpopId?.wgs84Lat
  const tpopLatLng =
    tpopLong && tpopLat ? new window.L.LatLng(tpopLat, tpopLong) : beobLatLng
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

  const popId = beob?.tpopByTpopId?.popId ?? ''
  const tpopId = beob?.tpopByTpopId?.id ?? ''

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const openBeobInTree2 = () =>
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

  const openBeobInTab = () => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen/${
      beob.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  const openTpopInTree2 = () =>
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
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })

  const openTpopInTab = () => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  return (
    <LeafletPolyline
      positions={[beobLatLng, tpopLatLng]}
      color={isHighlighted ? 'yellow' : '#FF00FF'}
    >
      <Popup>
        <>
          <h3 className={markerStyles.h3}>Zuordnung</h3>
          <div>einer Beobachtung</div>
          <div className={markerStyles.info}>
            <div>von:</div>
            <div>{beob?.aeTaxonomyByArtId?.artname ?? ''}</div>
            <div>am:</div>
            <div>{datum}</div>
            <div>durch:</div>
            <div>{autor}</div>
            <div>bei:</div>
            <div>
              {`${beob.lv95X?.toLocaleString(
                'de-ch',
              )} / ${beob.lv95Y?.toLocaleString('de-ch')}`}
            </div>
            <div>zur T-Pop:</div>
            <div>{`${beob?.tpopByTpopId?.nr ?? '(keine Nr)'}: ${
              beob?.tpopByTpopId?.flurname ?? '(kein Flurname)'
            }`}</div>
            <div>Quelle:</div>
            <div>{quelle}</div>
          </div>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openBeobInTab}
            fullWidth
            className={markerStyles.button}
          >
            Beob. in neuem Fenster öffnen
          </Button>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openBeobInTree2}
            fullWidth
            className={markerStyles.button}
          >
            Beob. in Navigationsbaum 2 öffnen
          </Button>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openTpopInTab}
            fullWidth
            className={markerStyles.button}
          >
            TPop. in neuem Fenster öffnen
          </Button>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openTpopInTree2}
            fullWidth
            className={markerStyles.button}
          >
            TPop. in Navigationsbaum 2 öffnen
          </Button>
          <Data id={beob.id} />
        </>
      </Popup>
    </LeafletPolyline>
  )
}
