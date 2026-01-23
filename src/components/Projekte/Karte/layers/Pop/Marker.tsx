import { Marker as LeafletMarker, Tooltip, Popup } from 'react-leaflet'
import Button from '@mui/material/Button'
import { useParams, useLocation } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  mapApfloraLayersAtom,
  mapPopIconAtom,
  mapPopLabelAtom,
} from '../../../../../store/index.ts'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { popIconString } from './popIconString.ts'
import { popHighlightedIconString } from './popHighlightedIconString.ts'
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

import styles from '../BeobNichtBeurteilt/Marker.module.css'

const getIconHtml = ({ isHighlighted, pop, popIconName }) => {
  let iconHtml = isHighlighted ? popHighlightedIconString : popIconString
  if (popIconName === 'statusGroup') {
    iconHtml = isHighlighted ? qIconHighlighted : qIcon
    if (pop.status === 300) {
      iconHtml = isHighlighted ? pIconHighlighted : pIcon
    } else if (pop.status >= 200) {
      iconHtml = isHighlighted ? aIconHighlighted : aIcon
    } else if (pop.status >= 100) {
      iconHtml = isHighlighted ? uIconHighlighted : uIcon
    }
  } else if (popIconName === 'statusGroupSymbols') {
    iconHtml = isHighlighted ? svg100Highlighted : svg100
    if (pop.status === 100) {
      iconHtml = isHighlighted ? svg100Highlighted : svg100
    } else if (pop.status === 101) {
      iconHtml = isHighlighted ? svg101Highlighted : svg101
    } else if (pop.status === 200) {
      iconHtml = isHighlighted ? svg200Highlighted : svg200
    } else if (pop.status === 201) {
      iconHtml = isHighlighted ? svg201Highlighted : svg201
    } else if (pop.status === 202) {
      iconHtml = isHighlighted ? svg202Highlighted : svg202
    } else if (pop.status === 300) {
      iconHtml = isHighlighted ? svg300Highlighted : svg300
    }
  }
  return iconHtml
}

export const Marker = ({ pop }) => {
  const { apId, projId, popId } = useParams()
  const { search } = useLocation()

  const apfloraLayers = useAtomValue(mapApfloraLayersAtom)
  const popIconName = useAtomValue(mapPopIconAtom)
  const popLabelName = useAtomValue(mapPopLabelAtom)

  const nrLabel = pop?.nr?.toString?.() ?? '(keine Nr)'
  let title = nrLabel
  if (popLabelName === 'name') title = pop?.name ?? '(kein Name)'
  if (popLabelName === 'none') title = ''
  // beware: leaflet needs title to always be a string
  if (title && title.toString) {
    title = title.toString()
  }
  const isHighlighted = popId === pop.id

  const iconHtml = getIconHtml({ isHighlighted, pop, popIconName })

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const openPopInTree2 = () =>
    openTree2WithActiveNodeArray({
      activeNodeArray: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        pop.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })

  const openPopInTab = () => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${
      pop.id
    }`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  const latLng = new window.L.LatLng(pop.wgs84Lat, pop.wgs84Long)
  const icon = window.L.divIcon({ html: iconHtml })
  const zIndexOffset = -apfloraLayers.findIndex(
    (apfloraLayer) => apfloraLayer.value === 'pop',
  )
  const artname = pop?.apByApId?.aeTaxonomyByArtId?.artname ?? ''

  return (
    <LeafletMarker
      position={latLng}
      icon={icon}
      title={title}
      zIndexOffset={zIndexOffset}
    >
      <Popup>
        <>
          <div>Population</div>
          <h3 className={styles.h3}>
            {`${pop.nr ?? '(keine Nummer)'}: ${pop.name ?? '(kein Name)'}`}
          </h3>
          <div className={styles.info}>
            <div>Art:</div>
            <div>{artname}</div>
            <div>Koordinaten:</div>
            <div>
              {`${pop.lv95X ? pop.lv95X?.toLocaleString('de-ch') : ''} / ${
                pop.lv95Y ? pop.lv95Y?.toLocaleString('de-ch') : ''
              }`}
            </div>
            <div>Status:</div>
            <div>{`${
              pop?.popStatusWerteByStatus?.text ?? '(kein Status)'
            }`}</div>
          </div>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openPopInTab}
            fullWidth
            className={styles.button}
          >
            Formular in neuem Fenster öffnen
          </Button>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={openPopInTree2}
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
