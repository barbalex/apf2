// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'
import { useQuery } from 'react-apollo-hooks'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import mobxStoreContext from '../../../../mobxStoreContext'
import query from './query'

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

const AktPopList = () => {
  const mobxStore = useContext(mobxStoreContext)
  const activeNodes = mobxStore.treeActiveNodes
  const { projekt: projektId } = activeNodes
  const { data, loading, error: dataError } = useQuery(query, {
    variables: {
      projektId,
    },
  })
  const aps = get(data, 'allAps.nodes', [])
  const pops100 = flatten(aps.map(ap => get(ap, 'pops100.nodes', []))).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  )
  const pops200 = flatten(aps.map(ap => get(ap, 'pops200.nodes', []))).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  )
  const popsUrspr = pops100.length
  const popsAnges = pops200.length
  const popsTotal = popsUrspr + popsAnges
  const apRows = sortBy(
    aps.map(ap => {
      const urspr = get(ap, 'pops100.nodes', []).filter(
        p => get(p, 'tpopsByPopId.totalCount') > 0,
      ).length
      const anges = get(ap, 'pops200.nodes', []).filter(
        p => get(p, 'tpopsByPopId.totalCount') > 0,
      ).length

      return {
        ap: get(ap, 'aeEigenschaftenByArtId.artname'),
        urspr,
        anges,
        total: urspr + anges,
      }
    }),
    'ap',
  )

  if (dataError) {
    return `Fehler: ${dataError.message}`
  }

  if (loading) {
    return (
      <ErrorBoundary>
        <Container>
          <Title>Übersicht über aktuelle Populationen aller AP-Arten</Title>
          <TitleRow>Lade Daten...</TitleRow>
        </Container>
      </ErrorBoundary>
    )
  }

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
        {apRows.map(o => (
          <ApRow key={o.ap}>
            <ApColumn>{o.ap}</ApColumn>
            <UrprColumn>{o.urspr}</UrprColumn>
            <AngesColumn>{o.anges}</AngesColumn>
            <TotalColumn>{o.total}</TotalColumn>
          </ApRow>
        ))}
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
