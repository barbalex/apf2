import React from 'react'
import { useQuery } from '@apollo/react-hooks'
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

import queryPopMenge from './queryPopMenge'
import CustomTooltip from '../CustomTooltip'
import exists from '../../../../../../modules/exists'

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

const color = {
  'ursprünglich, aktuell': '#2e7d32',
  'ursprünglich, erloschen': 'rgba(46,125,50,0.5)',
  'angesiedelt, aktuell': 'rgba(245,141,66,1)',
  Ansaatversuch: 'brown',
  'angesiedelt, erloschen/nicht etabliert': 'rgba(245,141,66,0.5)',
  'potentieller Wuchs-/Ansiedlungsort': 'grey',
}

const ApAuswertungPopMenge = ({ id }) => {
  const {
    data: dataPopMenge,
    error: errorPopMenge,
    loading: loadingPopMenge,
  } = useQuery(queryPopMenge, {
    variables: { id },
  })

  const popsData = get(dataPopMenge, 'allPops.nodes') || []
  const popMengeRawData = get(dataPopMenge, 'allVApAuswPopMenges.nodes') || []
  const popMengeData = popMengeRawData.map(e => ({
    jahr: e.jahr,
    ...JSON.parse(e.values),
  }))
  console.log('ApAuswertungPopMenge:', {
    popMengeData,
    popsData,
  })
  const unfilteredPopIdsWithData = popMengeData.flatMap(d =>
    Object.entries(d)
      .filter(([key, value]) => key !== 'jahr')
      .filter(([key, value]) => exists(value))
      .map(([key, value]) => key),
  )
  const popIdsWithData = Array.from(new Set(unfilteredPopIdsWithData))
  console.log('ApAuswertungPopMenge:', {
    popIdsWithData,
  })
  const popMengeDataWithAllPops = popMengeData.map(o => {
    return {
      ...Object.fromEntries(popIdsWithData.map(v => [v, null])),
      ...o,
    }
  })
  console.log('ApAuswertungPopMenge:', {
    popMengeDataWithAllPops,
  })

  const zielEinheit = get(
    dataPopMenge,
    'allEkzaehleinheits.nodes[0].tpopkontrzaehlEinheitWerteByZaehleinheitId.text',
  )

  if (errorPopMenge) {
    return `Fehler beim Laden der Daten: ${errorPopMenge.message}`
  }

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  return (
    <>
      {loadingPopMenge ? (
        <SpinnerContainer>
          <Spinner
            size={50}
            frontColor="#2e7d32"
            backColor="#4a148c1a"
            loading={true}
          />
          <SpinnerText>lade Populations-Zählungen...</SpinnerText>
        </SpinnerContainer>
      ) : popMengeData.length ? (
        <>
          <Title>{`Zählungen von "${zielEinheit}" in Populationen`}</Title>
          <ResponsiveContainer width="99%" height={400}>
            <AreaChart
              width={600}
              height={300}
              data={popMengeDataWithAllPops}
              margin={{ top: 10, right: 10, left: 27 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis
                interval={0}
                label={{
                  value: zielEinheit,
                  angle: -90,
                  position: 'insideLeft',
                  offset: -15,
                }}
              />
              {popIdsWithData.map(id => {
                console.log({ id })
                return (
                  <Area
                    key={id}
                    type="monotone"
                    dataKey={id}
                    stackId="1"
                    stroke={color['ursprünglich, aktuell']}
                    fill={color['ursprünglich, aktuell']}
                    legendType="square"
                  />
                )
              })}
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
        <NoDataContainer>
          Sorry, es gibt keine Daten zu den Populations-Zählungen
        </NoDataContainer>
      )}
    </>
  )
}

export default ApAuswertungPopMenge
