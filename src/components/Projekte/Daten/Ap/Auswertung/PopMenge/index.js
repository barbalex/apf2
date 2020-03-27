import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { ImpulseSpinner as Spinner } from 'react-spinners-kit'
import styled from 'styled-components'

import queryPopMenge from './queryPopMenge'
import CustomTooltip from './CustomTooltip'
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
const color = 'rgba(46,125,50,0.3)'

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
  const nonUniquePopIdsWithData = popMengeData.flatMap(d =>
    Object.entries(d)
      .filter(([key, value]) => key !== 'jahr')
      .filter(([key, value]) => exists(value))
      .map(([key, value]) => key),
  )
  const popIdsWithData = [...new Set(nonUniquePopIdsWithData)]
  const popIdsWithDataSorted = sortBy(popIdsWithData, id => {
    const pop = popsData.find(d => d.id === id)
    if (pop) return pop.nr
    return id
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
          <SpinnerText>lade Mengen nach Populationen...</SpinnerText>
        </SpinnerContainer>
      ) : popMengeData.length ? (
        <>
          <Title>{`"${zielEinheit}" nach Populationen`}</Title>
          <ResponsiveContainer width="99%" height={400}>
            <AreaChart
              width={600}
              height={300}
              data={popMengeData}
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
              {popIdsWithDataSorted.reverse().map(id => (
                <Area
                  key={id}
                  type="linear"
                  dataKey={id}
                  stackId="1"
                  stroke={color}
                  strokeWidth={2}
                  fill={color}
                />
              ))}
              <Tooltip content={<CustomTooltip popsData={popsData} />} />
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <Title>{`"${zielEinheit}" nach Populationen`}</Title>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      )}
    </>
  )
}

export default ApAuswertungPopMenge
