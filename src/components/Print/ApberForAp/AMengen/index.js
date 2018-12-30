// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sum from 'lodash/sum'
import { useQuery } from 'react-apollo-hooks'

import query from './data'

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: -18px;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const YearRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
`
const TotalRow = styled(Row)`
  font-weight: 600;
`
const FernerRow = styled.div`
  padding: 0.05cm 0 0 0;
  font-size: 12px;
`
const LabelRow = styled(Row)`
  font-size: 12px;
`
const Year = styled.div`
  position: relative;
  left: 10.9cm;
  width: 2cm;
`
const Label1 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
`
const Label2 = styled.div`
  min-width: 8.8cm;
  max-width: 8.8cm;
  padding-left: 1.2cm;
`
const Label2Davon = styled.div`
  font-size: 10px;
  padding-left: 1.5cm;
  min-width: 0.8cm;
  max-width: 0.8cm;
  top: 3px;
  position: relative;
  color: grey;
`
const Label3 = styled.div`
  min-width: 7.5cm;
  max-width: 7.5cm;
  padding-left: 2.5cm;
`
const Label3AfterDavon = styled.div`
  padding-left: 0.2cm;
  min-width: 7.5cm;
  max-width: 7.5cm;
`
const Number = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  text-align: right;
`
const PopBerJahr = styled(Number)``
const TpopBerJahr = styled(Number)`
  padding-right: 1cm;
`
const PopSeit = styled(Number)``
const TpopSeit = styled(Number)``

const AMengen = ({
  apId,
  jahr,
  startJahr,
}: {
  apId: String,
  jahr: Number,
  startJahr: Number,
}) => {
  const { data, error, loading } = useQuery(query, {
    suspend: false,
    variables: { apId, startJahr },
  })
  const threeLPop = get(data, 'apById.threeLPop.nodes', []).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  ).length
  const threeLTpop = sum(
    get(data, 'apById.threeLTpop.nodes', []).map(p =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const fourLPop = get(data, 'apById.fourLPop.nodes', []).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  ).length
  const fourLTpop = sum(
    get(data, 'apById.fourLTpop.nodes', []).map(p =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const fiveLPop = get(data, 'apById.fiveLPop.nodes', []).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  ).length
  const fiveLTpop = sum(
    get(data, 'apById.fiveLTpop.nodes', []).map(p =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const sevenLPop = get(data, 'apById.sevenLPop.nodes', []).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  ).length
  const sevenLTpop = sum(
    get(data, 'apById.sevenLTpop.nodes', []).map(p =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const eightLPop = get(data, 'apById.eightLPop.nodes', []).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  ).length
  const eightLTpop = sum(
    get(data, 'apById.eightLTpop.nodes', []).map(p =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const nineLPop = get(data, 'apById.nineLPop.nodes', []).filter(
    p => get(p, 'tpopsByPopId.totalCount') > 0,
  ).length
  const nineLTpop = sum(
    get(data, 'apById.nineLTpop.nodes', []).map(p =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const tenLPop = get(data, 'apById.tenLPop.totalCount', 0)
  const tenLTpop = sum(
    get(data, 'apById.tenLTpop.nodes', []).map(p =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )

  if (error) return `Fehler: ${error.message}`

  return (
    <Container>
      <Title>A. Grundmengen</Title>
      <YearRow>
        <Year>{jahr}</Year>
      </YearRow>
      <LabelRow>
        <Label1 />
        <PopBerJahr>Pop</PopBerJahr>
        <TpopBerJahr>TPop</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </LabelRow>
      <Row>
        <Label1>Anzahl bekannt</Label1>
        <PopBerJahr>
          {loading
            ? '...'
            : threeLPop +
              fourLPop +
              fiveLPop +
              sevenLPop +
              eightLPop +
              nineLPop}
        </PopBerJahr>
        <TpopBerJahr>
          {loading
            ? '...'
            : threeLTpop +
              fourLTpop +
              fiveLTpop +
              sevenLTpop +
              eightLTpop +
              nineLTpop}
        </TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <TotalRow>
        <Label2>aktuell</Label2>
        <PopBerJahr>
          {loading ? '...' : threeLPop + fourLPop + fiveLPop}
        </PopBerJahr>
        <TpopBerJahr>
          {loading ? '...' : threeLTpop + fourLTpop + fiveLTpop}
        </TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </TotalRow>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label3AfterDavon>ursprünglich</Label3AfterDavon>
        <PopBerJahr>{loading ? '...' : threeLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : threeLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <Row>
        <Label3>angesiedelt (vor Beginn AP)</Label3>
        <PopBerJahr>{loading ? '...' : fourLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : fourLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <Row>
        <Label3>angesiedelt (nach Beginn AP)</Label3>
        <PopBerJahr>{loading ? '...' : fiveLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : fiveLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <Row>
        <Label2>erloschen:</Label2>
        <PopBerJahr>{loading ? '...' : sevenLPop + eightLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : sevenLTpop + eightLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label3AfterDavon>
          zuvor autochthon oder vor AP angesiedelt
        </Label3AfterDavon>
        <PopBerJahr>{loading ? '...' : sevenLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : sevenLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <Row>
        <Label3>nach Beginn Aktionsplan angesiedelt</Label3>
        <PopBerJahr>{loading ? '...' : eightLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : eightLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <Row>
        <Label2>Ansaatversuche:</Label2>
        <PopBerJahr>{loading ? '...' : nineLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : nineLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
      <FernerRow>Ferner:</FernerRow>
      <Row>
        <Label1>potentieller Wuchs-/Ansiedlungsort:</Label1>
        <PopBerJahr>{loading ? '...' : tenLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : tenLTpop}</TpopBerJahr>
        <PopSeit />
        <TpopSeit />
      </Row>
    </Container>
  )
}

export default AMengen
