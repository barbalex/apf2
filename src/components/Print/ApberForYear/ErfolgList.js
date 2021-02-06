import React, { Fragment } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  break-before: page;
  font-size: 11px;
  @media screen {
    margin-top: 3cm;
  }
  @media print {
    padding-top: 0.3cm !important;
    /* get background colors to show */
    -webkit-print-color-adjust: exact;
  }
`
const Table = styled.div`
  display: grid;
  grid-template-columns: 12fr repeat(10, 1fr);
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
  background-color: ${(props) => (props.val ? 'red' : 'unset')};
  font-weight: 600;
`
const ErfolgWenig = styled(Cell)`
  grid-column: 3 / span 1;
  text-align: center;
  background-color: ${(props) => (props.val ? 'orange' : 'unset')};
  font-weight: 600;
`
const ErfolgMaessig = styled(Cell)`
  grid-column: 4 / span 1;
  text-align: center;
  background-color: ${(props) => (props.val ? 'yellow' : 'unset')};
  font-weight: 600;
`
const ErfolgGut = styled(Cell)`
  grid-column: 5 / span 1;
  text-align: center;
  background-color: ${(props) => (props.val ? '#00f6ff' : 'unset')};
  font-weight: 600;
`
const ErfolgSehr = styled(Cell)`
  grid-column: 6 / span 1;
  text-align: center;
  background-color: ${(props) => (props.val ? '#00ff00' : 'unset')};
  font-weight: 600;
`
const ErfolgVeraenderung = styled(Cell)`
  grid-column: 7 / span 1;
  text-align: center;
  font-weight: 600;
`
const ErfolgUnsicher = styled(Cell)`
  grid-column: 8 / span 1;
  text-align: center;
  background-color: ${(props) => (props.val ? '#afafaf' : 'unset')};
  font-weight: 600;
`
const ErfolgNichtBeurteilt = styled(Cell)`
  grid-column: 9 / span 1;
  text-align: center;
  font-weight: 600;
`
const KeineMassnahme = styled(Cell)`
  grid-column: 10 / span 1;
  text-align: center;
  font-weight: 600;
`
const ApExists = styled(Cell)`
  grid-column: 11 / span 1;
  text-align: center;
  font-weight: 600;
`
const KeineMassnTitle = styled(Title)`
  grid-column: 10 / span 1;
  grid-row: 1 / span 2;
  writing-mode: vertical-lr;
  padding: 3px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 1em;
  }
`
const ApExistsTitle = styled(Title)`
  grid-column: 11 / span 1;
  grid-row: 1 / span 2;
  writing-mode: vertical-lr;
  padding: 3px;
  > div {
    transform: rotate(180deg);
    transform-origin: center center 0;
    line-height: 1em;
  }
`
const ErfolgNichtBeurteiltTitle = styled(Title)`
  grid-column: 9 / span 1;
  grid-row: 1 / span 2;
  writing-mode: vertical-lr;
  padding-bottom: 3px;
  padding-top: 3px;
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

const ErfolgList = ({ jahr, data }) => {
  const nodes = data?.jberAbc?.nodes ?? []
  const apRows = nodes.map((ap) => {
    const veraenderung =
      ap.erfolg === 1168274204 || ap.erfolgVorjahr === 1168274204
        ? ''
        : ap.erfolg - ap.erfolgVorjahr === 0
        ? ''
        : ap.erfolg - ap.erfolgVorjahr > 0
        ? '╋'
        : '―'

    return {
      ap: ap.artname,
      erfolgNicht: ap?.erfolg === 3 ? 'X' : '',
      erfolgWenig: ap?.erfolg === 6 ? 'X' : '',
      erfolgMaessig: ap?.erfolg === 5 ? 'X' : '',
      erfolgGut: ap?.erfolg === 1 ? 'X' : '',
      erfolgSehr: ap?.erfolg === 4 ? 'X' : '',
      erfolgUnsicher: ap?.erfolg === 1168274204 ? 'X' : '',
      nichtBeurteilt: ap?.erfolg === 0 ? 'X' : '',
      veraenderung,
      keineMassnahme: ap.c1LPop === 0 ? 'X' : '',
      apExists: ap.bearbeitung === 3 ? 'X' : '',
    }
  })

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
          {apRows.map((row) => (
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
              <ApExists val={!!row.apExists}>{row.apExists}</ApExists>
            </Fragment>
          ))}
        </Table>
      </Container>
    </ErrorBoundary>
  )
}

export default ErfolgList
