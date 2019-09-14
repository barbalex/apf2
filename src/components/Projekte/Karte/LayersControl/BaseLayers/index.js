import React from 'react'
import styled from 'styled-components'

import BaseLayer from './BaseLayer'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
`
export const baseLayers = [
  { label: 'OpenStreetMap farbig', value: 'OsmColor', cors: true },
  { label: 'OpenStreetMap grau', value: 'OsmBw', cors: true },
  { label: 'Swisstopo farbig', value: 'SwissTopoPixelFarbe', cors: false },
  { label: 'Swisstopo grau', value: 'SwissTopoPixelGrau', cors: false },
  {
    label: 'Swisstopo Siegfriedkarte (1870-1926)',
    value: 'SwisstopoSiegfried',
    cors: false,
  },
  {
    label: 'Swisstopo Dufourkarte (1844-1864)',
    value: 'SwisstopoDufour',
    cors: false,
  },
  // https://wms.zh.ch/upwms?SERVICE=WMS&Request=GetCapabilities
  { label: 'ZH Übersichtsplan', value: 'ZhUep', cors: true },
  // { label: 'Bing Luftbild', value: 'BingAerial' },
  // https://wms.zh.ch/OrthoZHWMS?SERVICE=WMS&Request=GetCapabilities
  {
    label: 'ZH Orthofoto Sommer 2018 RGB',
    value: 'ZhOrtho2018Rgb',
    cors: true,
  },
  {
    label: 'ZH Orthofoto Sommer 2018 infrarot',
    value: 'ZhOrtho2018Ir',
    cors: true,
  },
  {
    label: 'ZH Orthofoto Frühjahr 2015/16 RGB',
    value: 'ZhOrtho2015Rgb',
    cors: true,
  },
  {
    label: 'ZH Orthofoto Frühjahr 2015/16 infrarot',
    value: 'ZhOrtho2015Ir',
    cors: true,
  },
  {
    label: 'ZH Orthofoto Sommer 2014/15 RGB',
    value: 'ZhOrtho2014Rgb',
    cors: true,
  },
  {
    label: 'ZH Orthofoto Sommer 2014/15 infrarot',
    value: 'ZhOrtho2014Ir',
    cors: true,
  },
]

const BaseLayers = () => (
  <CardContent>
    {baseLayers.map((layer, index) => (
      <BaseLayer key={index} layer={layer} />
    ))}
  </CardContent>
)

export default BaseLayers
