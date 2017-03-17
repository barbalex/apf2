import React, { PropTypes } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'

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

const Overlays = ({ store }) => {
  const activeOverlays = toJS(store.map.activeOverlays)

  return (
    <CardContent>
      {
        store.map.overlays.map((o, index) =>
          <LayerDiv key={index}>
            <Label>
              <Input
                type="checkbox"
                value={o.value}
                checked={activeOverlays.includes(o.value)}
                onChange={() => {
                  if (activeOverlays.includes(o.value)) {
                    return store.map.removeActiveOverlay(o.value)
                  }
                  return store.map.addActiveOverlay(o.value)
                }}
              />
              {o.label}
            </Label>
            <div>
              <DragHandle className="material-icons">
                drag_handle
              </DragHandle>
            </div>
          </LayerDiv>
        )
      }
    </CardContent>
  )
}

Overlays.propTypes = {
  store: PropTypes.object.isRequired,
}

export default observer(Overlays)
