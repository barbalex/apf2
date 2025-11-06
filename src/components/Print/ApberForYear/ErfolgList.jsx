import { Fragment } from 'react'
import styled from '@emotion/styled'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

const Container = styled.div`
  break-before: page;
  font-size: 11px;
  @media screen {
    margin-top: 3cm;
  }
  @media print {
    margin-top: 0.3cm !important;
    /* get background colors to show */
    -webkit-print-color-adjust: exact;
  }
`
const Table = styled.div`
  display: grid;
  /* need the minmax 0 value to prevent long art names from pushing to the right */
  grid-template-columns: minmax(0, 12fr) repeat(10, 1fr);
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
    page-break-inside: avoid;
  }
`
const OverallTitle = styled.p`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
`
const ApTitle = styled.div`
  font-weight: 700;
  grid-column: 1 / span 1;
  grid-row: 1 / span 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 4px;
`
const Ap = styled.div`
  display: inline-block;
  grid-column: 1 / span 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${(props) => props['odd'] && 'background-color: rgba(0,0,0,0.03);'}
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgSpanningTitle = styled.div`
  font-weight: 700;
  grid-column: 2 / span 7;
  grid-row: 1 / span 1;
  text-align: center;
  padding-top: 4px;
`
const ErfolgNicht = styled.div`
  display: inline-block;
  grid-column: 2 / span 1;
  text-align: center;
  background-color: ${(props) =>
    props.val ? 'red'
    : props.odd ? 'rgba(0,0,0,0.03)'
    : 'unset'};
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgWenig = styled.div`
  display: inline-block;
  grid-column: 3 / span 1;
  text-align: center;
  background-color: ${(props) =>
    props.val ? 'orange'
    : props.odd ? 'rgba(0,0,0,0.03)'
    : 'unset'};
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgMaessig = styled.div`
  display: inline-block;
  grid-column: 4 / span 1;
  text-align: center;
  background-color: ${(props) =>
    props.val ? 'yellow'
    : props.odd ? 'rgba(0,0,0,0.03)'
    : 'unset'};
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgGut = styled.div`
  display: inline-block;
  grid-column: 5 / span 1;
  text-align: center;
  background-color: ${(props) =>
    props.val ? '#00f6ff'
    : props.odd ? 'rgba(0,0,0,0.03)'
    : 'unset'};
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgSehr = styled.div`
  display: inline-block;
  grid-column: 6 / span 1;
  text-align: center;
  font-weight: 600;
  background-color: ${(props) =>
    props.val ? '#00ff00'
    : props.odd ? 'rgba(0,0,0,0.03)'
    : 'unset'};
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgVeraenderung = styled.div`
  display: inline-block;
  grid-column: 7 / span 1;
  text-align: center;
  font-weight: 600;
  ${(props) => props['odd'] && 'background-color: rgba(0,0,0,0.03);'}
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgUnsicher = styled.div`
  display: inline-block;
  grid-column: 8 / span 1;
  text-align: center;
  background-color: ${(props) =>
    props.val ? '#afafaf'
    : props.odd ? 'rgba(0,0,0,0.03)'
    : 'unset'};
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgNichtBeurteilt = styled.div`
  display: inline-block;
  grid-column: 9 / span 1;
  text-align: center;
  font-weight: 600;
  ${(props) => props['odd'] && 'background-color: rgba(0,0,0,0.03);'}
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const KeineMassnahme = styled.div`
  display: inline-block;
  grid-column: 10 / span 1;
  text-align: center;
  font-weight: 600;
  ${(props) => props['odd'] && 'background-color: rgba(0,0,0,0.03);'}
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ApExists = styled.div`
  display: inline-block;
  grid-column: 11 / span 1;
  text-align: center;
  font-weight: 600;
  ${(props) => props['odd'] && 'background-color: rgba(0,0,0,0.03);'}
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const KeineMassnTitle = styled.div`
  font-weight: 700;
  grid-column: 10 / span 1;
  grid-row: 1 / span 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  writing-mode: vertical-lr;
  padding: 3px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 1em;
  }
`
const ApExistsTitle = styled.div`
  font-weight: 700;
  grid-column: 11 / span 1;
  grid-row: 1 / span 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  writing-mode: vertical-lr;
  padding: 3px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 1em;
  }
`
const ErfolgNichtBeurteiltTitle = styled.div`
  font-weight: 700;
  grid-column: 9 / span 1;
  grid-row: 1 / span 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  writing-mode: vertical-lr;
  padding-bottom: 3px;
  padding-top: 3px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 2.6em;
  }
`
const ErfolgNichtTitle = styled.div`
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: red;
  font-weight: 700;
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
const ErfolgWenigTitle = styled.div`
  grid-column: 3 / span 1;
  grid-row: 2 / span 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: orange;
  font-weight: 700;
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
const ErfolgMaessigTitle = styled.div`
  grid-column: 4 / span 1;
  grid-row: 2 / span 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: yellow;
  font-weight: 700;
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
const ErfolgGutTitle = styled.div`
  grid-column: 5 / span 1;
  grid-row: 2 / span 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #00f6ff;
  font-weight: 700;
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
const ErfolgSehrTitle = styled.div`
  grid-column: 6 / span 1;
  grid-row: 2 / span 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #00ff00;
  font-weight: 700;
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
const ErfolgAenderungTitle = styled.div`
  grid-column: 7 / span 1;
  grid-row: 2 / span 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-weight: 700;
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
const ErfolgUnsicherTitle = styled.div`
  grid-column: 8 / span 1;
  grid-row: 2 / span 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #afafaf;
  font-weight: 700;
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

export const ErfolgList = ({ jahr, data }) => {
  const nodes = data?.jberAbc?.nodes ?? []
  const apRows = nodes.map((ap) => {
    const veraenderung =
      ap.erfolg === 6 || ap.erfolgVorjahr === 6 ? ''
      : ap.erfolg === null || ap.erfolgVorjahr === null ? ''
      : ap.erfolg - ap.erfolgVorjahr === 0 ? ''
      : ap.erfolg - ap.erfolgVorjahr > 0 ? '―'
      : '╋'
    // Problem: in print some artnames are very long
    // this pushes columns to the right, off of the print
    // Seems that overflow/ellipis is not respected
    // so need to shorten names
    const artname =
      ap.artname?.length > 82 ?
        `${ap.artname?.substring?.(0, 82)}...`
      : (ap.artname ?? '')

    return {
      //ap: ap.artname,
      ap: artname,
      erfolgNicht: ap?.erfolg === 5 ? 'X' : '',
      erfolgWenig: ap?.erfolg === 4 ? 'X' : '',
      erfolgMaessig: ap?.erfolg === 3 ? 'X' : '',
      erfolgGut: ap?.erfolg === 2 ? 'X' : '',
      erfolgSehr: ap?.erfolg === 1 ? 'X' : '',
      erfolgUnsicher: ap?.erfolg === 6 ? 'X' : '',
      nichtBeurteilt: ap?.erfolg === null ? 'X' : '',
      veraenderung,
      keineMassnahme: ap.c1LPop === 0 ? 'X' : '',
      apExists: ap.bearbeitung === 3 ? 'X' : '',
    }
  })

  //console.log('ErfolgList, apRows:', apRows)

  return (
    <ErrorBoundary>
      <Container>
        <OverallTitle>{`Erfolg ${jahr}`}</OverallTitle>
        <Table>
          <ApTitle>Art</ApTitle>
          <ErfolgSpanningTitle>Erfolg</ErfolgSpanningTitle>
          <KeineMassnTitle>
            <div>keine Massnahme</div>
            <div>im Berichtsjahr</div>
          </KeineMassnTitle>
          <ApExistsTitle>
            <div>Aktionsplan</div>
            <div>erstellt</div>
          </ApExistsTitle>
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
          {apRows.map((row, index) => {
            // eslint-disable-next-line eqeqeq
            const odd = Math.abs(index % 2) == 1

            return (
              <Fragment key={row.ap}>
                <Ap odd={odd}>{row.ap}</Ap>
                <ErfolgNicht
                  val={!!row.erfolgNicht}
                  odd={odd}
                >
                  {row.erfolgNicht}
                </ErfolgNicht>
                <ErfolgWenig
                  val={!!row.erfolgWenig}
                  odd={odd}
                >
                  {row.erfolgWenig}
                </ErfolgWenig>
                <ErfolgMaessig
                  val={!!row.erfolgMaessig}
                  odd={odd}
                >
                  {row.erfolgMaessig}
                </ErfolgMaessig>
                <ErfolgGut
                  val={!!row.erfolgGut}
                  odd={odd}
                >
                  {row.erfolgGut}
                </ErfolgGut>
                <ErfolgSehr
                  val={!!row.erfolgSehr}
                  odd={odd}
                >
                  {row.erfolgSehr}
                </ErfolgSehr>
                <ErfolgVeraenderung odd={odd}>
                  {row.veraenderung}
                </ErfolgVeraenderung>
                <ErfolgUnsicher
                  val={!!row.erfolgUnsicher}
                  odd={odd}
                >
                  {row.erfolgUnsicher}
                </ErfolgUnsicher>
                <ErfolgNichtBeurteilt
                  val={!!row.nichtBeurteilt}
                  odd={odd}
                >
                  {row.nichtBeurteilt}
                </ErfolgNichtBeurteilt>
                <KeineMassnahme
                  val={!!row.keineMassnahme}
                  odd={odd}
                >
                  {row.keineMassnahme}
                </KeineMassnahme>
                <ApExists
                  val={!!row.apExists}
                  odd={odd}
                >
                  {row.apExists}
                </ApExists>
              </Fragment>
            )
          })}
        </Table>
      </Container>
    </ErrorBoundary>
  )
}
