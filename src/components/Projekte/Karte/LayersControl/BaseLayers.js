import React from 'react'
import styled from 'styled-components'

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
const baseLayers = [
  { label: 'OpenStreetMap farbig', value: 'OsmColor' },
  { label: 'OpenStreetMap grau', value: 'OsmBw' },
  { label: 'Swisstopo farbig', value: 'SwissTopoPixelFarbe' },
  { label: 'Swisstopo grau', value: 'SwissTopoPixelGrau' },
  {
    label: 'Swisstopo Siegfriedkarte (1870-1926)',
    value: 'SwisstopoSiegfried',
  },
  {
    label: 'Swisstopo Dufourkarte (1844-1864)',
    value: 'SwisstopoDufour',
  },
  { label: 'ZH Übersichtsplan', value: 'ZhUep' },
  // { label: 'Bing Luftbild', value: 'BingAerial' },
  { label: 'ZH Orthofoto Sommer RGB', value: 'ZhOrtho' },
  { label: 'ZH Orthofoto Sommer infrarot', value: 'ZhOrthoIr' },
  { label: 'ZH Orthofoto Frühjahr 2015/16 RGB', value: 'ZhOrtho2015' },
  { label: 'ZH Orthofoto Frühjahr 2015/16 infrarot', value: 'ZhOrtho2015Ir' },
]

const BaseLayers = ({
  activeBaseLayer,
  setActiveBaseLayer,
}: {
  activeBaseLayer: String,
  setActiveBaseLayer: () => void,
}) => (
  <CardContent>
    {baseLayers.map((l, index) => (
      <LayerDiv
        key={index}
        onClick={event => {
          if (l.value === activeBaseLayer) {
            setActiveBaseLayer(null)
            // prevent click bubbling to Radio
            // then triggering change...
            event.preventDefault()
          }
        }}
      >
        <Radio
          name="baseLayers"
          value={l.value}
          label={l.label}
          checked={activeBaseLayer === l.value}
          onChange={() => setActiveBaseLayer(l.value)}
        />
      </LayerDiv>
    ))}
  </CardContent>
)

export default BaseLayers
