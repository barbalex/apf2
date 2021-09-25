import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import {
  MdDragHandle as DragHandleIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import Checkbox from './shared/Checkbox'
import storeContext from '../../../../storeContext'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
`
const StyledIconButton = styled(Button)`
  max-width: 18px;
  min-height: 20px !important;
  min-width: 20px !important;
  padding: 0 !important;
  margin-top: -3px !important;
`
const StyledDragHandleIcon = styled(DragHandleIcon)`
  height: 20px !important;
  color: #7b7b7b !important;
  cursor: grab;
`
const StyledLegendIcon = styled(InfoOutlineIcon)`
  height: 20px !important;
  color: #7b7b7b !important;
  cursor: pointer;
`
const LayerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  &:not(:last-of-type) {
    border-bottom: 1px solid #ececec;
  }
  /*
   * z-index is needed because leaflet
   * sets high one for controls
   */
  z-index: 2000;
  /*
   * font-size is lost while moving a layer
   * because it is inherited from higher up
   */
  font-size: 12px;
`
const IconsDivs = styled.div`
  display: flex;
`
const IconsDiv = styled.div`
  display: flex;
`
// TODO: add icon: https://material.io/icons/#ic_info
// for layers with legend
const layerLegends = {
  ZhSvoGrey: [
    {
      name: 'Zonen Schutzverordnungen (Raster)',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen-raster&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagernde Schutzzonen',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagernde-schutzzonen&format=image/png&STYLE=default',
    },
  ],
  ZhLrVegKartierungen: [
    {
      name: 'Übersicht',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=uebersicht&format=image/png&STYLE=default',
    },
    {
      name: 'Trockenstandorte 2003 TWW nat. Bedeutung BAFU',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken03&format=image/png&STYLE=default',
    },
    {
      name: 'Trockenstandorte 1991 ZH-Oberland Dickenmann',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken91&format=image/png&STYLE=default',
    },
    {
      name: 'Trockenstandorte 1989 ZH-Oberland BGU/AquaTerra',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken89&format=image/png&STYLE=default',
    },
    {
      name: 'Hoch- und Übergangsmoore nat. Bedeutung BAFU',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=moore&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2010 Maedlesten FORNAT',
      url: 'https://www.w3.org/1999/xlink xlink:type="simple" xlink:href="https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-10&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2008 Werrikerriet',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-08&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2008 Glattaltläufe',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht08-glatt&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2007-10 Pfäffikersee topos',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-07-10&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2006 Neeracherried topos',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-06&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2001 Drumlinlandschaft',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-01&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1991',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-91&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1986',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-86&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1976/77',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-76-77&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1964 Neeracherried Klötzli',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-64&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1961 Flughafen Klötzli',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-61&format=image/png&STYLE=default',
    },
    {
      name: 'Auenvegetation 1993 nat. Objekte BAFU',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=auen-93&format=image/png&STYLE=default',
    },
  ],
  ZhLichteWaelder: [
    {
      name: 'Objekte',
      url: 'https://wms.zh.ch/FnsLWZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=objekte-lichte-waelder-kanton-zuerich&format=image/png&STYLE=default',
    },
  ],
  ZhWaelderVegetation: [
    {
      name: 'Waldgesellschaften',
      url: 'https://wms.zh.ch/FnsLWZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=waldgesellschaften&format=image/png&STYLE=default',
    },
  ],
  ZhSvoColor: [
    {
      name: 'Zonen Schutzverordnungen',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagernde Schutzzonen',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagernde-schutzzonen&format=image/png&STYLE=default',
    },
  ],
  ZhPflegeplan: [
    {
      name: 'Pflegeplan',
      url: 'https://wms.zh.ch/FnsPflegeZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=pfpl-aktuell&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagerung 1',
      url: 'https://wms.zh.ch/FnsPflegeZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagerung1-aktuell&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagerung 2',
      url: 'https://wms.zh.ch/FnsPflegeZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagerung2-aktuell&format=image/png&STYLE=default',
    },
  ],
}
const DragHandle = SortableHandle(() => (
  <StyledIconButton
    title="ziehen, um Layer höher/tiefer zu stapeln"
    color="inherit"
  >
    <StyledDragHandleIcon />
  </StyledIconButton>
))

const SortableItem = SortableElement(
  ({ overlay, activeOverlays, setActiveOverlays }) => (
    <LayerDiv>
      <Checkbox
        value={overlay.value}
        label={overlay.label}
        checked={activeOverlays.includes(overlay.value)}
        onChange={async () => {
          if (activeOverlays.includes(overlay.value)) {
            return setActiveOverlays(
              activeOverlays.filter((o) => o !== overlay.value),
            )
          }
          return setActiveOverlays([...activeOverlays, overlay.value])
        }}
      />
      <IconsDivs>
        {(layerLegends[overlay.value] || [])
          .filter((layer) => !!layer.url)
          .map((layer) => (
            <IconsDiv key={layer.name}>
              <div>
                <StyledIconButton
                  color="inherit"
                  title={`Legende für ${layer.name} öffnen`}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(layer.url, '_blank')
                    }
                  }}
                >
                  <StyledLegendIcon />
                </StyledIconButton>
              </div>
            </IconsDiv>
          ))}
        <IconsDiv>
          <div>
            <DragHandle />
          </div>
        </IconsDiv>
      </IconsDivs>
    </LayerDiv>
  ),
)

const SortableList = SortableContainer(
  ({ items, activeOverlays, setActiveOverlays }) => (
    <div>
      {items.map((overlay, index) => (
        <SortableItem
          key={index}
          index={index}
          overlay={overlay}
          activeOverlays={activeOverlays}
          setActiveOverlays={setActiveOverlays}
        />
      ))}
    </div>
  ),
)

const Overlays = () => {
  const { overlays, setOverlays, activeOverlays, setActiveOverlays } =
    useContext(storeContext)

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) =>
      setOverlays(arrayMove(overlays, oldIndex, newIndex)),
    [overlays, setOverlays],
  )

  return (
    <CardContent>
      <SortableList
        items={overlays}
        onSortEnd={onSortEnd}
        useDragHandle
        lockAxis="y"
        activeOverlays={getSnapshot(activeOverlays)}
        setActiveOverlays={setActiveOverlays}
      />
    </CardContent>
  )
}

export default observer(Overlays)
