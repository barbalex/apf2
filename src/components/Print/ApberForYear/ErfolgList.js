import React, { Fragment } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'
import ErrorBoundary from 'react-error-boundary'

const Container = styled.div`
  break-before: page;
  font-size: 11px;
  @media screen {
    margin-top: 3cm;
  }
  @media print {
    padding-top: 0.3cm !important;
  }
`
const Table = styled.div`
  display: grid;
  grid-template-columns: 11fr repeat(11, 1fr);
  grid-column-gap: 0;
  grid-row-gap: 0;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid rgba(0,0,0,0.1);
  margin-left: -1px;
  margin-right: -1px;
}
  > div { 
    border: 1px solid rgba(0,0,0,0.1);
    box-sizing: border-box;
    border-collapse: collapse;
  }
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
  padding-top: 4px;
`
const Cell = styled.div`
  display: inline-block;
`
const Ap = styled(Cell)`
  grid-column: 1 / span 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const ErfolgSpanningTitle = styled(Title)`
  grid-column: 2 / span 7;
  grid-row: 1 / span 1;
  text-align: center;
  padding-top: 4px;
`
const ErfolgNicht = styled(Cell)`
  grid-column: 2 / span 1;
  text-align: center;
  background-color: ${props => (props.val ? 'red' : 'unset')};
`
const ErfolgWenig = styled(Cell)`
  grid-column: 3 / span 1;
  text-align: center;
  background-color: ${props => (props.val ? 'orange' : 'unset')};
`
const ErfolgMaessig = styled(Cell)`
  grid-column: 4 / span 1;
  text-align: center;
  background-color: ${props => (props.val ? 'yellow' : 'unset')};
`
const ErfolgGut = styled(Cell)`
  grid-column: 5 / span 1;
  text-align: center;
  background-color: ${props => (props.val ? '#00f6ff' : 'unset')};
`
const ErfolgSehr = styled(Cell)`
  grid-column: 6 / span 1;
  text-align: center;
  background-color: ${props => (props.val ? '#00ff00' : 'unset')};
`
const ErfolgVeraenderung = styled(Cell)`
  grid-column: 7 / span 1;
  text-align: center;
`
const ErfolgUnsicher = styled(Cell)`
  grid-column: 8 / span 1;
  text-align: center;
  background-color: ${props => (props.val ? '#afafaf' : 'unset')};
`
const ErfolgNichtBeurteilt = styled(Cell)`
  grid-column: 9 / span 1;
  text-align: center;
`
const KeineMassnahme = styled(Cell)`
  grid-column: 10 / span 1;
  text-align: center;
`
const KefArt = styled(Cell)`
  grid-column: 11 / span 1;
  text-align: center;
`
const KefKontrolle = styled(Cell)`
  grid-column: 12 / span 1;
  text-align: center;
`
const KefSpanningTitle = styled(Title)`
  grid-column: 11 / span 2;
  grid-row: 1 / span 1;
  text-align: center;
  padding-top: 4px;
`
const KeineMassnTitle = styled(Title)`
  grid-column: 10 / span 1;
  grid-row: 1 / span 2;
  writing-mode: vertical-lr;
  padding-bottom: 3px;
  padding-top: 3px;
  /* needed because of bug (?) in print mode
   * where not full height is taken */
  height: 98px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 2.6em;
  }
`
const ErfolgNichtBeurteiltTitle = styled(Title)`
  grid-column: 9 / span 1;
  grid-row: 1 / span 2;
  writing-mode: vertical-lr;
  padding-bottom: 3px;
  padding-top: 3px;
  /* needed because of bug (?) in print mode
   * where not full height is taken */
  height: 98px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 2.6em;
  }
`
const ErfolgTitle = styled(Title)`
  writing-mode: vertical-lr;
  padding-bottom: 3px;
  padding-top: 3px;
  /* needed because of bug (?) in print mode
   * where not full height is taken */
  height: 79px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 2.6em;
  }
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
  background-color: #afafaf;
`
const KefArtTitle = styled(ErfolgTitle)`
  grid-column: 11 / span 1;
  grid-row: 2 / span 1;
`
const KefKontrolleTitle = styled(ErfolgTitle)`
  grid-column: 12 / span 1;
  grid-row: 2 / span 1;
`

const ErfolgList = ({ jahr, data }) => {
  const aps = get(data, 'allAps.nodes', [])
  const apRows = sortBy(
    aps.map(ap => {
      const beurteilung = get(ap, 'apbersByApId.nodes[0].beurteilung')
      const pops = get(ap, 'popsByApId.nodes', [])
      const tpops = flatten(pops.map(p => get(p, 'tpopsByPopId.nodes', [])))
      const anzMassn = flatten(
        tpops.map(t => get(t, 'tpopmassnsByTpopId.nodes', [])),
      ).length
      const kefKontrollJahr = get(ap, 'aeTaxonomyByArtId.kefkontrolljahr')
      const isKefKontrollJahr =
        !!kefKontrollJahr &&
        typeof window !== 'undefined' &&
        window.Math.floor((jahr - kefKontrollJahr) / 4) ===
          (jahr - kefKontrollJahr) / 4
      return {
        ap: get(ap, 'aeTaxonomyByArtId.artname'),
        erfolgNicht: beurteilung === 3 ? 'X' : '',
        erfolgWenig: beurteilung === 6 ? 'X' : '',
        erfolgMaessig: beurteilung === 5 ? 'X' : '',
        erfolgGut: beurteilung === 1 ? 'X' : '',
        erfolgSehr: beurteilung === 4 ? 'X' : '',
        erfolgUnsicher: beurteilung === 1168274204 ? 'X' : '',
        nichtBeurteilt: ![1, 3, 4, 5, 6, 1168274204].includes(beurteilung)
          ? 'X'
          : '',
        veraenderung: get(
          ap,
          'apbersByApId.nodes[0].veraenderungZumVorjahr',
          '',
        ),
        keineMassnahme: anzMassn === 0 ? 'X' : '',
        kefArt: !!get(ap, 'aeTaxonomyByArtId.kefart') ? 'X' : '',
        kefKontrolle: isKefKontrollJahr ? 'X' : '',
      }
    }),
    'ap',
  )

  return (
    <ErrorBoundary>
      <Container>
        <OverallTitle>{`Erfolg ${jahr}`}</OverallTitle>
        <Table>
          <ApTitle>Art</ApTitle>
          <ErfolgSpanningTitle>Erfolg</ErfolgSpanningTitle>
          <KeineMassnTitle>
            <div>keine Massnahme</div>
          </KeineMassnTitle>
          <KefSpanningTitle>KEF</KefSpanningTitle>
          <ErfolgNichtTitle>
            <div>nicht</div>
          </ErfolgNichtTitle>
          <ErfolgWenigTitle>
            <div>wenig</div>
          </ErfolgWenigTitle>
          <ErfolgMaessigTitle>
            <div>mässig</div>
          </ErfolgMaessigTitle>
          <ErfolgGutTitle>
            <div>gut</div>
          </ErfolgGutTitle>
          <ErfolgSehrTitle>
            <div>sehr</div>
          </ErfolgSehrTitle>
          <ErfolgAenderungTitle>
            <div>Veränderung</div>
          </ErfolgAenderungTitle>
          <ErfolgUnsicherTitle>
            <div>unsicher</div>
          </ErfolgUnsicherTitle>
          <ErfolgNichtBeurteiltTitle>
            <div>nicht beurteilt</div>
          </ErfolgNichtBeurteiltTitle>
          <KefArtTitle>
            <div>Art</div>
          </KefArtTitle>
          <KefKontrolleTitle>
            <div>Kontrolle</div>
          </KefKontrolleTitle>
          {apRows.map(row => (
            <Fragment key={row.ap}>
              <Ap>{row.ap}</Ap>
              <ErfolgNicht val={!!row.erfolgNicht}>
                {row.erfolgNicht}
              </ErfolgNicht>
              <ErfolgWenig val={!!row.erfolgWenig}>
                {row.erfolgWenig}
              </ErfolgWenig>
              <ErfolgMaessig val={!!row.erfolgMaessig}>
                {row.erfolgMaessig}
              </ErfolgMaessig>
              <ErfolgGut val={!!row.erfolgGut}>{row.erfolgGut}</ErfolgGut>
              <ErfolgSehr val={!!row.erfolgSehr}>{row.erfolgSehr}</ErfolgSehr>
              <ErfolgVeraenderung>{row.veraenderung}</ErfolgVeraenderung>
              <ErfolgUnsicher val={!!row.erfolgUnsicher}>
                {row.erfolgUnsicher}
              </ErfolgUnsicher>
              <ErfolgNichtBeurteilt val={!!row.nichtBeurteilt}>
                {row.nichtBeurteilt}
              </ErfolgNichtBeurteilt>
              <KeineMassnahme val={!!row.keineMassnahme}>
                {row.keineMassnahme}
              </KeineMassnahme>
              <KefArt val={!!row.kefArt}>{row.kefArt}</KefArt>
              <KefKontrolle val={!!row.kefKontrolle}>
                {row.kefKontrolle}
              </KefKontrolle>
            </Fragment>
          ))}
        </Table>
      </Container>
    </ErrorBoundary>
  )
}

export default ErfolgList
