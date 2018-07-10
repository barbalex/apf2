// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  break-before: page;
  font-size: 11px;
  line-height: 1.1em;
  @media screen {
    margin-top: 3cm;
  }
`
const Title = styled.p`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
`
const ApRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const TitleRow = styled(ApRow)`
  border-top: 1px solid rgba(0, 0, 0, 0.3) !important;
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
const ApColumn = styled.div`
  min-width: 11.5cm;
  max-width: 11.5cm;
`
const UrprColumn = styled.div`
  min-width: 2cm;
  max-width: 2cm;
  text-align: center;
`
const AngesColumn = styled.div`
  min-width: 2cm;
  max-width: 2cm;
  text-align: center;
`
const TotalColumn = styled.div`
  min-width: 2cm;
  max-width: 2cm;
  text-align: center;
`

const AktPopList = ({ data }:{ data: Object }) => {
  const aps = get(data, 'projektById.apsByProjId.nodes', [])
  const pops = flatten(
    aps.map(ap => get(ap, 'popsByApId.nodes', []))
  ).filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
  const popsUrspr = pops.filter(p => p.status === 100).length
  const popsAnges = pops.filter(p => p.status === 200).length
  const popsTotal = pops.filter(p => [100, 200].includes(p.status)).length
  const apRows = sortBy(
      aps.map(ap => ({
      ap: get(ap, 'aeEigenschaftenByArtId.artname'),
      urspr: get(ap, 'popsByApId.nodes', [])
        .filter(p => p.status === 100)
        .length,
      anges: get(ap, 'popsByApId.nodes', [])
        .filter(p => p.status === 200)
        .length,
      total: get(ap, 'popsByApId.nodes', [])
        .filter(p => [100, 200].includes(p.status))
        .length
    })),
    'ap'
  )

  return (
    <ErrorBoundary>
      <Container>
        <Title>Übersicht über aktuelle Populationen aller AP-Arten</Title>
        <TitleRow>
          <ApColumn>Aktionsplan</ApColumn>
          <UrprColumn>ursprünglich</UrprColumn>
          <AngesColumn>angesiedelt</AngesColumn>
          <TotalColumn>total</TotalColumn>
        </TitleRow>
        {
          apRows.map(o =>
            <ApRow key={o.ap} >
              <ApColumn>{o.ap}</ApColumn>
              <UrprColumn>{o.urspr}</UrprColumn>
              <AngesColumn>{o.anges}</AngesColumn>
              <TotalColumn>{o.total}</TotalColumn>
            </ApRow>
          )
        }
        <TotalRow>
          <ApColumn>{apRows.length}</ApColumn>
          <UrprColumn>{popsUrspr}</UrprColumn>
          <AngesColumn>{popsAnges}</AngesColumn>
          <TotalColumn>{popsTotal}</TotalColumn>
        </TotalRow>
      </Container>
    </ErrorBoundary>
  )
}

export default AktPopList
