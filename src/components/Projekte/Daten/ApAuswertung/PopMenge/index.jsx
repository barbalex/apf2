import { useCallback } from 'react'
import { useQuery } from "@apollo/client/react";
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
import CircularProgress from '@mui/material/CircularProgress'
import styled from '@emotion/styled'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import MuiTooltip from '@mui/material/Tooltip'
import { useParams } from 'react-router'

import { query } from './query.js'
import { CustomTooltip } from './CustomTooltip.jsx'
import { exists } from '../../../../../modules/exists.js'
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
const TitleRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
`
const Title = styled.h4`
  margin-bottom: 0;
  margin-top: 0;
  padding: 0 10px;
`

const colorUrspruenglich = 'rgba(46,125,50,0.3)'
const colorAngesiedelt = 'rgba(245,141,66,1)'
const formatNumber = (tickItem) => {
  const value =
    exists(tickItem) && tickItem?.toLocaleString ?
      tickItem.toLocaleString('de-ch')
    : null
  return value
}

export const PopMenge = ({
  apId: apIdPassed,
  height = 400,
  print,
  isSubReport,
  jahr: jahrPassed,
}) => {
  const { apId } = useParams()
  const id = apIdPassed ?? apId

  const jahr = jahrPassed ?? new Date().getFullYear()
  const {
    data: dataPopMenge,
    error: errorPopMenge,
    loading: loadingPopMenge,
  } = useQuery(query, {
    variables: { id, jahr },
  })

  const popsData = dataPopMenge?.allPops?.nodes ?? []
  const popMengeRawData = dataPopMenge?.apAuswPopMenge?.nodes ?? []
  const popMengeData = popMengeRawData.map((e) => ({
    jahr: e.jahr,
    ...JSON.parse(e.values),
  }))
  const nonUniquePopIdsWithData = popMengeData.flatMap((d) =>
    Object.entries(d)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => key !== 'jahr')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => exists(value))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, value]) => key),
  )
  const popIdsWithData = [...new Set(nonUniquePopIdsWithData)]
  const popIdsWithDataSorted = sortBy(popIdsWithData, (id) => {
    const pop = popsData.find((d) => d.id === id)
    if (pop) return pop.nr
    return id
  })

  const zielEinheit =
    dataPopMenge?.allEkzaehleinheits?.nodes?.[0]
      ?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.text ?? '(keine Einheit)'

  const onClickMoreInfo = useCallback(() => {
    const url = 'https://apflora.ch/Dokumentation/art-auswertung-pop-menge'
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [])

  if (errorPopMenge) return <Error error={errorPopMenge} />

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('AP, PopMenge, popMengeData:', popMengeData)

  return (
    <>
      {loadingPopMenge ?
        <SpinnerContainer>
          <CircularProgress />
          <SpinnerText>lade Mengen nach Populationen...</SpinnerText>
        </SpinnerContainer>
      : popMengeData.length ?
        <>
          <TitleRow>
            <Title>{`"${zielEinheit}" nach Populationen`}</Title>
            {!print && (
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            )}
          </TitleRow>
          <ResponsiveContainer
            width="99%"
            height={height}
          >
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
                  offset: print ? 0 : -15,
                }}
                tickFormatter={formatNumber}
              />
              {popIdsWithDataSorted.reverse().map((id) => {
                const pop = popsData.find((p) => p.id === id)
                let color
                if (!pop) {
                  color = 'grey'
                } else {
                  const isUrspruenglich = pop?.status < 200
                  color =
                    isUrspruenglich ? colorUrspruenglich : colorAngesiedelt
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
                    isAnimationActive={!isSubReport}
                  />
                )
              })}
              {!isSubReport && (
                <Tooltip content={<CustomTooltip popsData={popsData} />} />
              )}
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      : <>
          <TitleRow>
            <Title>{`"${zielEinheit}" nach Populationen`}</Title>
            {!print && (
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            )}
          </TitleRow>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      }
    </>
  )
}
