import { useAtomValue, useSetAtom } from 'jotai'
import { Marker as LeafletMarker, Popup } from 'react-leaflet'
import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import { useApolloClient } from '@apollo/client/react'
import Button from '@mui/material/Button'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { LeafletEvent } from 'leaflet'

import {
  assigningBeobAtom,
  setTreeLastTouchedNodeAtom,
} from '../../../../../store/index.ts'
import { beobIconString } from './beobIconString.ts'
import { beobIconAbsenzString } from './beobIconAbsenzString.ts'
import { beobIconHighlightedString } from './beobIconHighlightedString.ts'
import { beobIconHighlightedAbsenzString } from './beobIconHighlightedAbsenzString.ts'
import { getNearestTpop } from '../../../../../modules/getNearestTpop.ts'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { updateBeobById } from './updateBeobById.ts'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.ts'
import { openTree2WithActiveNodeArray } from '../../../../../modules/openTree2WithActiveNodeArray.ts'
import { Data } from '../BeobData/index.tsx'

import type {
  BeobId,
  AeTaxonomiesId,
} from '../../../../../models/apflora/index.ts'

import styles from './Marker.module.css'

export interface BeobNichtBeurteiltNode {
  id: BeobId
  wgs84Lat: number
  wgs84Long: number
  lv95X: number | null
  lv95Y: number | null
  datum: string | null
  autor: string | null
  quelle: string | null
  absenz: boolean | null
  aeTaxonomyByArtId: {
    id: AeTaxonomiesId
    artname: string | null
  } | null
}

interface MarkerProps {
  beob: BeobNichtBeurteiltNode
}

export const Marker = ({ beob }: MarkerProps) => {
  const { apId, projId, beobId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()
  const setTreeLastTouchedNode = useSetAtom(setTreeLastTouchedNodeAtom)

  const assigningBeob = useAtomValue(assigningBeobAtom)

  const tsQueryClient = useQueryClient()
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
  // null is turned into the epoch date, which isValid accepts
  if (!isValid(new Date(beob.datum ?? 0))) {
    datum = '(ungültiges Datum)'
  } else if (beob.datum) {
    datum = format(new Date(beob.datum), 'yyyy.MM.dd')
  }
  const autor = beob.autor ?? '(kein Autor)'
  const quelle = beob?.quelle ?? ''
  const label = `${datum}: ${autor} (${quelle})`

  const onMoveend = async (event: LeafletEvent) => {
    /**
     * assign to nearest tpop
     * point url to moved beob
     */
    const nearestTpop = await getNearestTpop({
      ...(apId ? { apId } : {}),
      latLng: event.target._latlng,
    })
    await apolloClient.mutate({
      mutation: updateBeobById,
      variables: {
        id: beob.id,
        tpopId: nearestTpop.id,
      },
    })
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${nearestTpop.popId}/Teil-Populationen/${nearestTpop.id}/Beobachtungen/${beob.id}${search}`,
    )
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeQuery`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`BeobZugeordnetForMapQuery`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`BeobNichtBeurteiltForMapQuery`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`BeobAssignLinesQuery`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeBeobZugeordnet`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeBeobNichtZuzuordnen`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeBeobNichtBeurteilt`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    setTreeLastTouchedNode([
      'Projekte',
      projId ?? '',
      'Arten',
      apId ?? '',
      'Populationen',
      nearestTpop.popId ?? '',
      'Teil-Populationen',
      nearestTpop.id,
      'Beobachtungen',
      beob.id,
    ])
  }

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const openBeobInTree2 = () =>
    openTree2WithActiveNodeArray({
      activeNodeArray: [
        'Projekte',
        projId ?? '',
        'Arten',
        apId ?? '',
        'nicht-beurteilte-Beobachtungen',
        beob.id,
      ],
      search,
      projekteTabs,
      setProjekteTabs,
    })

  const openBeobInTab = () => {
    const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/nicht-beurteilte-Beobachtungen/${
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
      draggable={assigningBeob}
      eventHandlers={{ moveend: (event) => void onMoveend(event) }}
    >
      <Popup>
        <>
          <div>{`Beobachtung von ${
            beob?.aeTaxonomyByArtId?.artname ?? ''
          }`}</div>
          {beob?.absenz ?
            <div className={styles.absenz}>Absenzmeldung</div>
          : null}
          <h3 className={styles.h3}>{label}</h3>
          <div>
            {`Koordinaten: ${beob.lv95X?.toLocaleString(
              'de-ch',
            )} / ${beob.lv95Y?.toLocaleString('de-ch')}`}
          </div>
          <Button
            size="small"
            variant="text"
            onClick={openBeobInTab}
            color="inherit"
            fullWidth
            className={styles.button}
          >
            Formular in neuem Fenster öffnen
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={openBeobInTree2}
            color="inherit"
            fullWidth
            className={styles.button}
          >
            Formular in Navigationsbaum 2 öffnen
          </Button>
          <Data id={beob.id} />
        </>
      </Popup>
    </LeafletMarker>
  )
}
