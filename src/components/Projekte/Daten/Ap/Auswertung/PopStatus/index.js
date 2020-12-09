import React from 'react'
import { useQuery } from '@apollo/client'
import get from 'lodash/get'
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
import { ImpulseSpinner as Spinner } from 'react-spinners-kit'
import styled from 'styled-components'

import queryPopStatus from './queryPopStatus'
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
  'ursprünglich, erloschen': 'rgba(46,125,50,0.5)',
  'angesiedelt, aktuell': 'rgba(245,141,66,1)',
  Ansaatversuch: 'brown',
  'angesiedelt, erloschen/nicht etabliert': 'rgba(245,141,66,0.5)',
  'potentieller Wuchs-/Ansiedlungsort': 'grey',
}

const ApAuswertungPopStatus = ({ id, height = 400, print }) => {
  const {
    data: dataPopStatus,
    error: errorPopStatus,
    loading: loadingPopStatus,
  } = useQuery(queryPopStatus, {
    variables: { id },
  })
  const popStatusRawData =
    get(dataPopStatus, 'allVApAuswPopStatuses.nodes') || []
  const popStatusData = popStatusRawData.map((e) => {
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

  if (errorPopStatus) return <Error error={errorPopStatus} />

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  return (
    <>
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
          <Title>Stati der Populationen</Title>
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
                dataKey="ursprünglich, erloschen"
                stackId="1"
                stroke={color['ursprünglich, erloschen']}
                fill={color['ursprünglich, erloschen']}
                legendType="square"
                isAnimationActive={!print}
              />
              <Area
                type="monotone"
                dataKey="angesiedelt, aktuell"
                stackId="1"
                stroke={color['angesiedelt, aktuell']}
                fill={color['angesiedelt, aktuell']}
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
                dataKey="angesiedelt, erloschen/nicht etabliert"
                stackId="1"
                stroke={color['angesiedelt, erloschen/nicht etabliert']}
                fill={color['angesiedelt, erloschen/nicht etabliert']}
                legendType="square"
                isAnimationActive={!print}
              />
              <Area
                type="monotone"
                dataKey="potentieller Wuchs-/Ansiedlungsort"
                stackId="1"
                stroke={color['potentieller Wuchs-/Ansiedlungsort']}
                fill={color['potentieller Wuchs-/Ansiedlungsort']}
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
          <Title>Stati der Populationen</Title>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      )}
    </>
  )
}

export default ApAuswertungPopStatus
