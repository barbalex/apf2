// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  break-before: page;
  font-size: 11px;
  line-height: 1.1em;
  @media screen {
    margin-top: 3cm;
  }
`
const Table = styled.div`
  display: grid;
  grid-template-rows: 6cm | repeat(11, 1cm);
  grid-column-gap: 1px;
  grid-row-gap: 1px;
  justify-items: stretch;
  align-items: stretch;
`
const OverallTitle = styled.p`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
`
const Title = styled.div`
  font-weight: 700;
`
const ApTitle = styled(Title)`
  grid-column: 1 / span 1;
  grid-row: 1 / span 2;
`
const ErfolgSpanningTitle = styled(Title)`
  grid-column: 2 / span 7;
  grid-row: 1 / span 1;
  justify-self: center;
`
const KefSpanningTitle = styled(Title)`
  grid-column: 11 / span 2;
  grid-row: 1 / span 1;
  justify-self: center;
`
const KeineMassnTitle = styled(Title)`
  grid-column: 10 / span 1;
  grid-row: 1 / span 2;
  transform: rotate(270deg);
	transform-origin: center bottom 0;
`
const ErfolgTitle = styled(Title)`
  transform: rotate(270deg);
  transform-origin: center bottom 0;
`
const ErfolgNichtTitle = styled(ErfolgTitle)`
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  background-color: red;
`
const ErfolgWenigTitle = styled(ErfolgTitle)`
  grid-column: 3 / span 1;
  grid-row: 2 / span 1;
  background-color: orange;
`
const ErfolgMaessigTitle = styled(ErfolgTitle)`
  grid-column: 4 / span 1;
  grid-row: 2 / span 1;
  background-color: yellow;
`
const ErfolgGutTitle = styled(ErfolgTitle)`
  grid-column: 5 / span 1;
  grid-row: 2 / span 1;
  background-color: #00f6ff;
`
const ErfolgSehrTitle = styled(ErfolgTitle)`
  grid-column: 6 / span 1;
  grid-row: 2 / span 1;
  background-color: #00ff00;
`
const ErfolgAenderungTitle = styled(ErfolgTitle)`
  grid-column: 7 / span 1;
  grid-row: 2 / span 1;
`
const ErfolgUnsicherTitle = styled(ErfolgTitle)`
  grid-column: 8 / span 1;
  grid-row: 2 / span 1;
  background-color: grey;
`
const ErfolgNichtBeurteiltTitle = styled(ErfolgTitle)`
  grid-column: 9 / span 1;
  grid-row: 2 / span 1;
`
const KefArtTitle = styled(ErfolgTitle)`
  grid-column: 11 / span 1;
  grid-row: 2 / span 1;
`
const KefKontrolleTitle = styled(ErfolgTitle)`
  grid-column: 12 / span 1;
  grid-row: 2 / span 1;
`

const ErfolgList = ({
  data,
  jahr
}:{
  data: Object,
  jahr: Number
}) => {
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
        <OverallTitle>{`Erfolg ${jahr}`}</OverallTitle>
        <Table>
          <ApTitle>Art</ApTitle>
          <ErfolgSpanningTitle>Erfolg</ErfolgSpanningTitle>
          <KeineMassnTitle>keine Massnahme</KeineMassnTitle>
          <KefSpanningTitle>KEF</KefSpanningTitle>
          <ErfolgNichtTitle>nicht</ErfolgNichtTitle>
          <ErfolgWenigTitle>wenig</ErfolgWenigTitle>
          <ErfolgMaessigTitle>mässig</ErfolgMaessigTitle>
          <ErfolgGutTitle>gut</ErfolgGutTitle>
          <ErfolgSehrTitle>sehr</ErfolgSehrTitle>
          <ErfolgAenderungTitle>Veränderung</ErfolgAenderungTitle>
          <ErfolgUnsicherTitle>unsicher</ErfolgUnsicherTitle>
          <ErfolgNichtBeurteiltTitle>nicht beurteilt</ErfolgNichtBeurteiltTitle>
          <KefArtTitle>Art</KefArtTitle>
          <KefKontrolleTitle>Kontrolle</KefKontrolleTitle>
        </Table>
      </Container>
    </ErrorBoundary>
  )
}

export default ErfolgList
