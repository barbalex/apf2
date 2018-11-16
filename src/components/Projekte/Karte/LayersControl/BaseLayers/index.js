import React from 'react'
import styled from 'styled-components'

import BaseLayer from './BaseLayer'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
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

const BaseLayers = () => (
  <CardContent>
    {baseLayers.map((layer, index) => (
      <BaseLayer key={index} layer={layer} />
    ))}
  </CardContent>
)

export default BaseLayers
