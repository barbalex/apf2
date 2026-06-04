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
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useMap } from 'react-leaflet'
import { useParams } from 'react-router'

import { Checkbox } from '../../shared/Checkbox.tsx'
import { Error } from '../../../../../shared/Error.tsx'
import { getBounds } from '../../../../../../modules/getBounds.ts'
import {
  assigningBeobAtom,
  setAssigningBeobAtom,
  setMapBoundsAtom,
  mapActiveApfloraLayersAtom,
  setMapActiveApfloraLayersAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../../store/index.ts'
import { query } from './query.ts'
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

import styles from './index.module.css'

export const Layer = ({ apfloraLayer }) => {
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

  const apolloClient = useApolloClient()
  const { data, error } = useQuery({
    queryKey: ['apfloraLayer', layer, variables],
    queryFn: async () => {
      const result = await apolloClient.query<ApfloraLayersQueryResult>({
        query,
        variables,
      })
      if (result.error) throw result.error
      return result.data
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
