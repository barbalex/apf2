import { Marker as LeafletMarker, Tooltip, Popup } from 'react-leaflet'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  mapTpopIconAtom,
  mapTpopLabelAtom,
} from '../../../../../store/index.ts'
import { tpopIcon } from './tpopIcon.ts'
import { tpopIconHighlighted } from './tpopIconHighlighted.ts'
import { u as uIcon } from './statusGroup/u.ts'
import { uHighlighted as uIconHighlighted } from './statusGroup/uHighlighted.ts'
import { a as aIcon } from './statusGroup/a.ts'
import { aHighlighted as aIconHighlighted } from './statusGroup/aHighlighted.ts'
import { p as pIcon } from './statusGroup/p.ts'
import { pHighlighted as pIconHighlighted } from './statusGroup/pHighlighted.ts'
import { q as qIcon } from './statusGroup/q.ts'
import { qHighlighted as qIconHighlighted } from './statusGroup/qHighlighted.ts'
import { svg100 } from './statusGroupSymbols/100.ts'
import { svg100Highlighted } from './statusGroupSymbols/100Highlighted.ts'
import { svg101 } from './statusGroupSymbols/101.ts'
import { svg101Highlighted } from './statusGroupSymbols/101Highlighted.ts'
import { svg200 } from './statusGroupSymbols/200.ts'
import { svg200Highlighted } from './statusGroupSymbols/200Highlighted.ts'
import { svg201 } from './statusGroupSymbols/201.ts'
import { svg201Highlighted } from './statusGroupSymbols/201Highlighted.ts'
import { svg202 } from './statusGroupSymbols/202.ts'
import { svg202Highlighted } from './statusGroupSymbols/202Highlighted.ts'
import { svg300 } from './statusGroupSymbols/300.ts'
import { svg300Highlighted } from './statusGroupSymbols/300Highlighted.ts'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.ts'
import { openTree2WithActiveNodeArray } from '../../../../../modules/openTree2WithActiveNodeArray.ts'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'

import styles from '../BeobNichtBeurteilt/Marker.module.css'

const getIconHtml = ({ isHighlighted, tpop, tpopIconName }) => {
  let html = isHighlighted ? tpopIconHighlighted : tpopIcon
  if (tpopIconName === 'statusGroup') {
    html = isHighlighted ? qIconHighlighted : qIcon
    if (tpop.status === 300) {
      html = isHighlighted ? pIconHighlighted : pIcon
    } else if (tpop.status >= 200) {
      html = isHighlighted ? aIconHighlighted : aIcon
    } else if (tpop.status >= 100) {
      html = isHighlighted ? uIconHighlighted : uIcon
    }
  } else if (tpopIconName === 'statusGroupSymbols') {
    html = isHighlighted ? svg100Highlighted : svg100
    if (tpop.status === 100) {
      html = isHighlighted ? svg100Highlighted : svg100
    } else if (tpop.status === 101) {
      html = isHighlighted ? svg101Highlighted : svg101
    } else if (tpop.status === 200) {
      html = isHighlighted ? svg200Highlighted : svg200
    } else if (tpop.status === 201) {
      html = isHighlighted ? svg201Highlighted : svg201
    } else if (tpop.status === 202) {
      html = isHighlighted ? svg202Highlighted : svg202
    } else if (tpop.status === 300) {
      html = isHighlighted ? svg300Highlighted : svg300
    }
  }
  return html
}

export const Marker = ({ tpop }) => {
  const { apId, projId, tpopId } = useParams()
  const { search } = useLocation()

  const tpopIconName = useAtomValue(mapTpopIconAtom)
  const tpopLabelName = useAtomValue(mapTpopLabelAtom)

  const popNr = tpop?.popByPopId?.nr ?? '(keine Nr)'
  const tpopNr = tpop?.nr ?? '(keine Nr)'
  const nrLabel = `${popNr}.${tpopNr}`.toString()
  const isHighlighted = tpopId === tpop.id

  const iconHtml = getIconHtml({ isHighlighted, tpop, tpopIconName })

  const popId = tpop?.popByPopId?.id ?? ''

  // eslint-disable-next-line
  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
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
        tpop.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })

  const openTpopInTab = () => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${
      tpop.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  const latLng = new window.L.LatLng(tpop.wgs84Lat, tpop.wgs84Long)
  const icon = window.L.divIcon({ html: iconHtml })
  let title = nrLabel
  if (tpopLabelName === 'name') title = tpop.flurname
  if (tpopLabelName === 'none') title = ''
  const artname = tpop?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? ''

  return (
    <LeafletMarker
      position={latLng}
      icon={icon}
      title={title}
    >
      <Popup>
        <>
          <div>Teil-Population</div>
          <h3 className={styles.h3}>
            {`${tpop.nr ?? '(keine Nr)'}: ${
              tpop.flurname ?? '(kein Flurname)'
            }`}
          </h3>
          <div className={styles.info}>
            <div>Art:</div>
            <div>{artname}</div>
            <div>Population:</div>
            <div>
              {`${tpop?.popByPopId?.nr ?? '(keine Nr)'}: ${
                tpop?.popByPopId?.name ?? '(kein Name)'
              }`}
            </div>
            <div>Koordinaten:</div>
            <div>
              {`${tpop.lv95X?.toLocaleString(
                'de-ch',
              )} / ${tpop.lv95Y?.toLocaleString('de-ch')}`}
            </div>
            <div>Status:</div>
            <div>{`${
              tpop?.popStatusWerteByStatus?.text ?? '(kein Status)'
            }`}</div>
          </div>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openTpopInTab}
            fullWidth
            className={styles.button}
          >
            Formular in neuem Fenster öffnen
          </Button>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openTpopInTree2}
            fullWidth
            className={styles.button}
          >
            Formular in Navigationsbaum 2 öffnen
          </Button>
        </>
      </Popup>
      <Tooltip
        direction="bottom"
        opacity={1}
        permanent
        className={styles.tooltip}
      >
        <span className="mapTooltip">{title}</span>
      </Tooltip>
    </LeafletMarker>
  )
}
