import { useCallback } from 'react'
import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client/react";
import sortBy from 'lodash/sortBy'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import CircularProgress from '@mui/material/CircularProgress'
import styled from '@emotion/styled'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import MuiTooltip from '@mui/material/Tooltip'
import { useParams } from 'react-router'

import { query } from './query.js'
import { CustomTooltip } from './CustomTooltip.jsx'
import { exists } from '../../../../modules/exists.js'
import { Error } from '../../../shared/Error.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

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
const TitleRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`
const Title = styled.h4`
  margin-bottom: 0;
  margin-top: 0;
  padding: 0 10px;
`
const Container = styled(ResponsiveContainer)`
  overflow: hidden;
`

const colorUrspruenglich = 'rgba(46,125,50,0.3)'
const colorAngesiedelt = 'rgba(245,141,66,1)'
const formatNumber = (tickItem) => {
  const value =
    exists(tickItem) && tickItem?.toLocaleString
      ? tickItem.toLocaleString('de-ch')
      : null
  return value
}

export const Component = ({ height = 400 }) => {
  const { apId, popId } = useParams()

  const { data, error, loading } = useQuery(query, {
    variables: { apId, id: popId },
  })

  const popLabel = data?.popById?.label ?? 'Population'
  const tpopsData = data?.allTpops?.nodes ?? []
  const tpopMengeRawData = data?.popAuswTpopMenge?.nodes ?? []
  const tpopMengeData = tpopMengeRawData.map((e) => ({
    jahr: e.jahr,
    ...JSON.parse(e.values),
  }))
  const nonUniqueTpopIdsWithData = tpopMengeData.flatMap((d) =>
    Object.entries(d)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => key !== 'jahr')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => exists(value))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, value]) => key),
  )
  const tpopIdsWithData = [...new Set(nonUniqueTpopIdsWithData)]
  const tpopIdsWithDataSorted = sortBy(tpopIdsWithData, (id) => {
    const tpop = tpopsData.find((d) => d.id === id)
    if (tpop) return tpop.nr
    return id
  })

  const zielEinheit =
    data?.allEkzaehleinheits?.nodes?.[0]
      ?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.text ?? '(keine Zielenheit)'

  const onClickMoreInfo = useCallback(() => {
    const url = 'https://apflora.ch/Dokumentation/art-auswertung-pop-menge'
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [])

  if (error) return <Error error={error} />

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('AP, PopMenge, popMengeData:', popMengeData)

  return (
    <>
      <FormTitle title={`${popLabel}: Auswertung`} />
      <>
        {loading ? (
          <SpinnerContainer>
            <CircularProgress />
            <SpinnerText>lade Mengen nach Teil-Populationen...</SpinnerText>
          </SpinnerContainer>
        ) : tpopMengeData.length ? (
          <>
            <TitleRow>
              <Title>{`"${zielEinheit}" nach Teil-Populationen`}</Title>
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            </TitleRow>
            <Container width="99%" height={height}>
              <AreaChart
                width={600}
                height={300}
                data={tpopMengeData}
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
                  tickFormatter={formatNumber}
                />
                {tpopIdsWithDataSorted.reverse().map((id) => {
                  const tpop = tpopsData.find((p) => p.id === id)
                  let color
                  if (!tpop) {
                    color = 'grey'
                  } else {
                    const isUrspruenglich = tpop?.status < 200
                    color = isUrspruenglich
                      ? colorUrspruenglich
                      : colorAngesiedelt
                  }

                  return (
                    <Area
                      key={id}
                      type="linear"
                      dataKey={id}
                      stackId="1"
                      stroke={color}
                      strokeWidth={2}
                      fill={color}
                      isAnimationActive={true}
                    />
                  )
                })}
                <Tooltip content={<CustomTooltip tpopsData={tpopsData} />} />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              </AreaChart>
            </Container>
          </>
        ) : (
          <>
            <TitleRow>
              <Title>{`"${zielEinheit}" nach Teil-Populationen`}</Title>
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            </TitleRow>
            <NoDataContainer>Keine Daten gefunden</NoDataContainer>
          </>
        )}
      </>
    </>
  )
}
