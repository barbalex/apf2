import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'
import { useQuery } from '@apollo/client'

import storeContext from '../../../../storeContext'
import query from './query'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  break-before: page;
  font-size: 10px;
  line-height: 1.1em;
  @media screen {
    margin-top: 1.5cm;
  }
  @media print {
    padding-top: 0.3cm !important;
  }
`
const Title = styled.p`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
`
const ApRow = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  > div {
    padding: 0.05cm 0;
  }
`
const TitleRow1 = styled(ApRow)`
  border-top: 1px solid rgba(0, 0, 0, 0.3) !important;
  div {
    font-weight: 700;
  }
`
const TitleRow2 = styled(ApRow)`
  border-bottom: 1px double rgba(0, 0, 0, 0.3) !important;
  div {
    font-weight: 700;
  }
`
const TotalRow = styled(ApRow)`
  border-top: 1px solid rgba(0, 0, 0, 0.3) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3) !important;
  div {
    font-weight: 700;
  }
`
const DiffLeftColumn = styled.div`
  min-width: 8.8cm;
  max-width: 8.8cm;
`
const DataColumn = styled.div`
  min-width: 4.8cm;
  max-width: 4.8cm;
  text-align: center;
`
const DiffColumn = styled.div`
  min-width: 4.8cm;
  max-width: 4.8cm;
  text-align: center;
`
const ApColumn = styled.div`
  min-width: 8.8cm;
  max-width: 8.8cm;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const UrsprColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  background-color: ${(props) => props['data-color'] ?? 'white'};
`
const AngesColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  background-color: ${(props) => props['data-color'] ?? 'white'};
`
const TotalColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  background-color: ${(props) => props['data-color'] ?? 'white'};
`

const AktPopList = ({ year }) => {
  const store = useContext(storeContext)
  const { projIdInActiveNodeArray } = store.tree
  const projektId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const previousYear = year - 1
  const { data, loading, error: dataError } = useQuery(query, {
    variables: {
      projektId,
      previousYear,
      jahr: year,
    },
  })
  const aps = get(data, 'allAps.nodes', [])
  const pops100 = flatten(aps.map((ap) => get(ap, 'pops100.nodes', []))).filter(
    (p) => get(p, 'tpopsByPopId.totalCount') > 0,
  )
  const pops100previous = flatten(
    aps.map((ap) => get(ap, 'pops100previous.nodes', [])),
  ).filter((p) => get(p, 'tpopHistoriesByYearAndPopId.totalCount') > 0)
  const pops200 = flatten(aps.map((ap) => get(ap, 'pops200.nodes', []))).filter(
    (p) => get(p, 'tpopsByPopId.totalCount') > 0,
  )
  const pops200previous = flatten(
    aps.map((ap) => get(ap, 'pops200previous.nodes', [])),
  ).filter((p) => get(p, 'tpopHistoriesByYearAndPopId.totalCount') > 0)
  const popsUrspr = pops100.length
  const popsAnges = pops200.length
  const popsTotal = popsUrspr + popsAnges
  const popsUrsprDiff = pops100.length - pops100previous.length
  const popsAngesDiff = pops200.length - pops200previous.length
  const popsTotalDiff =
    pops100.length +
    pops200.length -
    (pops100previous.length + pops200previous.length)
  const apRows = sortBy(
    aps.map((ap) => {
      const urspr = get(ap, 'pops100.nodes', []).filter(
        (p) => get(p, 'tpopsByPopId.totalCount') > 0,
      ).length
      const ursprPrevious = get(ap, 'pops100previous.nodes', []).filter(
        (p) => get(p, 'tpopHistoriesByYearAndPopId.totalCount') > 0,
      ).length
      const anges = get(ap, 'pops200.nodes', []).filter(
        (p) => get(p, 'tpopsByPopId.totalCount') > 0,
      ).length
      const angesPrevious = get(ap, 'pops200previous.nodes', []).filter(
        (p) => get(p, 'tpopHistoriesByYearAndPopId.totalCount') > 0,
      ).length

      return {
        ap: get(ap, 'aeTaxonomyByArtId.artname'),
        urspr,
        anges,
        total: urspr + anges,
        ursprDiff: urspr - ursprPrevious,
        angesDiff: anges - angesPrevious,
        totalDiff: urspr + anges - (ursprPrevious + angesPrevious),
      }
    }),
    'ap',
  )

  if (dataError) {
    return `Fehler: ${dataError.message}`
  }

  /*if (loading) {
    return (
      <ErrorBoundary>
        <Container>
          <Title>Übersicht über aktuelle Populationen aller AP-Arten</Title>
          <TitleRow1>Lade Daten...</TitleRow1>
        </Container>
      </ErrorBoundary>
    )
  }*/

  return (
    <ErrorBoundary>
      <Container>
        <Title>Übersicht über aktuelle Populationen aller AP-Arten</Title>
        <TitleRow1>
          <DiffLeftColumn />
          <DataColumn>aktuelle Werte</DataColumn>
          <DiffColumn>Differenz zum Vorjahr</DiffColumn>
        </TitleRow1>
        <TitleRow2>
          <ApColumn>Aktionsplan</ApColumn>
          <UrsprColumn>ursprünglich</UrsprColumn>
          <AngesColumn>angesiedelt</AngesColumn>
          <TotalColumn>total</TotalColumn>
          <UrsprColumn>ursprünglich</UrsprColumn>
          <AngesColumn>angesiedelt</AngesColumn>
          <TotalColumn>total</TotalColumn>
        </TitleRow2>
        {apRows.map((o) => (
          <ApRow key={o.ap}>
            <ApColumn>{o.ap}</ApColumn>
            <UrsprColumn>{o.urspr}</UrsprColumn>
            <AngesColumn>{o.anges}</AngesColumn>
            <TotalColumn>{o.total}</TotalColumn>
            <UrsprColumn
              data-color={
                o.ursprDiff > 0 ? '#00ff00' : o.ursprDiff < 0 ? 'red' : 'white'
              }
            >
              {o.ursprDiff}
            </UrsprColumn>
            <AngesColumn
              data-color={
                o.angesDiff > 0 ? '#00ff00' : o.angesDiff < 0 ? 'red' : 'white'
              }
            >
              {o.angesDiff}
            </AngesColumn>
            <TotalColumn
              data-color={
                o.totalDiff > 0 ? '#00ff00' : o.totalDiff < 0 ? 'red' : 'white'
              }
            >
              {o.totalDiff}
            </TotalColumn>
          </ApRow>
        ))}
        <TotalRow>
          <ApColumn>{apRows.length}</ApColumn>
          <UrsprColumn>{popsUrspr}</UrsprColumn>
          <AngesColumn>{popsAnges}</AngesColumn>
          <TotalColumn>{popsTotal}</TotalColumn>
          <UrsprColumn
            data-color={
              popsUrsprDiff > 0
                ? '#00ff00'
                : popsUrsprDiff < 0
                ? 'red'
                : 'white'
            }
          >
            {popsUrsprDiff}
          </UrsprColumn>
          <AngesColumn
            data-color={
              popsAngesDiff > 0
                ? '#00ff00'
                : popsAngesDiff < 0
                ? 'red'
                : 'white'
            }
          >
            {popsAngesDiff}
          </AngesColumn>
          <TotalColumn
            data-color={
              popsTotalDiff > 0
                ? '#00ff00'
                : popsTotalDiff < 0
                ? 'red'
                : 'white'
            }
          >
            {popsTotalDiff}
          </TotalColumn>
        </TotalRow>
      </Container>
    </ErrorBoundary>
  )
}

export default AktPopList
