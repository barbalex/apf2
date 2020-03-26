import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import range from 'lodash/range'
import min from 'lodash/min'
import max from 'lodash/max'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ImpulseSpinner as Spinner } from 'react-spinners-kit'
import styled from 'styled-components'

import queryErfolg from './queryErfolg'
import CustomTick from '../CustomTick'

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
const findErfolg = ({ jahr, erfolgRawData }) =>
  erfolgRawData.find(e => e.jahr === jahr)
const makeErfolg = jahr => ({ jahr, value: null })
const getErfolg = ({ jahr, erfolgRawData }) =>
  findErfolg({ jahr, erfolgRawData }) || makeErfolg(jahr)
const addMissingErfolgData = erfolgRawData => {
  const years = erfolgRawData.map(e => e.jahr)
  const allYears = range(min(years), max(years))
  return allYears.map(jahr => getErfolg({ jahr, erfolgRawData }))
}

const ApAuswertungApErfolg = ({ id }) => {
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

  if (errorErfolg) {
    return `Fehler beim Laden der Daten: ${errorErfolg.message}`
  }

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

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
          <Title>Erfolg des Aktionsplans</Title>
          <ResponsiveContainer width="99%" height={400}>
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
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2e7d32"
                strokeWidth={1}
                isAnimationActive={false}
                dot={{ strokeWidth: 2, r: 4 }}
                fill="rgba(255,253,231,0)"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <NoDataContainer>
          Sorry, es gibt keine Daten zum AP-Erfolg
        </NoDataContainer>
      )}
    </>
  )
}

export default ApAuswertungApErfolg
