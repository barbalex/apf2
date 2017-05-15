import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import Radio from './shared/Radio'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
`
const LayerDiv = styled.div`
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  padding-bottom: 4px;
`
/**
 * don't know why but passing store
 * with mobx inject does not work here
 * so passed in from parent
 */

const LayersControl = ({ store }: { store: Object }) => {
  const baseLayers = [
    { label: 'OpenStreetMap farbig', value: 'OsmColor' },
    { label: 'OpenStreetMap grau', value: 'OsmBw' },
    { label: 'Swisstopo farbig', value: 'SwissTopoPixelFarbe' },
    { label: 'Swisstopo grau', value: 'SwissTopoPixelGrau' },
    { label: 'ZH Übersichtsplan', value: 'ZhUep' },
    { label: 'Bing Luftbild', value: 'BingAerial' },
    { label: 'ZH Orthofoto Sommer RGB', value: 'ZhOrtho' },
    { label: 'ZH Orthofoto Sommer infrarot', value: 'ZhOrthoIr' },
    { label: 'ZH Orthofoto Frühjahr 2015/16 RGB', value: 'ZhOrtho2015' },
    { label: 'ZH Orthofoto Frühjahr 2015/16 infrarot', value: 'ZhOrtho2015Ir' },
  ]

  return (
    <CardContent>
      {baseLayers.map((l, index) => (
        <LayerDiv key={index}>
          <Radio
            name="baseLayers"
            value={l.value}
            label={l.label}
            checked={store.map.activeBaseLayer === l.value}
            onChange={() => store.map.setActiveBaseLayer(l.value)}
          />
        </LayerDiv>
      ))}
    </CardContent>
  )
}

export default observer(LayersControl)
