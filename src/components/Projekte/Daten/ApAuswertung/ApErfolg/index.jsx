import { memo } from 'react'
import { useQuery } from '@apollo/client/react'
import range from 'lodash/range'
import min from 'lodash/min'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import CircularProgress from '@mui/material/CircularProgress'
import styled from '@emotion/styled'
import { useParams } from 'react-router'

import { query } from './query.js'
import { CustomTick } from './CustomTick.jsx'
import { Error } from '../../../../shared/Error.jsx'

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
  margin: 20px;
  margin-bottom: 40px;
  text-align: center;
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
const findErfolg = ({ jahr, erfolgRawData }) =>
  erfolgRawData.find((e) => e.jahr === jahr)
const makeErfolg = (jahr) => ({ jahr, value: null })
const getErfolg = ({ jahr, erfolgRawData }) =>
  findErfolg({ jahr, erfolgRawData }) || makeErfolg(jahr)
const addMissingErfolgData = (erfolgRawData) => {
  const years = erfolgRawData.map((e) => e.jahr)
  const allYears = range(min(years), Math.max(...years) + 1)
  return allYears.map((jahr) => getErfolg({ jahr, erfolgRawData }))
}

export const ApErfolg = memo(() => {
  const { apId: id } = useParams()

  const {
    data: dataErfolg,
    error: errorErfolg,
    loading: loadingErfolg,
  } = useQuery(query, {
    variables: { id },
  })
  const erfolgRawData = (dataErfolg?.allApbers?.nodes ?? []).map((e) => ({
    jahr: e.jahr,
    value: erfValueFromCode[e.beurteilung],
  }))
  const erfolgData = addMissingErfolgData(erfolgRawData)

  if (errorErfolg) return <Error error={errorErfolg} />

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('AP Erfolg, erfolgData:', erfolgData)

  return (
    <>
      {loadingErfolg ?
        <SpinnerContainer>
          <CircularProgress />
          <SpinnerText>lade AP-Erfolg...</SpinnerText>
        </SpinnerContainer>
      : erfolgRawData.length ?
        <>
          <Title>Erfolg des Aktionsplans</Title>
          <ResponsiveContainer
            width="99%"
            height={400}
          >
            <LineChart
              width={600}
              height={300}
              data={erfolgData}
              margin={{ top: 10, right: 10, left: 27 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis
                label={{
                  value: 'Erfolg',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -15,
                }}
                dataKey="value"
                domain={[0, 5]}
                tick={<CustomTick />}
                interval={0}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2e7d32"
                strokeWidth={1}
                isAnimationActive={true}
                dot={{ strokeWidth: 2, r: 4 }}
                fill="rgba(255,253,231,0)"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      : <>
          <Title>Erfolg des Aktionsplans</Title>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      }
    </>
  )
})
