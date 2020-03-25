import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import range from 'lodash/range'
import min from 'lodash/min'
import max from 'lodash/max'
import {
  BarChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Label,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { ImpulseSpinner as Spinner } from 'react-spinners-kit'
import styled from 'styled-components'

import queryErfolg from './queryErfolg'
import queryPopStatus from './queryPopStatus'

const SpinnerContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const SpinnerText = styled.div`
  padding: 10px;
`
const NoDataContainer = styled.div`
  margin: 10px;
`

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

  const {
    data: dataPopStatus,
    error: errorPopStatus,
    loading: loadingPopStatus,
  } = useQuery(queryPopStatus, {
    variables: { id },
  })
  const popStati = get(dataPopStatus, 'allPopStatusWertes.nodes') || []
  const popStatusRawData =
    get(dataPopStatus, 'allVApAuswPopStatuses.nodes') || []
  const popStatusData = popStatusRawData.map(e => {
    const val = JSON.parse(e.values)

    return {
      jahr: e.jahr,
      'ursprünglich, aktuell': val[100] || 0,
      'ursprünglich, erloschen': val[101] || 0,
      'angesiedelt, aktuell': val[200] || 0,
      Ansaatversuch: val[201] || 0,
      'angesiedelt, erloschen/nicht etabliert': val[202] || 0,
      'potentieller Wuchs-/Ansiedlungsort': val[300] || 0,
    }
  })
  console.log('ApAuswertung', {
    popStati,
    popStatusData,
  })

  if (errorErfolg) {
    return `Fehler beim Laden der Daten: ${errorErfolg.message}`
  }
  if (errorPopStatus) {
    return `Fehler beim Laden der Daten: ${errorPopStatus.message}`
  }

  return (
    <>
      {loadingErfolg ? (
        <SpinnerContainer>
          <Spinner
            size={50}
            frontColor="#2e7d32"
            backColor="#4a148c1a"
            loading={true}
          />
          <SpinnerText>lade AP-Erfolg...</SpinnerText>
        </SpinnerContainer>
      ) : erfolgRawData.length ? (
        <ResponsiveContainer width="99%" height={400}>
          <BarChart
            width={600}
            height={300}
            data={erfolgData}
            margin={{ left: 27, top: 10 }}
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
      ) : (
        <NoDataContainer>
          Sorry, es gibt keine Daten zum AP-Erfolg
        </NoDataContainer>
      )}
      {loadingPopStatus ? (
        <SpinnerContainer>
          <Spinner
            size={50}
            frontColor="#2e7d32"
            backColor="#4a148c1a"
            loading={true}
          />
          <SpinnerText>lade Populations-Stati...</SpinnerText>
        </SpinnerContainer>
      ) : popStatusRawData.length ? (
        <ResponsiveContainer width="99%" height={400}>
          <AreaChart
            width={600}
            height={300}
            data={popStatusData}
            margin={{ left: 27, top: 10 }}
          >
            <XAxis dataKey="jahr" />
            <YAxis interval={0} offset={10}>
              <Label
                value=" Stati von Populationen"
                angle={-90}
                position="insideBottomLeft"
                //offset={-15}
              />
            </YAxis>
            <Area
              type="monotone"
              dataKey="ursprünglich, aktuell"
              stackId="1"
              stroke="#2e7d32"
              fill="#2e7d32"
            />
            <Area
              type="monotone"
              dataKey="ursprünglich, erloschen"
              stackId="1"
              stroke="rgba(46,125,50,0.5)"
              fill="rgba(46,125,50,0.5)"
            />
            <Area
              type="monotone"
              dataKey="angesiedelt, aktuell"
              stackId="1"
              stroke="rgba(245,141,66,1)"
              fill="rgba(245,141,66,1)"
            />
            <Area
              type="monotone"
              dataKey="Ansaatversuch"
              stackId="1"
              stroke="brown"
              fill="brown"
            />
            <Area
              type="monotone"
              dataKey="angesiedelt, erloschen/nicht etabliert"
              stackId="1"
              stroke="rgba(245,141,66,0.5)"
              fill="rgba(245,141,66,0.5)"
            />
            <Area
              type="monotone"
              dataKey="potentieller Wuchs-/Ansiedlungsort"
              stackId="1"
              stroke="grey"
              fill="grey"
            />
            <Tooltip itemStyle={{ padding: 0, margin: 0, fontSize: '0.9em' }} />
            <Legend
              layout="horizontal"
              align="center"
              wrapperStyle={{ bottom: 0, fontSize: 12 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <NoDataContainer>
          Sorry, es gibt keine Daten zu den Populations-Stati
        </NoDataContainer>
      )}
    </>
  )
}

export default ApAuswertung
