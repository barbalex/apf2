import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'
import sumBy from 'lodash/sumBy'
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
  const { data, loading, error } = useQuery(query, {
    variables: {
      projektId,
      previousYear,
      jahr: year,
    },
  })
  const aps = data?.jberAktPop?.nodes ?? []
  const popsUrspr = sumBy(aps, 'pop100')
  const popsAnges = sumBy(aps, 'pop200')
  const popsTotal = sumBy(aps, 'popTotal')
  const popsUrsprDiff = sumBy(aps, 'pop100Diff')
  const popsAngesDiff = sumBy(aps, 'pop200Diff')
  const popsTotalDiff = sumBy(aps, 'popTotalDiff')
  const apRows = sortBy(
    aps.map((ap) => ({
      ap: ap?.artname,
      urspr: ap?.pop100,
      anges: ap?.pop200,
      total: ap?.popTotal,
      ursprDiff: ap?.pop100Diff,
      angesDiff: ap?.pop200Diff,
      totalDiff: ap?.popTotalDiff,
    })),
    'ap',
  )

  if (error) {
    return `Fehler: ${error.message}`
  }

  if (loading) {
    return (
      <ErrorBoundary>
        <Container>
          <Title>Übersicht über aktuelle Populationen aller AP-Arten</Title>
          <TitleRow1>Lade Daten...</TitleRow1>
        </Container>
      </ErrorBoundary>
    )
  }

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
