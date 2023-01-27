import React, { useCallback, useState, useContext } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
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
import { keyframes } from '@emotion/react'
import { FaRedo } from 'react-icons/fa'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import { useParams } from 'react-router-dom'

import queryPopMenge from './queryPopMenge'
import CustomTooltip from './CustomTooltip'
import exists from '../../../../../../modules/exists'
import storeContext from '../../../../../../storeContext'
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
const TitleRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`
const Title = styled.h4`
  margin-bottom: 0;
  padding: 0 10px;
`
const spinning = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`
const RefreshButtonSpinning = styled(IconButton)`
  animation: ${spinning} 3s linear infinite;
`
const RefreshButton = styled(IconButton)``

const colorUrspruenglich = 'rgba(46,125,50,0.3)'
const colorAngesiedelt = 'rgba(245,141,66,1)'
const formatNumber = (tickItem) => {
  const value =
    exists(tickItem) && tickItem?.toLocaleString
      ? tickItem.toLocaleString('de-ch')
      : null
  return value
}

const ApAuswertungPopMenge = ({
  apId: apIdPassed,
  height = 400,
  print,
  jahr: jahrPassed,
}) => {
  const { apId } = useParams()
  const id = apIdPassed ?? apId

  const store = useContext(storeContext)
  const { enqueNotification } = store

  const jahr = jahrPassed ?? new Date().getFullYear()
  const {
    data: dataPopMenge,
    error: errorPopMenge,
    loading: loadingPopMenge,
    refetch: refetchPopMenge,
  } = useQuery(queryPopMenge, {
    variables: { id, jahr },
  })

  const popsData = dataPopMenge?.allPops?.nodes ?? []
  const popMengeRawData = dataPopMenge?.allVApAuswPopMenges?.nodes ?? []
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
      ?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.text

  const [refreshing, setRefreshing] = useState(false)
  const [refreshData] = useMutation(gql`
    mutation vApAuswPopMengeRefreshFromAp {
      vApAuswPopMengeRefresh(input: { clientMutationId: "bla" }) {
        boolean
      }
    }
  `)
  const onClickRefresh = useCallback(async () => {
    if (refreshing) return
    setRefreshing(true)
    try {
      await refreshData()
    } catch (error) {
      setRefreshing(false)
      return enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    try {
      await refetchPopMenge()
    } catch (error) {
      setRefreshing(false)
      return enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    setRefreshing(false)
  }, [enqueNotification, refetchPopMenge, refreshData, refreshing])

  const onClickMoreInfo = useCallback(() => {
    const url = 'https://apflora.ch/Dokumentation/ap-auswertung-pop-menge'
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
      {loadingPopMenge ? (
        <SpinnerContainer>
          <CircularProgress />
          <SpinnerText>lade Mengen nach Populationen...</SpinnerText>
        </SpinnerContainer>
      ) : popMengeData.length ? (
        <>
          <TitleRow>
            <div>
              <Title>{`"${zielEinheit}" nach Populationen`}</Title>
            </div>
            {!print && (
              <>
                {refreshing ? (
                  <RefreshButtonSpinning
                    title="Daten werden neu berechnet"
                    aria-label="Daten werden neu berechnet"
                    onClick={onClickRefresh}
                    size="small"
                  >
                    <FaRedo />
                  </RefreshButtonSpinning>
                ) : (
                  <RefreshButton
                    title="Daten neu rechnen"
                    aria-label="Daten neu rechnen"
                    onClick={onClickRefresh}
                    size="small"
                  >
                    <FaRedo />
                  </RefreshButton>
                )}
                <IconButton
                  aria-label="Mehr Informationen"
                  title="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </>
            )}
          </TitleRow>
          <ResponsiveContainer width="99%" height={height}>
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
                    isAnimationActive={!print}
                  />
                )
              })}
              {!print && (
                <Tooltip content={<CustomTooltip popsData={popsData} />} />
              )}
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <TitleRow>
            <div>
              <Title>{`"${zielEinheit}" nach Populationen`}</Title>
            </div>
            {!print && (
              <>
                {refreshing ? (
                  <RefreshButtonSpinning
                    title="Daten werden neu berechnet"
                    aria-label="Daten werden neu berechnet"
                    onClick={onClickRefresh}
                    size="small"
                  >
                    <FaRedo />
                  </RefreshButtonSpinning>
                ) : (
                  <RefreshButton
                    title="Daten neu rechnen"
                    aria-label="Daten neu rechnen"
                    onClick={onClickRefresh}
                    size="small"
                  >
                    <FaRedo />
                  </RefreshButton>
                )}
                <IconButton
                  aria-label="Mehr Informationen"
                  title="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </>
            )}
          </TitleRow>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      )}
    </>
  )
}

export default ApAuswertungPopMenge
