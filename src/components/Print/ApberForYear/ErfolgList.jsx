import { Fragment } from 'react'
import styled from '@emotion/styled'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import {
  container,
  table,
  overallTitle,
  apTitle,
  ap as apClass,
  erfolgSpanningTitle,
  erfolgNicht,
  erfolgWenig,
  erfolgMaessig,
  erfolgGut,
  erfolgSehr,
  erfolgVeraenderung,
  erfolgUnsicher,
  erfolgNichtBeurteilt,
  keineMassnahme,
  apExists,
  keineMassnTitle,
  apExistsTitle,
  erfolgNichtBeurteiltTitle,
  erfolgNichtTitle,
  erfolgWenigTitle,
  erfolgMaessigTitle,
  erfolgGutTitle,
  erfolgSehrTitle,
  erfolgAenderungTitle,
  erfolgUnsicherTitle,
} from './ErfolgList.module.css'

const ErfolgSpanningTitle = styled.div`
  font-weight: 700;
  grid-column: 2 / span 7;
  grid-row: 1;
  text-align: center;
  padding-top: 4px;
`
const ErfolgNicht = styled.div`
  grid-column: 2;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgWenig = styled.div`
  grid-column: 3;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgMaessig = styled.div`
  grid-column: 4;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgGut = styled.div`
  grid-column: 5;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgSehr = styled.div`
  grid-column: 6;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgVeraenderung = styled.div`
  grid-column: 7;
  text-align: center;
  font-size: 0.8em;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgUnsicher = styled.div`
  grid-column: 8;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ErfolgNichtBeurteilt = styled.div`
  grid-column: 9;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const KeineMassnahme = styled.div`
  grid-column: 10;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const ApExists = styled.div`
  grid-column: 11;
  height: 1em;
  align-self: center;
  text-align: center;
  font-weight: 600;
  @media print {
    /* does not work - break is hideous :-( */
    page-break-inside: avoid;
  }
`
const KeineMassnTitle = styled.div`
  font-weight: 700;
  grid-column: 10;
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
  grid-column: 11;
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
  grid-column: 9;
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
  grid-column: 2;
  grid-row: 2;
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
  grid-column: 3;
  grid-row: 2;
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
  grid-column: 4;
  grid-row: 2;
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
  grid-column: 5;
  grid-row: 2;
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
  grid-column: 6;
  grid-row: 2;
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
  grid-column: 7;
  grid-row: 2;
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
  grid-column: 8;
  grid-row: 2;
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
      <div className={container}>
        <p className={overallTitle}>{`Erfolg ${jahr}`}</p>
        <div className={table}>
          <div className={apTitle}>Art</div>
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
                <div
                  className={apClass}
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.ap}
                </div>
                <ErfolgNicht
                  style={{
                    backgroundColor:
                      !!row.erfolgNicht ? 'red'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgNicht}
                </ErfolgNicht>
                <ErfolgWenig
                  style={{
                    backgroundColor:
                      !!row.erfolgWenig ? 'orange'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgWenig}
                </ErfolgWenig>
                <ErfolgMaessig
                  style={{
                    backgroundColor:
                      !!row.erfolgMaessig ? 'yellow'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgMaessig}
                </ErfolgMaessig>
                <ErfolgGut
                  style={{
                    backgroundColor:
                      !!row.erfolgGut ? '#00f6ff'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgGut}
                </ErfolgGut>
                <ErfolgSehr
                  style={{
                    backgroundColor:
                      !!row.erfolgSehr ? '#00ff00'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgSehr}
                </ErfolgSehr>
                <ErfolgVeraenderung
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.veraenderung}
                </ErfolgVeraenderung>
                <ErfolgUnsicher
                  style={{
                    backgroundColor:
                      !!row.erfolgUnsicher ? '#afafaf'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgUnsicher}
                </ErfolgUnsicher>
                <ErfolgNichtBeurteilt
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.nichtBeurteilt}
                </ErfolgNichtBeurteilt>
                <KeineMassnahme
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.keineMassnahme}
                </KeineMassnahme>
                <ApExists
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.apExists}
                </ApExists>
              </Fragment>
            )
          })}
        </div>
      </div>
    </ErrorBoundary>
  )
}
