import React, { PropTypes } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
`
const DragHandle = styled(FontIcon)`
  font-size: 18px !important;
  color: #7b7b7b !important;
  cursor: grab;
`
const LayerDiv = styled.div`
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
`
const Input = styled.input`
  margin-right: 4px;
  /*vertical-align: -2px;*/
`
const Label = styled.label`
  padding-right: 4px;
  user-select: none;
`
/**
 * don't know why but passing store
 * with mobx inject does not work here
 * so passed in from parent
 */


 const enhance = compose(
   // make bounds state, need to manage them manually
   withState(`bounds`, `changeBounds`, ktZhBounds),
   observer
 )

const Overlays = ({ store }) => {
  const activeOverlays = toJS(store.map.activeOverlays)
  const SortableItem = SortableElement(({ overlay }) =>
    <LayerDiv>
      <Label>
        <Input
          type="checkbox"
          value={overlay.value}
          checked={activeOverlays.includes(overlay.value)}
          onChange={() => {
            if (activeOverlays.includes(overlay.value)) {
              return store.map.removeActiveOverlay(overlay.value)
            }
            return store.map.addActiveOverlay(overlay.value)
          }}
        />
        {overlay.label}
      </Label>
      <div>
        <DragHandle className="material-icons">
          drag_handle
        </DragHandle>
      </div>
    </LayerDiv>
  )
  const overlays = store.map.overlays
  const SortableList = SortableContainer(({ overlays }) =>
    <div>
      {
        overlays.map((overlay, index) =>
          <SortableItem key={index} index={index} overlay={overlay} />
        )
      }
    </div>
  )

  return (
    <CardContent>
      {
        store.map.overlays.map((overlay, index) =>
          <SortableItem key={index} index={index} overlay={overlay} />
        )
      }
    </CardContent>
  )
}

Overlays.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Overlays)
