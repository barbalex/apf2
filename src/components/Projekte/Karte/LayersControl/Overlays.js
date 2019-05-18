import React, { useContext, useCallback } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import DragHandleIcon from "@material-ui/icons/DragHandle"
import InfoOutlineIcon from "@material-ui/icons/InfoOutlined"
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from "react-sortable-hoc"
import { observer } from "mobx-react-lite"
import { getSnapshot } from "mobx-state-tree"

import Checkbox from "./shared/Checkbox"
import storeContext from "../../../../storeContext"

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
  ZhSvoColor:
    "http://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen&format=image/png&STYLE=default",
  ZhPflegeplan:
    "http://wms.zh.ch/FnsPflegeZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=pfpl&format=image/png&STYLE=default",
}
const DragHandle = SortableHandle(() => (
  <StyledIconButton title="ziehen, um Layer höher/tiefer zu stapeln">
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
        onChange={() => {
          if (activeOverlays.includes(overlay.value)) {
            return setActiveOverlays(
              activeOverlays.filter(o => o !== overlay.value)
            )
          }
          return setActiveOverlays([...activeOverlays, overlay.value])
        }}
      />
      <IconsDivs>
        {!!layerLegends[overlay.value] && (
          <IconsDiv>
            <div>
              <StyledIconButton
                title="Legende öffnen"
                onClick={() => {
                  typeof window !== "undefined" &&
                    window.open(layerLegends[overlay.value])
                }}
              >
                <StyledLegendIcon />
              </StyledIconButton>
            </div>
          </IconsDiv>
        )}
        <IconsDiv>
          <div>
            <DragHandle />
          </div>
        </IconsDiv>
      </IconsDivs>
    </LayerDiv>
  )
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
  )
)

const Overlays = () => {
  const {
    overlays,
    setOverlays,
    activeOverlays,
    setActiveOverlays,
  } = useContext(storeContext)

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) =>
      setOverlays(arrayMove(overlays, oldIndex, newIndex)),
    [overlays]
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
