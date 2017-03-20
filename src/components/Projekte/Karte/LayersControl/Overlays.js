import React, { PropTypes } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

import Checkbox from './shared/Checkbox'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
`
const DragHandleIcon = styled(FontIcon)`
  font-size: 18px !important;
  color: #7b7b7b !important;
  cursor: grab;
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
const IconsDiv = styled.div`
  display: flex;
`
/**
 * don't know why but passing store
 * with mobx inject does not work here
 * so passed in from parent
 */

const DragHandle = SortableHandle(() =>
  <DragHandleIcon
    className="material-icons"
    title="ziehen, um Layer höher/tiefer zu stapeln"
  >
    drag_handle
  </DragHandleIcon>
)
const SortableItem = SortableElement(({ overlay, store, activeOverlays }) =>
  <LayerDiv>
    <Checkbox
      value={overlay.value}
      label={overlay.label}
      checked={activeOverlays.includes(overlay.value)}
      onChange={() => {
        if (activeOverlays.includes(overlay.value)) {
          return store.map.removeActiveOverlay(overlay.value)
        }
        return store.map.addActiveOverlay(overlay.value)
      }}
    />
    <IconsDiv>
      <div>
        <DragHandle />
      </div>
    </IconsDiv>
  </LayerDiv>
)

const SortableList = SortableContainer(({ items, store, activeOverlays }) =>
  <div>
    {
      items.map((overlay, index) =>
        <SortableItem
          key={index}
          index={index}
          overlay={overlay}
          store={store}
          activeOverlays={activeOverlays}
        />
      )
    }
  </div>
)

const Overlays = ({ store }) =>
  <CardContent>
    <SortableList
      items={store.map.overlays}
      onSortEnd={({ oldIndex, newIndex }) =>
        store.map.moveOverlay({ oldIndex, newIndex })
      }
      useDragHandle
      lockAxis="y"
      store={store}
      activeOverlays={toJS(store.map.activeOverlays)}
    />
  </CardContent>

Overlays.propTypes = {
  store: PropTypes.object.isRequired,
}

export default observer(Overlays)
