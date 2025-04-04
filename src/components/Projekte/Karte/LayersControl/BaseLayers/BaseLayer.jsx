import { memo, useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Radio } from '../shared/Radio.jsx'
import { MobxContext } from '../../../../../mobxContext.js'

const LayerDiv = styled.div`
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  padding-bottom: 4px;
`

export const BaseLayer = memo(
  observer(({ layer }) => {
    const store = useContext(MobxContext)
    const { activeBaseLayer, setActiveBaseLayer } = store
    const onChange = useCallback(
      () => setActiveBaseLayer(layer.value),
      [layer.value, setActiveBaseLayer],
    )

    return (
      <LayerDiv
        onClick={(event) => {
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
  }),
)
