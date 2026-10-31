// TODO: let each item call it's data itself

import { useAtomValue, useSetAtom } from 'jotai'
import Button from '@mui/material/Button'
import {
  MdPauseCircleOutline,
  MdPlayCircleOutline,
  MdLocalFlorist,
  MdFilterCenterFocus,
  MdRemove,
} from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { useMap } from 'react-leaflet'
import { useParams } from 'react-router'

import { Checkbox } from '../../shared/Checkbox.tsx'
import { Error } from '../../../../../shared/Error.tsx'
import { apiFetch } from '../../../../../../modules/api.ts'
import { getBounds } from '../../../../../../modules/getBounds.ts'
import {
  assigningBeobAtom,
  setAssigningBeobAtom,
  setMapBoundsAtom,
  mapActiveApfloraLayersAtom,
  setMapActiveApfloraLayersAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../../store/index.ts'
import { PopIcon } from './PopIcon.tsx'
import { TpopIcon } from './TpopIcon.tsx'

interface NodeWithCoords {
  id: string
  wgs84Lat: number
  wgs84Long: number
}

interface PopNode extends NodeWithCoords {
  tpopsByPopId: {
    nodes: NodeWithCoords[]
  }
}

interface ApfloraLayersQueryResult {
  pop?: {
    nodes: PopNode[]
  }
  /**
   * tpop layers read their nodes from tpopByPop
   * but a path for the layer value must exist
   */
  tpop?: {
    nodes: NodeWithCoords[]
  }
  tpopByPop?: {
    nodes: PopNode[]
  }
  beobNichtBeurteilt?: {
    nodes: NodeWithCoords[]
  }
  beobNichtZuzuordnen?: {
    nodes: NodeWithCoords[]
  }
  beobZugeordnet?: {
    nodes: NodeWithCoords[]
  }
  beobZugeordnetAssignPolylines?: {
    nodes: NodeWithCoords[]
  }
}

export interface ApfloraLayer {
  label: string
  value:
    | 'pop'
    | 'tpop'
    | 'beobZugeordnet'
    | 'beobNichtBeurteilt'
    | 'beobNichtZuzuordnen'
    | 'beobZugeordnetAssignPolylines'
}

interface LayerProps {
  apfloraLayer: ApfloraLayer
}

import styles from './index.module.css'

export const Layer = ({ apfloraLayer }: LayerProps) => {
  const { apId, popId, tpopId, beobId } = useParams()

  const map = useMap()
  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const setActiveApfloraLayers = useSetAtom(setMapActiveApfloraLayersAtom)
  const assigningBeob = useAtomValue(assigningBeobAtom)
  const setAssigningBeob = useSetAtom(setAssigningBeobAtom)
  const setMapBounds = useSetAtom(setMapBoundsAtom)
  const beobNichtBeurteiltGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('nichtBeurteilt'),
  )
  const beobNichtZuzuordnenGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('nichtZuzuordnen'),
  )
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const layer = apfloraLayer.value
  const pop = layer === 'pop' && activeApfloraLayers.includes('pop')
  const tpop = layer === 'tpop' && activeApfloraLayers.includes('tpop')
  const showBeobNichtBeurteilt =
    layer === 'beobNichtBeurteilt' &&
    activeApfloraLayers.includes('beobNichtBeurteilt')
  const showBeobNichtZuzuordnen =
    layer === 'beobNichtZuzuordnen' &&
    activeApfloraLayers.includes('beobNichtZuzuordnen')
  const showBeobZugeordnet =
    layer === 'beobZugeordnet' && activeApfloraLayers.includes('beobZugeordnet')
  const showBeobZugeordnetAssignPolylines =
    layer === 'beobZugeordnetAssignPolylines' &&
    activeApfloraLayers.includes('beobZugeordnetAssignPolylines')
  const highlightedId =
    layer === 'pop' ? popId
    : layer === 'tpop' ? tpopId
    : beobId

  const variables = {
    ap: apId ? [apId] : [],
    pop,
    tpop,
    showBeobNichtBeurteilt,
    beobNichtBeurteiltFilter: beobNichtBeurteiltGqlFilter.filtered,
    showBeobNichtZuzuordnen,
    beobNichtZuzuordnenFilter: beobNichtZuzuordnenGqlFilter.filtered,
    showBeobZugeordnet,
    beobZugeordnetFilter: beobZugeordnetGqlFilter.filtered,
    showBeobZugeordnetAssignPolylines,
  }

  const { data, error } = useQuery({
    queryKey: ['apfloraLayer', layer, variables],
    queryFn: async () => {
      // phase 5: the former @include-driven one-shot document became
      // conditionally-fetched REST calls per active layer
      const apFilter =
        variables.ap.length ?
          `ap_id=in.(${variables.ap.join(',')})`
        : 'id=eq.null'
      const popOrTpop = variables.pop || variables.tpop
      const popsWithCoordsRR =
        popOrTpop ?
          apiFetch(
            `/q_pop?${apFilter}${variables.pop ? '&wgs84_lat=not.is.null' : ''}&select=id,wgs84_lat,wgs84_long`,
          )
        : Promise.resolve(null)
      // tpops of the ap's pops, grouped client-side (former tpopsByPopId)
      const popIdsR =
        popOrTpop ?
          popsWithCoordsRR.then((rows) =>
            ((rows ?? []) as { id: string }[]).map((r) => r.id),
          )
        : Promise.resolve([])
      const tpopsR = popIdsR.then((ids) =>
        ids.length ?
          (apiFetch(
            `/q_tpop?pop_id=in.(${ids.join(',')})&wgs84_lat=not.is.null&select=id,pop_id,wgs84_lat,wgs84_long`,
          ) ?? [])
        : [],
      )
      const [
        popsWithCoordsR,
        allPopsR,
        tpopsOfPopsR,
        beobNbR,
        beobNzR,
        beobZR,
      ] = await Promise.all([
        variables.pop ? popsWithCoordsRR : Promise.resolve(null),
        variables.tpop ? popsWithCoordsRR : Promise.resolve(null),
        tpopsR,
        variables.showBeobNichtBeurteilt ?
          apiFetch('/rpc/query_beob?select=id,wgs84_lat,wgs84_long', {
            method: 'POST',
            body: JSON.stringify({
              p_filter: variables.beobNichtBeurteiltFilter,
            }),
          })
        : Promise.resolve(null),
        variables.showBeobNichtZuzuordnen ?
          apiFetch('/rpc/query_beob?select=id,wgs84_lat,wgs84_long', {
            method: 'POST',
            body: JSON.stringify({
              p_filter: variables.beobNichtZuzuordnenFilter,
            }),
          })
        : Promise.resolve(null),
        variables.showBeobZugeordnet ?
          apiFetch('/rpc/query_beob?select=id,wgs84_lat,wgs84_long', {
            method: 'POST',
            body: JSON.stringify({
              p_filter: variables.beobZugeordnetFilter,
            }),
          })
        : Promise.resolve(null),
      ])
      const tpopsByPopId = new Map<
        string,
        { id: string; wgs84_lat: number; wgs84_long: number }[]
      >()
      for (const t of (tpopsOfPopsR ?? []) as { pop_id: string }[]) {
        const list = tpopsByPopId.get(t.pop_id) ?? []
        list.push(t as never)
        tpopsByPopId.set(t.pop_id, list)
      }
      const mapPop = (p: {
        id: string
        wgs84_lat: number
        wgs84_long: number
      }) => ({
        id: p.id,
        wgs84Lat: p.wgs84_lat,
        wgs84Long: p.wgs84_long,
        tpopsByPopId: {
          nodes: (tpopsByPopId.get(p.id) ?? []).map((t) => ({
            id: t.id,
            wgs84Lat: t.wgs84_lat,
            wgs84Long: t.wgs84_long,
          })),
        },
      })
      const popsWithCoords = ((popsWithCoordsR ?? []) as never[]).map(mapPop)
      const allPops = ((allPopsR ?? []) as never[]).map(mapPop)
      const mapBeobs = (rows: unknown) =>
        (
          (rows ?? []) as {
            id: string
            wgs84_lat: number
            wgs84_long: number
          }[]
        ).map((b) => ({
          id: b.id,
          wgs84Lat: b.wgs84_lat,
          wgs84Long: b.wgs84_long,
        }))
      return {
        pop: variables.pop ? { nodes: popsWithCoords } : undefined,
        tpop: undefined,
        tpopByPop: variables.tpop ? { nodes: allPops } : undefined,
        beobNichtBeurteilt:
          variables.showBeobNichtBeurteilt ?
            { nodes: mapBeobs(beobNbR) }
          : undefined,
        beobNichtZuzuordnen:
          variables.showBeobNichtZuzuordnen ?
            { nodes: mapBeobs(beobNzR) }
          : undefined,
        beobZugeordnet:
          variables.showBeobZugeordnet ?
            { nodes: mapBeobs(beobZR) }
          : undefined,
        beobZugeordnetAssignPolylines:
          variables.showBeobZugeordnetAssignPolylines ?
            { nodes: mapBeobs(beobZR) }
          : undefined,
      } as unknown as ApfloraLayersQueryResult
    },
  })

  const assigningispossible =
    activeApfloraLayers.includes('tpop') &&
    ((activeApfloraLayers.includes('beobNichtBeurteilt') &&
      apfloraLayer.value === 'beobNichtBeurteilt') ||
      (activeApfloraLayers.includes('beobZugeordnet') &&
        apfloraLayer.value === 'beobZugeordnet'))

  const zuordnenTitle =
    assigningBeob ? 'Zuordnung beenden'
    : assigningispossible ? 'Teil-Populationen zuordnen'
    : 'Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)'

  // for each layer there must exist a path in data!
  let layerData = data?.[apfloraLayer.value]?.nodes ?? []
  if (apfloraLayer.value === 'tpop') {
    // but tpop is special...
    const tpops = data?.tpopByPop?.nodes ?? []
    layerData = tpops.map((n) => n?.tpopsByPopId?.nodes ?? []).flat()
  }
  const layerDataHighlighted = layerData.filter((o) => o.id === highlightedId)

  const onChangeCheckbox = () =>
    activeApfloraLayers.includes(apfloraLayer.value) ?
      setActiveApfloraLayers(
        activeApfloraLayers.filter((l) => l !== apfloraLayer.value),
      )
    : setActiveApfloraLayers([...activeApfloraLayers, apfloraLayer.value])

  const onClickZuordnen = () => {
    if (activeApfloraLayers.includes('tpop')) {
      setAssigningBeob(!assigningBeob)
    }
  }

  const onClickZoomToAll = () => {
    // console.log('zoomToAll')
    // only zoom if there is data to zoom on
    if (layerData.length === 0) return
    if (activeApfloraLayers.includes(apfloraLayer.value)) {
      const newBounds = getBounds(layerData)
      map.fitBounds(newBounds)
      setMapBounds(newBounds)
    }
  }

  const onClickZoomToActive = () => {
    // console.log('zoomToActive')
    if (activeApfloraLayers.includes(apfloraLayer.value)) {
      const highlightedObjects = layerData.filter((o) => o.id === highlightedId)
      const newBounds = getBounds(highlightedObjects)
      if (newBounds) {
        map.fitBounds(newBounds)
        setMapBounds(newBounds)
      }
    }
  }

  const zoomToAllIconStyle = {
    color:
      activeApfloraLayers.includes(apfloraLayer.value) && layerData.length > 0 ?
        'black'
      : '#e2e2e2',
    fontWeight:
      activeApfloraLayers.includes(apfloraLayer.value) && layerData.length > 0 ?
        'bold'
      : 'normal',
    cursor:
      activeApfloraLayers.includes(apfloraLayer.value) && layerData.length > 0 ?
        'pointer'
      : 'not-allowed',
  }

  const zoomToActiveIconStyle = {
    color:
      (
        activeApfloraLayers.includes(apfloraLayer.value) &&
        layerDataHighlighted.length > 0
      ) ?
        '#fbec04'
      : '#e2e2e2',
    fontWeight:
      (
        activeApfloraLayers.includes(apfloraLayer.value) &&
        layerDataHighlighted.length > 0
      ) ?
        'bold'
      : 'normal',
    cursor:
      (
        activeApfloraLayers.includes(apfloraLayer.value) &&
        layerDataHighlighted.length > 0
      ) ?
        'pointer'
      : 'not-allowed',
  }

  if (error) return <Error error={error} />

  return (
    <div className={styles.layer}>
      <Checkbox
        value={apfloraLayer.value}
        label={apfloraLayer.label}
        checked={activeApfloraLayers.includes(apfloraLayer.value)}
        onChange={onChangeCheckbox}
      />
      <div className={styles.icons}>
        {['beobNichtBeurteilt', 'beobZugeordnet'].includes(
          apfloraLayer.value,
        ) && (
          <div>
            <Button
              title={zuordnenTitle}
              onClick={onClickZuordnen}
              color="inherit"
              className={styles.iconButton}
            >
              {assigningBeob ?
                <MdPauseCircleOutline
                  style={{
                    cursor: assigningispossible ? 'pointer' : 'not-allowed',
                  }}
                  className={styles.icon}
                />
              : <MdPlayCircleOutline
                  style={{
                    color: assigningispossible ? 'black' : 'rgba(0,0,0,0.2)',
                    cursor: assigningispossible ? 'pointer' : 'not-allowed',
                  }}
                  className={styles.icon}
                />
              }
            </Button>
          </div>
        )}
        {apfloraLayer.value === 'pop' &&
          activeApfloraLayers.includes('pop') && <PopIcon />}
        {apfloraLayer.value === 'tpop' &&
          activeApfloraLayers.includes('tpop') && <TpopIcon />}
        {apfloraLayer.value === 'beobNichtBeurteilt' &&
          activeApfloraLayers.includes('beobNichtBeurteilt') && (
            <div>
              <MdLocalFlorist
                id="BeobNichtBeurteiltMapIcon"
                className={`${styles.mapIcon} ${styles.beobNichtBeurteiltMapIcon}`}
              />
            </div>
          )}
        {apfloraLayer.value === 'beobNichtZuzuordnen' &&
          activeApfloraLayers.includes('beobNichtZuzuordnen') && (
            <div>
              <MdLocalFlorist
                id="BeobNichtZuzuordnenMapIcon"
                className={`${styles.mapIcon} ${styles.beobNichtZuzuordnenMapIcon}`}
              />
            </div>
          )}
        {apfloraLayer.value === 'beobZugeordnet' &&
          activeApfloraLayers.includes('beobZugeordnet') && (
            <div>
              <MdLocalFlorist
                id="BeobZugeordnetMapIcon"
                className={`${styles.mapIcon} ${styles.beobZugeordnetMapIcon}`}
              />
            </div>
          )}
        {apfloraLayer.value === 'beobZugeordnetAssignPolylines' &&
          activeApfloraLayers.includes('beobZugeordnetAssignPolylines') && (
            <div>
              <MdRemove
                id="BeobZugeordnetAssignPolylinesMapIcon"
                className={`material-icons ${styles.beobZugeordnetAssignPolylinesIcon}`}
              >
                remove
              </MdRemove>
            </div>
          )}
        <div className={styles.zoomTo}>
          <Button
            title={`auf alle ${apfloraLayer.label} zoomen`}
            onClick={onClickZoomToAll}
            color="inherit"
            className={styles.iconButton}
          >
            <MdFilterCenterFocus
              style={zoomToAllIconStyle}
              className={styles.zoomToIcon}
            />
          </Button>
        </div>
        <div className={styles.zoomTo}>
          <Button
            title={`auf aktive ${apfloraLayer.label} zoomen`}
            onClick={onClickZoomToActive}
            color="inherit"
            className={styles.iconButton}
          >
            <MdFilterCenterFocus
              style={zoomToActiveIconStyle}
              className={styles.zoomToIcon}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
