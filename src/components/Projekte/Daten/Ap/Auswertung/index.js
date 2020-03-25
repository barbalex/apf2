import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import range from 'lodash/range'
import min from 'lodash/min'
import max from 'lodash/max'
import {
  BarChart,
  XAxis,
  YAxis,
  Label,
  Bar,
  ResponsiveContainer,
} from 'recharts'

import queryErfolg from './queryErfolg'

const erfValueFromCode = {
  3: 1, // nicht erfolgreich
  6: 2, // wenig erfolgreich
  5: 3, // mässig erfolgreich
  1: 4, // erfolgreich
  4: 5, // sehr erfolgreich
}
const labelFromValue = {
  0: 'n.b.',
  1: 'nicht',
  2: 'wenig',
  3: 'mässig',
  4: 'gut',
  5: 'sehr',
}
const findErfolg = ({ jahr, erfolgRawData }) =>
  erfolgRawData.find(e => e.jahr === jahr)
const makeErfolg = jahr => ({ jahr, value: 0 })
const getErfolg = ({ jahr, erfolgRawData }) =>
  findErfolg({ jahr, erfolgRawData }) || makeErfolg(jahr)
const addMissingErfolgData = erfolgRawData => {
  // 1. create list of all needed years
  const years = erfolgRawData.map(e => e.jahr)
  const allYears = range(min(years), max(years))
  return allYears.map(jahr => getErfolg({ jahr, erfolgRawData }))
}

const CustomTick = ({ payload, x, y, textAnchor, stroke, radius }) => {
  return (
    <g className="recharts-layer recharts-polar-angle-axis-tick">
      <text
        radius={radius}
        stroke={stroke}
        x={x}
        y={y}
        className="recharts-text recharts-polar-angle-axis-tick-value"
        textAnchor={textAnchor}
      >
        <tspan x={x} dy="0.3em">
          {labelFromValue[payload.value]}
        </tspan>
      </text>
    </g>
  )
}

const ApAuswertung = ({ treeName, id }) => {
  const {
    data: dataErfolg,
    error: errorErfolg,
    loading: loadingErfolg,
  } = useQuery(queryErfolg, {
    variables: { id },
  })

  const erfolgRawData = get(dataErfolg, 'allApbers.nodes', []).map(e => ({
    jahr: e.jahr,
    value: erfValueFromCode[e.beurteilung],
  }))

  const erfolgData = addMissingErfolgData(erfolgRawData)

  return (
    <ResponsiveContainer width="99%" height={400}>
      <BarChart
        width={600}
        height={300}
        data={erfolgData}
        margin={{ left: 25, top: 10 }}
      >
        <XAxis dataKey="jahr" />
        <YAxis
          dataKey="value"
          domain={[0, 5]}
          tick={<CustomTick />}
          interval={0}
          ticks={[0, 1, 2, 3, 4, 5]}
          offset={10}
        >
          <Label
            value="AP-Erfolg"
            angle={-90}
            position="insideLeft"
            offset={-15}
          />
        </YAxis>
        <Bar dataKey="value" fill="#2e7d32" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ApAuswertung
