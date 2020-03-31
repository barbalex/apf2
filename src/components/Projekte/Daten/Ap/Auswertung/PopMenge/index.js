import React, { useCallback, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
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
import styled, { keyframes } from 'styled-components'
import { FaRedo } from 'react-icons/fa'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import IconButton from '@material-ui/core/IconButton'

import queryPopMenge from './queryPopMenge'
import CustomTooltip from './CustomTooltip'
import exists from '../../../../../../modules/exists'
import storeContext from '../../../../../../storeContext'

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

const color = 'rgba(46,125,50,0.3)'
const formatNumber = tickItem => {
  const value =
    exists(tickItem) && tickItem.toLocaleString
      ? tickItem.toLocaleString('de-ch')
      : null
  return value
}

const ApAuswertungPopMenge = ({ id }) => {
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const {
    data: dataPopMenge,
    error: errorPopMenge,
    loading: loadingPopMenge,
    refetch: refetchPopMenge,
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
    typeof window !== 'undefined' &&
      window.open(
        'https://apflora.ch/Dokumentation/Benutzer/ap-auswertung-pop-menge',
      )
  }, [])

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
          <TitleRow>
            <div>
              <Title>{`"${zielEinheit}" nach Populationen`}</Title>
            </div>
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
            >
              <IoMdInformationCircleOutline />
            </IconButton>
          </TitleRow>
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
                tickFormatter={formatNumber}
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
          <TitleRow>
            <div>
              <Title>{`"${zielEinheit}" nach Populationen`}</Title>
            </div>
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
            >
              <IoMdInformationCircleOutline />
            </IconButton>
          </TitleRow>
          <NoDataContainer>Keine Daten gefunden</NoDataContainer>
        </>
      )}
    </>
  )
}

export default ApAuswertungPopMenge
