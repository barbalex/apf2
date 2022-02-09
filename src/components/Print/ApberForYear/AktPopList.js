import React, { useContext } from 'react'
import styled from 'styled-components'
import sumBy from 'lodash/sumBy'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

import storeContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'

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
    margin-top: 0.3cm !important;
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
  page-break-inside: avoid;
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
  @media print {
    min-width: 9.7cm;
    max-width: 9.7cm;
  }
`
const DataColumn = styled.div`
  min-width: 5.1cm;
  max-width: 5.1cm;
  text-align: center;
  @media print {
    min-width: 5.4cm;
    max-width: 5.4cm;
  }
`
const DiffColumn = styled.div`
  min-width: 4.4cm;
  max-width: 4.4cm;
  text-align: center;
  @media print {
    min-width: 5cm;
    max-width: 5cm;
  }
`
const ApColumn = styled.div`
  min-width: 8.8cm;
  max-width: 8.8cm;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media print {
    min-width: 9.5cm;
    max-width: 9.5cm;
  }
`
const UrsprColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  background-color: ${(props) => props['data-color'] ?? 'white'};
  @media print {
    min-width: 1.9cm;
    max-width: 1.9cm;
  }
`
const AngesColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  background-color: ${(props) => props['data-color'] ?? 'white'};
  @media print {
    min-width: 1.9cm;
    max-width: 1.9cm;
  }
`
const TotalColumn = styled.div`
  min-width: 1.6cm;
  max-width: 1.6cm;
  text-align: center;
  background-color: ${(props) => props['data-color'] ?? 'white'};
  @media print {
    min-width: 1.9cm;
    max-width: 1.9cm;
  }
`
const TotalDiffColumn = styled.div`
  min-width: 1.2cm;
  max-width: 1.2cm;
  text-align: center;
  background-color: ${(props) => props['data-color'] ?? 'white'};
  @media print {
    min-width: 1.5cm;
    max-width: 1.5cm;
  }
`

const AktPopList = ({ year }) => {
  const store = useContext(storeContext)
  const { projIdInActiveNodeArray } = store.tree
  const projektId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const previousYear = year - 1
  const { data, loading, error } = useQuery(
    gql`
      query AktPopListAps($jahr: Int!) {
        jberAktPop(jahr: $jahr) {
          nodes {
            artname
            id
            pop100
            pop200
            popTotal
            pop100Diff
            pop200Diff
            popTotalDiff
          }
        }
      }
    `,
    {
      variables: {
        projektId,
        previousYear,
        jahr: year,
      },
    },
  )
  const aps = data?.jberAktPop?.nodes ?? []
  const pop100 = sumBy(aps, 'pop100')
  const pop200 = sumBy(aps, 'pop200')
  const popsTotal = sumBy(aps, 'popTotal')
  const pop100Diff = sumBy(aps, 'pop100Diff')
  const pop200Diff = sumBy(aps, 'pop200Diff')
  const popTotalDiff = sumBy(aps, 'popTotalDiff')

  //console.log('AktPopList', { apRows, aps, data })

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
          <TotalDiffColumn>total</TotalDiffColumn>
        </TitleRow2>
        {aps.map((ap) => (
          <ApRow key={ap?.artname}>
            <ApColumn>{ap?.artname}</ApColumn>
            <UrsprColumn>{ap?.pop100}</UrsprColumn>
            <AngesColumn>{ap?.pop200}</AngesColumn>
            <TotalColumn>{ap?.popTotal}</TotalColumn>
            <UrsprColumn
              data-color={
                ap?.pop100Diff > 0
                  ? '#00ff00'
                  : ap?.pop100Diff < 0
                  ? 'red'
                  : 'white'
              }
            >
              {ap?.pop100Diff}
            </UrsprColumn>
            <AngesColumn
              data-color={
                ap?.pop200Diff > 0
                  ? '#00ff00'
                  : ap?.pop200Diff < 0
                  ? 'red'
                  : 'white'
              }
            >
              {ap?.pop200Diff}
            </AngesColumn>
            <TotalDiffColumn
              data-color={
                ap?.popTotalDiff > 0
                  ? '#00ff00'
                  : ap?.popTotalDiff < 0
                  ? 'red'
                  : 'white'
              }
            >
              {ap?.popTotalDiff}
            </TotalDiffColumn>
          </ApRow>
        ))}
        <TotalRow>
          <ApColumn>{aps.length}</ApColumn>
          <UrsprColumn>{pop100}</UrsprColumn>
          <AngesColumn>{pop200}</AngesColumn>
          <TotalColumn>{popsTotal}</TotalColumn>
          <UrsprColumn
            data-color={
              pop100Diff > 0 ? '#00ff00' : pop100Diff < 0 ? 'red' : 'white'
            }
          >
            {pop100Diff}
          </UrsprColumn>
          <AngesColumn
            data-color={
              pop200Diff > 0 ? '#00ff00' : pop200Diff < 0 ? 'red' : 'white'
            }
          >
            {pop200Diff}
          </AngesColumn>
          <TotalDiffColumn
            data-color={
              popTotalDiff > 0 ? '#00ff00' : popTotalDiff < 0 ? 'red' : 'white'
            }
          >
            {popTotalDiff}
          </TotalDiffColumn>
        </TotalRow>
      </Container>
    </ErrorBoundary>
  )
}

export default AktPopList
