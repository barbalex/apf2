import React from 'react'
import { useQuery } from '@apollo/client'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import CircularProgress from '@mui/material/CircularProgress'
import styled from '@emotion/styled'

import query from './query'
import CustomTooltip from '../CustomTooltip'
import Error from '../../../../../shared/Error'

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

const color = {
  'ursprünglich, aktuell': '#2e7d32',
  'angesiedelt (vor Beginn AP)': 'rgba(245,141,66,1)',
  'angesiedelt (nach Beginn AP)': 'rgba(245,141,66,1)',
  Ansaatversuch: 'brown',
  'erloschen (nach 1950): zuvor autochthon oder vor AP angesiedelt':
    'rgba(46,125,50,0.5)',
  'erloschen (nach 1950): nach Beginn Aktionsplan angesiedelt':
    'rgba(245,141,66,0.5)',
}

const ApAuswertungPopStatus = ({
  id,
  height = 400,
  print,
  year: yearPassed,
}) => {
  const year = yearPassed ?? new Date().getFullYear()
  const {
    data: dataPopStati,
    error: errorPopStati,
    loading: loadingPopStati,
  } = useQuery(query, {
    variables: { apId: id, year },
  })
  const rows = dataPopStati?.popNachStatusForJber?.nodes ?? []

  const popStatusData = rows.map((row) => ({
    jahr: row.year,
    'ursprünglich, aktuell': row?.a3Lpop ? Number(row?.a3Lpop) : 0,
    'angesiedelt (vor Beginn AP)': row?.a4Lpop ? Number(row?.a4Lpop) : 0,
    'angesiedelt (nach Beginn AP)': row?.a5Lpop ? Number(row?.a5Lpop) : 0,
    Ansaatversuch: row?.a9Lpop ? Number(row?.a9Lpop) : 0,
    'erloschen (nach 1950): zuvor autochthon oder vor AP angesiedelt':
      row?.a7Lpop ? Number(row?.a7Lpop) : 0,
    'erloschen (nach 1950): nach Beginn Aktionsplan angesiedelt': row?.a8Lpop
      ? Number(row?.a8Lpop)
      : 0,
  }))

  if (errorPopStati) return <Error error={errorPopStati} />

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('AP PopStatus, popStatusData:', popStatusData)

  return (
    <>
      {loadingPopStati ? (
        <SpinnerContainer>
          <CircularProgress />
          <SpinnerText>lade Populations-Stati...</SpinnerText>
        </SpinnerContainer>
      ) : rows.length ? (
        <>
          <Title>Populationen nach Status</Title>
          <ResponsiveContainer width="99%" height={height}>
            <AreaChart
              width={600}
              height={300}
              data={popStatusData}
              margin={{ top: 10, right: 10, left: 27 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis
                interval={0}
                label={{
                  value: print ? 'Anzahl' : 'Anzahl Populationen',
                  angle: -90,
                  position: 'insideLeft',
                  offset: print ? 0 : -15,
                }}
              />
              <Area
                type="monotone"
                dataKey="ursprünglich, aktuell"
                stackId="1"
                stroke={color['ursprünglich, aktuell']}
                fill={color['ursprünglich, aktuell']}
                legendType="square"
                isAnimationActive={!print}
              />
              <Area
                type="monotone"
                dataKey="angesiedelt (vor Beginn AP)"
                stackId="1"
                stroke={color['angesiedelt (vor Beginn AP)']}
                fill={color['angesiedelt (vor Beginn AP)']}
                legendType="square"
                isAnimationActive={!print}
              />
              <Area
                type="monotone"
                dataKey="angesiedelt (nach Beginn AP)"
                stackId="1"
                stroke={color['angesiedelt (nach Beginn AP)']}
                fill={color['angesiedelt (nach Beginn AP)']}
                legendType="square"
                isAnimationActive={!print}
              />
              <Area
                type="monotone"
                dataKey="Ansaatversuch"
                stackId="1"
                stroke={color['Ansaatversuch']}
                fill={color['Ansaatversuch']}
                legendType="square"
                isAnimationActive={!print}
              />
              <Area
                type="monotone"
                dataKey="erloschen (nach 1950): zuvor autochthon oder vor AP angesiedelt"
                stackId="1"
                stroke={
                  color[
                    'erloschen (nach 1950): zuvor autochthon oder vor AP angesiedelt'
                  ]
                }
                fill={
                  color[
                    'erloschen (nach 1950): zuvor autochthon oder vor AP angesiedelt'
                  ]
                }
                legendType="square"
                isAnimationActive={!print}
              />
              <Area
                type="monotone"
                dataKey="erloschen (nach 1950): nach Beginn Aktionsplan angesiedelt"
                stackId="1"
                stroke={
                  color[
                    'erloschen (nach 1950): nach Beginn Aktionsplan angesiedelt'
                  ]
                }
                fill={
                  color[
                    'erloschen (nach 1950): nach Beginn Aktionsplan angesiedelt'
                  ]
                }
                legendType="square"
                isAnimationActive={!print}
              />
              <Tooltip content={<CustomTooltip color={color} />} />
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <Legend
                layout="horizontal"
                align="center"
                iconSize={12}
                wrapperStyle={{ bottom: 0, fontSize: 12 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <Title>Populationen nach Status</Title>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      )}
    </>
  )
}

export default ApAuswertungPopStatus
