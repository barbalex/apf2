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
  { label: 'ZH Orthofoto Sommer 2018 RGB', value: 'ZhOrtho2018Rgb' },
  { label: 'ZH Orthofoto Sommer 2018 infrarot', value: 'ZhOrtho2018Ir' },
  { label: 'ZH Orthofoto Frühjahr 2015/16 RGB', value: 'ZhOrtho2015Rgb' },
  { label: 'ZH Orthofoto Frühjahr 2015/16 infrarot', value: 'ZhOrtho2015Ir' },
  { label: 'ZH Orthofoto Sommer 2014/15 RGB', value: 'ZhOrtho2014Rgb' },
  { label: 'ZH Orthofoto Sommer 2014/15 infrarot', value: 'ZhOrtho2014Ir' },
]

const BaseLayers = () => (
  <CardContent>
    {baseLayers.map((layer, index) => (
      <BaseLayer key={index} layer={layer} />
    ))}
  </CardContent>
)

export default BaseLayers
