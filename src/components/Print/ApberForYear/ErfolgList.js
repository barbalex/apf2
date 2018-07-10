// @flow
import React, { Fragment } from 'react'
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
  grid-template-columns: 9cm repeat(11, 1fr);
  grid-column-gap: 1px;
  grid-row-gap: 1px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
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
const Ap = styled.div`
  grid-column: 1 / span 1;
`
const ErfolgSpanningTitle = styled(Title)`
  grid-column: 2 / span 7;
  grid-row: 1 / span 1;
  justify-self: center;
`
const ErfolgNicht = styled.div`
  grid-column: 2 / span 1;
  justify-self: center;
`
const ErfolgWenig = styled.div`
  grid-column: 3 / span 1;
  justify-self: center;
`
const ErfolgMaessig = styled.div`
  grid-column: 4 / span 1;
  justify-self: center;
`
const ErfolgGut = styled.div`
  grid-column: 5 / span 1;
  justify-self: center;
`
const ErfolgSehr = styled.div`
  grid-column: 6 / span 1;
  justify-self: center;
`
const ErfolgVeraenderung = styled.div`
  grid-column: 7 / span 1;
  justify-self: center;
`
const ErfolgUnsicher = styled.div`
  grid-column: 8 / span 1;
  justify-self: center;
`
const ErfolgNichtBeurteilt = styled.div`
  grid-column: 9 / span 1;
  justify-self: center;
`
const KeineMassnahme = styled.div`
  grid-column: 10 / span 1;
  justify-self: center;
`
const KefArt = styled.div`
  grid-column: 11 / span 1;
  justify-self: center;
`
const KefKontrolle = styled.div`
  grid-column: 12 / span 1;
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
  const apRows = sortBy(
    aps.map(ap => {
      const beurteilung = get(ap, 'apbersByApId.nodes[0].beurteilung')
      const pops = get(ap, 'popsByApId.nodes', [])
      const tpops = flatten(
        pops.map(p => get(p, 'tpopsByPopId.nodes', []))
      )
      const anzMassn = flatten(
        tpops.map(t => get(t, 'tpopmassnsByTpopId.nodes', []))
      ).length
      const kefKontrollJahr = get(ap, 'aeEigenschaftenByArtId.kefkontrolljahr')
      const isKefKontrollJahr = !!kefKontrollJahr && window.Math.floor((jahr - kefKontrollJahr) / 4) === (jahr - kefKontrollJahr) / 4
      return ({
        ap: get(ap, 'aeEigenschaftenByArtId.artname'),
        erfolgNicht: beurteilung === 3 ? 'X' : '',
        erfolgWenig: beurteilung === 6 ? 'X' : '',
        erfolgMaessig: beurteilung === 5 ? 'X' : '',
        erfolgGut: beurteilung === 1 ? 'X' : '',
        erfolgSehr: beurteilung === 4 ? 'X' : '',
        erfolgUnsicher: beurteilung === 1168274204 ? 'X' : '',
        nichtBeurteilt: ![1, 3, 4, 5, 6, 1168274204].includes(beurteilung) ? 'X' : '',
        veraenderung: get(ap, 'apbersByApId.nodes[0].veraenderungZumVorjahr', ''),
        keineMassnahme: anzMassn === 0 ? 'X' : '',
        kefArt: !!get(ap, 'aeEigenschaftenByArtId.kefart') ? 'X' : '',
        kefKontrolle: isKefKontrollJahr ? 'X' : ''
      })
    }),
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
          {
            apRows.map(row =>
              <Fragment key={row.ap}>
                <Ap>{row.ap}</Ap>
                <ErfolgNicht>{row.erfolgNicht}</ErfolgNicht>
                <ErfolgWenig>{row.erfolgWenig}</ErfolgWenig>
                <ErfolgMaessig>{row.erfolgMaessig}</ErfolgMaessig>
                <ErfolgGut>{row.erfolgGut}</ErfolgGut>
                <ErfolgSehr>{row.erfolgSehr}</ErfolgSehr>
                <ErfolgVeraenderung>{row.veraenderung}</ErfolgVeraenderung>
                <ErfolgUnsicher>{row.erfolgUnsicher}</ErfolgUnsicher>
                <ErfolgNichtBeurteilt>{row.nichtBeurteilt}</ErfolgNichtBeurteilt>
                <KeineMassnahme>{row.keineMassnahme}</KeineMassnahme>
                <KefArt>{row.kefArt}</KefArt>
                <KefKontrolle>{row.kefKontrolle}</KefKontrolle>
              </Fragment>
            )
          }
        </Table>
      </Container>
    </ErrorBoundary>
  )
}

export default ErfolgList
