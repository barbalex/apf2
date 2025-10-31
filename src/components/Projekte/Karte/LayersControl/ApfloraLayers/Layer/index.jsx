// TODO: let each item call it's data itself

import { useContext } from 'react'
import Button from '@mui/material/Button'
import {
  MdPauseCircleOutline,
  MdPlayCircleOutline,
  MdLocalFlorist,
  MdFilterCenterFocus,
  MdRemove,
} from 'react-icons/md'
import { getSnapshot } from 'mobx-state-tree'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'
import { useMap } from 'react-leaflet'
import { useParams } from 'react-router'

import { Checkbox } from '../../shared/Checkbox.jsx'
import { Error } from '../../../../../shared/Error.jsx'
import { getBounds } from '../../../../../../modules/getBounds.js'
import { MobxContext } from '../../../../../../mobxContext.js'
import { query } from './query.js'
import { PopIcon } from './PopIcon.jsx'
import { TpopIcon } from './TpopIcon.jsx'

import {
  icon,
  iconButton,
  zoomToIcon,
  layer as layerClass,
  icons,
  zoomTo,
  mapIcon,
  beobNichtBeurteiltMapIcon,
  beobNichtZuzuordnenMapIcon,
  beobZugeordnetMapIcon,
  beobZugeordnetAssignPolylinesIcon,
} from './index.module.css'

export const Layer = observer(({ apfloraLayer }) => {
  const { apId, popId, tpopId, beobId } = useParams()

  const map = useMap()
  const store = useContext(MobxContext)
  const {
    activeApfloraLayers: activeApfloraLayersRaw,
    setActiveApfloraLayers,
    assigningBeob,
    setAssigningBeob,
    setBounds,
  } = store
  const tree = store.tree
  const { beobGqlFilter } = tree
  const activeApfloraLayers = getSnapshot(activeApfloraLayersRaw)

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
    beobNichtBeurteiltFilter: beobGqlFilter('nichtBeurteilt').filtered,
    showBeobNichtZuzuordnen,
    beobNichtZuzuordnenFilter: beobGqlFilter('nichtZuordnen').filtered,
    showBeobZugeordnet,
    beobZugeordnetFilter: beobGqlFilter('zugeordnet').filtered,
    showBeobZugeordnetAssignPolylines,
  }

  const { data, error } = useQuery(query, {
    variables,
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
      setBounds(newBounds)
    }
  }

  const onClickZoomToActive = () => {
    // console.log('zoomToActive')
    if (activeApfloraLayers.includes(apfloraLayer.value)) {
      const highlightedObjects = layerData.filter((o) => o.id === highlightedId)
      const newBounds = getBounds(highlightedObjects)
      if (newBounds) {
        map.fitBounds(newBounds)
        setBounds(newBounds)
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
    <div className={layerClass}>
      <Checkbox
        value={apfloraLayer.value}
        label={apfloraLayer.label}
        checked={activeApfloraLayers.includes(apfloraLayer.value)}
        onChange={onChangeCheckbox}
      />
      <div className={icons}>
        {['beobNichtBeurteilt', 'beobZugeordnet'].includes(
          apfloraLayer.value,
        ) && (
          <div>
            <Button
              title={zuordnenTitle}
              onClick={onClickZuordnen}
              color="inherit"
              className={iconButton}
            >
              {assigningBeob ?
                <MdPauseCircleOutline
                  style={{
                    cursor: assigningispossible ? 'pointer' : 'not-allowed',
                  }}
                  className={icon}
                />
              : <MdPlayCircleOutline
                  style={{
                    color:
                      assigningispossible ? 'black' : (
                        'rgba(0,0,0,0.2) !important'
                      ),
                    cursor: assigningispossible ? 'pointer' : 'not-allowed',
                  }}
                  className={icon}
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
                className={`${mapIcon} ${beobNichtBeurteiltMapIcon}`}
              />
            </div>
          )}
        {apfloraLayer.value === 'beobNichtZuzuordnen' &&
          activeApfloraLayers.includes('beobNichtZuzuordnen') && (
            <div>
              <MdLocalFlorist
                id="BeobNichtZuzuordnenMapIcon"
                className={`${mapIcon} ${beobNichtZuzuordnenMapIcon}`}
              />
            </div>
          )}
        {apfloraLayer.value === 'beobZugeordnet' &&
          activeApfloraLayers.includes('beobZugeordnet') && (
            <div>
              <MdLocalFlorist
                id="BeobZugeordnetMapIcon"
                className={`${mapIcon} ${beobZugeordnetMapIcon}`}
              />
            </div>
          )}
        {apfloraLayer.value === 'beobZugeordnetAssignPolylines' &&
          activeApfloraLayers.includes('beobZugeordnetAssignPolylines') && (
            <div>
              <MdRemove
                id="BeobZugeordnetAssignPolylinesMapIcon"
                className={`material-icons ${beobZugeordnetAssignPolylinesIcon}`}
              >
                remove
              </MdRemove>
            </div>
          )}
        <div className={zoomTo}>
          <Button
            title={`auf alle ${apfloraLayer.label} zoomen`}
            onClick={onClickZoomToAll}
            color="inherit"
            className={iconButton}
          >
            <MdFilterCenterFocus
              style={zoomToAllIconStyle}
              className={zoomToIcon}
            />
          </Button>
        </div>
        <div className={zoomTo}>
          <Button
            title={`auf aktive ${apfloraLayer.label} zoomen`}
            onClick={onClickZoomToActive}
            color="inherit"
            className={iconButton}
          >
            <MdFilterCenterFocus
              style={zoomToActiveIconStyle}
              className={zoomToIcon}
            />
          </Button>
        </div>
      </div>
    </div>
  )
})
