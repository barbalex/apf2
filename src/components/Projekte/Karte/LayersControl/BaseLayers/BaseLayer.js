import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import Radio from '../shared/Radio'
import storeContext from '../../../../../storeContext'

const LayerDiv = styled.div`
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  padding-bottom: 4px;
`

const BaseLayer = ({ layer }: { layer: Object }) => {
  const store = useContext(storeContext)
  const { activeBaseLayer, setActiveBaseLayer } = store
  const onChange = useCallback(() => setActiveBaseLayer(layer.value), [layer])

  return (
    <LayerDiv
      onClick={event => {
        if (layer.value === activeBaseLayer) {
          setActiveBaseLayer(null)
          // prevent click bubbling to Radio
          // then triggering change...
          event.preventDefault()
        }
      }}
    >
      <Radio
        name="baseLayers"
        value={layer.value}
        label={layer.label}
        checked={activeBaseLayer === layer.value}
        onChange={onChange}
      />
    </LayerDiv>
  )
}

export default observer(BaseLayer)
