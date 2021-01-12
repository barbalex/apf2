import React from 'react'
import { useQuery } from '@apollo/client'
import get from 'lodash/get'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
} from 'recharts'
import { ImpulseSpinner as Spinner } from 'react-spinners-kit'
import styled from 'styled-components'

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
const TitleTitle = styled.span`
  color: #2e7d32;
`
const TitleKontr = styled.span`
  color: red;
`

const color = {
  'Teil-Populationen': '#2e7d32',
  kontrolliert: 'red',
}

const ApAuswertungTpopKontrolliert = ({ id, height = 400, print }) => {
  const { data, error, loading } = useQuery(query, {
    variables: { id },
  })
  const erfolgData = get(data, 'tpopKontrolliertForJber.nodes', []).map(
    (d) => ({
      jahr: d.year,
      'Teil-Populationen': d.anzTpop ? Number(d.anzTpop) : 0,
      kontrolliert: d.anzTpopber ? Number(d.anzTpopber) : 0,
    }),
  )

  if (error) return <Error error={error} />

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('Ap TPopKontrolliert, erfolgData:', erfolgData)

  return (
    <>
      {loading ? (
        <SpinnerContainer>
          <Spinner
            size={50}
            frontColor="#2e7d32"
            backColor="#4a148c1a"
            loading={true}
          />
          <SpinnerText>lade kontrollierte TPop...</SpinnerText>
        </SpinnerContainer>
      ) : erfolgData.length ? (
        <>
          <Title>
            (<TitleKontr>kontrollierte</TitleKontr>){' '}
            <TitleTitle>Teil-Populationen</TitleTitle>
          </Title>
          <ResponsiveContainer width="99%" height={height}>
            <LineChart
              width={600}
              height={300}
              data={erfolgData}
              margin={{ top: 10, right: 10, left: 27 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis
                label={{
                  value: print ? 'Anzahl' : 'Teil-Populationen',
                  angle: -90,
                  position: 'insideLeft',
                  offset: print ? 0 : -15,
                }}
                dataKey="Teil-Populationen"
              />
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <Line
                type="linear"
                dataKey="Teil-Populationen"
                stroke="#2e7d32"
                strokeWidth={1}
                isAnimationActive={false}
                dot={{ strokeWidth: 2, r: 4 }}
                fill="rgba(255,253,231,0)"
              />
              <Line
                type="linear"
                dataKey="kontrolliert"
                stroke="red"
                strokeWidth={1}
                isAnimationActive={false}
                dot={{ strokeWidth: 2, r: 4 }}
                fill="rgba(255,253,231,0)"
              />
              <Legend layout="horizontal" align="center" iconSize={22} />
              <Tooltip
                content={<CustomTooltip color={color} reverse={true} />}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <Title>
            (<TitleKontr>kontrollierte</TitleKontr>){' '}
            <TitleTitle>Teil-Populationen</TitleTitle>
          </Title>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      )}
    </>
  )
}

export default ApAuswertungTpopKontrolliert
