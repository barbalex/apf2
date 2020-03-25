import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import range from 'lodash/range'
import min from 'lodash/min'
import max from 'lodash/max'
import {
  LineChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { ImpulseSpinner as Spinner } from 'react-spinners-kit'
import styled from 'styled-components'

import queryErfolg from './queryErfolg'
import queryPopStatus from './queryPopStatus'
import CustomTooltip from './CustomTooltip'

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
const Title = styled.h4`
  width: 100%;
  text-align: center;
  margin-bottom: 0;
  margin-top: 15px;
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
const color = {
  'ursprünglich, aktuell': '#2e7d32',
  'ursprünglich, erloschen': 'rgba(46,125,50,0.5)',
  'angesiedelt, aktuell': 'rgba(245,141,66,1)',
  Ansaatversuch: 'brown',
  'angesiedelt, erloschen/nicht etabliert': 'rgba(245,141,66,0.5)',
  'potentieller Wuchs-/Ansiedlungsort': 'grey',
}
const findErfolg = ({ jahr, erfolgRawData }) =>
  erfolgRawData.find(e => e.jahr === jahr)
const makeErfolg = jahr => ({ jahr, value: 0 })
const getErfolg = ({ jahr, erfolgRawData }) =>
  findErfolg({ jahr, erfolgRawData }) || makeErfolg(jahr)
const addMissingErfolgData = erfolgRawData => {
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
        <>
          <Title>AP-Erfolg</Title>
          <ResponsiveContainer width="99%" height={400}>
            <LineChart
              width={600}
              height={300}
              data={erfolgData}
              margin={{ top: 10 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis
                dataKey="value"
                domain={[0, 5]}
                tick={<CustomTick />}
                interval={0}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Line
                type="monotone"
                dataKey="value"
                fill="#2e7d32"
                stroke="#2e7d32"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
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
        <>
          <Title>Stati von Populationen</Title>
          <ResponsiveContainer width="99%" height={400}>
            <AreaChart
              width={600}
              height={300}
              data={popStatusData}
              margin={{ top: 10 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis interval={0} />
              <Area
                type="monotone"
                dataKey="ursprünglich, aktuell"
                stackId="1"
                stroke={color['ursprünglich, aktuell']}
                fill={color['ursprünglich, aktuell']}
              />
              <Area
                type="monotone"
                dataKey="ursprünglich, erloschen"
                stackId="1"
                stroke={color['ursprünglich, erloschen']}
                fill={color['ursprünglich, erloschen']}
              />
              <Area
                type="monotone"
                dataKey="angesiedelt, aktuell"
                stackId="1"
                stroke={color['angesiedelt, aktuell']}
                fill={color['angesiedelt, aktuell']}
              />
              <Area
                type="monotone"
                dataKey="Ansaatversuch"
                stackId="1"
                stroke={color['Ansaatversuch']}
                fill={color['Ansaatversuch']}
              />
              <Area
                type="monotone"
                dataKey="angesiedelt, erloschen/nicht etabliert"
                stackId="1"
                stroke={color['angesiedelt, erloschen/nicht etabliert']}
                fill={color['angesiedelt, erloschen/nicht etabliert']}
              />
              <Area
                type="monotone"
                dataKey="potentieller Wuchs-/Ansiedlungsort"
                stackId="1"
                stroke={color['potentieller Wuchs-/Ansiedlungsort']}
                fill={color['potentieller Wuchs-/Ansiedlungsort']}
              />
              <Tooltip content={<CustomTooltip color={color} />} />
              <Legend
                layout="horizontal"
                align="center"
                iconSize={20}
                wrapperStyle={{ bottom: 0, fontSize: 12 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <NoDataContainer>
          Sorry, es gibt keine Daten zu den Populations-Stati
        </NoDataContainer>
      )}
    </>
  )
}

export default ApAuswertung
