import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import Checkbox from '../shared/Checkbox'
import storeContext from '../../../../../storeContext'

const LayerDiv = styled.div`
  display: flex;
  min-height: 24px;
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

const ShowForMultipleAps = () => {
  const { apId } = useParams()

  const store = useContext(storeContext)
  const { showApfLayersForMultipleAps, toggleShowApfLayersForMultipleAps } =
    store

  return (
    <LayerDiv>
      <Checkbox
        value={showApfLayersForMultipleAps}
        label="Layer auch anzeigen, wenn mehr als eine Art aktiv ist"
        checked={showApfLayersForMultipleAps}
        onChange={toggleShowApfLayersForMultipleAps}
      />
    </LayerDiv>
  )
}

export default observer(ShowForMultipleAps)
