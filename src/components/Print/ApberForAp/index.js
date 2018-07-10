// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import merge from 'lodash/merge'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../shared/ErrorBoundary'
import getActiveNodes from '../../../modules/getActiveNodes'
import data2 from './data2'
import apberData from './apberData'
import Ziele from './Ziele'
import Massnahmen from './Massnahmen'
import AMengen from './AMengen'
import BMengen from './BMengen'
import CMengen from './CMengen'

const LoadingContainer = styled.div`
  padding: 15px;
  height: 100%;
`
const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: ${props => props.issubreport ? '0' : '1cm auto'};
  margin-left: ${props => props.issubreport ? '-0.75cm !important' : '1cm auto'};
  /* Define a white paper background that sticks out from the darker overall background */
  background: ${props => props.issubreport ? 'rgba(0, 0, 0, 0)' : '#fff'};
  /* Show a drop shadow beneath each page */
  box-shadow: ${props => props.issubreport ? 'unset' : '0 4px 5px rgba(75, 75, 75, 0.2)'};

  /* set dimensions */
  /*height: 29.7cm;*/
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: inherit;
    width: inherit;

    margin: 0 !important;
    padding: ${props => props.issubreport ? '0' : '0.5cm !important'};
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    
    box-shadow: unset;
    overflow: hidden;
  }
`
const ContentContainer = styled.div`
  padding: 1.5cm;
  font-size: 14px;
  @media print {
    padding: 0;
    overflow: hidden;
  }
`
const Header = styled.p`
  font-size: 12px;
`
const Title1 = styled.h3`
  font-size: 16px;
  font-weight: 800;
  break-after: avoid;
  page-break-after: avoid;
`
const TitledLabel = styled.label`
  text-decoration: underline;
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.2cm 0;
  p {
    margin: 0;
  }
  break-inside: avoid;
`
const FieldRow = styled.div`
  display: flex;
  padding: 0.2cm 0;
`
const FieldRowBold = styled(FieldRow)`
  font-weight: 800;
`
const FieldRowFullWidth = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2cm 0;
  break-inside: avoid;
`
const FullWidthField = styled.div`
  hyphens: auto;
`
const FieldLabel = styled.label`
  width: 5.5cm;
  padding-right: 0.5cm;
`
const Field = styled.div`
  width: 100%;
  hyphens: auto;
`
const ErfkritRow = styled.div`
  display: flex;
`
const ErfkritErfolg = styled.div`
  width: 5.5cm;
`
const ErfkritKriterium = styled.div`
  width: 100%;
`

const enhance = compose(
  withState('yearOfFirstTpopber', 'setYearOfFirstTpopber', null),
  withHandlers({
    onSetYearOfFirstTpopber: ({
      yearOfFirstTpopber,
      setYearOfFirstTpopber
    }) => year => {
      if (year !== yearOfFirstTpopber) {
        setYearOfFirstTpopber(year)
      }
    }
  }),
  apberData,
  data2,
)

const ApberForAp = ({
  activeNodeArray,
  dimensions,
  errors,
  apberData,
  data2,
  yearOfFirstTpopber,
  onSetYearOfFirstTpopber,
  /**
   * when ApberForAp is called from ApberForYear
   * apberId and apId are passed
   */
  apberId,
  apId: apIdPassedIn,
}:{
  activeNodeArray: Array<String>,
  dimensions: Object,
  errors: Object,
  apberData: Object,
  data2: Object,
  yearOfFirstTpopber: Number,
  onSetYearOfFirstTpopber: () => void,
  apberId: String,
  apId: String,
}) => {
  const { ap: apIdFromActiveNodes } = getActiveNodes(activeNodeArray)
  const apId = apIdPassedIn || apIdFromActiveNodes
  const issubreport = !!apIdPassedIn

  if (apberData.loading || data2.loading)
    return (
      <Container issubreport={issubreport}>
        <LoadingContainer>Lade...</LoadingContainer>
      </Container>
    )
  if (apberData.error) return `Fehler: ${apberData.error.message}`
  if (data2.error) return `Fehler: ${data2.error.message}`

  const data = merge(apberData, data2)
  const artname = get(data, 'apById.aeEigenschaftenByArtId.artname', '(Art fehlt)')
  const apber = get(data, 'apById.apbersByApId.nodes[0]', {})
  const apberDatum = get(apber, 'datum')
  const erfkrit = sortBy(
    get(data, 'apById.erfkritsByApId.nodes'),
    e => get(e, 'apErfkritWerteByErfolg.sort')
  )
  const ziele = sortBy(
    get(data, 'apById.zielsByApId.nodes'),
    e => [get(e, 'zielTypWerteByTyp.sort'), e.bezeichnung]
  )
  const pops = get(data, 'apById.popsByApId.nodes', [])
  const tpops = flatten(
    pops.map(p => get(p, 'tpopsByPopId.nodes', []))
  )
  const massns = sortBy(
    flatten(
      tpops.map(t => get(t, 'tpopmassnsByTpopId.nodes', []))
    ),
    (m) => [
      get(m, 'tpopByTpopId.popByPopId.nr'),
      get(m, 'tpopByTpopId.nr'),
      get(m, 'datum'),
      get(m, 'tpopmassnTypWerteByTyp.text'),
      get(m, 'beschreibung'),
    ]
  )
  const startJahr = get(data, 'apById.startJahr', 0)
  if (startJahr === 0) return (
    <ErrorBoundary>
      <Container issubreport={issubreport}>
        <ContentContainer>
          Bitte beim AP ein Startjahr ergänzen!
        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
  const jahr = get(apberData, 'apberById.jahr')

  return (
    <ErrorBoundary>
      <Container issubreport={issubreport}>
        <ContentContainer>
          <Header>
            {
              `Jahresbericht ${get(apber, 'jahr', '(Jahr fehlt)')},
              ${artname},
              ${format(new Date(), 'DD.MM.YYYY')}`
            }
          </Header>

          <Title1>{artname}</Title1>

          <Row>
            <p>{`Start Programm: ${get(data, 'apById.startJahr', '(Start-Jahr fehlt)')}`}</p>
            <p>{`Erste Massnahme: ${get(data, 'allVApberErstemassnjahrs.nodes[0].jahr', '(Jahr fehlt)')}`}</p>
            <p>{`Erste Kontrolle: ${yearOfFirstTpopber || '...'}`}</p>
          </Row>

          <AMengen apId={apId} jahr={jahr} startJahr={startJahr} />
          {
            !!apber.biotopeNeue &&
            <FieldRowFullWidth>
              <TitledLabel>Bemerkungen / Folgerungen für nächstes Jahr: neue Biotope</TitledLabel>
              <FullWidthField>{get(apber, 'biotopeNeue', '')}</FullWidthField>
            </FieldRowFullWidth>
          }

          <BMengen apId={apId} jahr={jahr} startJahr={startJahr} setYearOfFirstTpopber={onSetYearOfFirstTpopber} />
          {
            !!apber.massnahmenApBearb &&
            <FieldRowFullWidth>
              <TitledLabel>Weitere Aktivitäten der Aktionsplan-Verantwortlichen</TitledLabel>
              <FullWidthField>{get(apber, 'massnahmenApBearb', '')}</FullWidthField>
            </FieldRowFullWidth>
          }
          {
            !!apber.StringbiotopeOptimieren &&
            <FieldRowFullWidth>
              <TitledLabel>Bemerkungen / Folgerungen für nächstes Jahr: Optimierung Biotope</TitledLabel>
              <FullWidthField>{get(apber, 'biotopeOptimieren', '')}</FullWidthField>
            </FieldRowFullWidth>
          }

          <CMengen apId={apId} jahr={jahr} startJahr={startJahr} />
          {
            !!apber.massnahmenOptimieren &&
            <FieldRowFullWidth>
              <TitledLabel>Bemerkungen / Folgerungen für nächstes Jahr: Optimierung Massnahmen</TitledLabel>
              <FullWidthField>{get(apber, 'massnahmenOptimieren', '')}</FullWidthField>
            </FieldRowFullWidth>
          }
          {
            !!massns.length &&
            <Massnahmen massns={massns} />
          }

          <Title1>D. Einschätzung der Wirkung des AP insgesamt auf die Art</Title1>
          {
            !!apber.vergleichVorjahrGesamtziel &&
            <FieldRow>
              <FieldLabel>Vergleich zu Vorjahr - Ausblick auf Gesamtziel</FieldLabel>
              <Field>{get(apber, 'vergleichVorjahrGesamtziel', '')}</Field>
            </FieldRow>
          }
          {
            !!ziele.length &&
            <Ziele ziele={ziele} />
          }
          {
            !!erfkrit.length &&
            <FieldRow>
              <FieldLabel>Beurteilungsskala</FieldLabel>
              <Field>
                {
                  erfkrit.map(e =>
                    <ErfkritRow key={e.id}>
                      <ErfkritErfolg>{`${get(e, 'apErfkritWerteByErfolg.text', '(fehlt)')}:`}</ErfkritErfolg>
                      <ErfkritKriterium>{e.kriterien || '(fehlt)'}</ErfkritKriterium>
                    </ErfkritRow>
                  )
                }
              </Field>
            </FieldRow>
          }
          {
            !!apber.apErfkritWerteByBeurteilung &&
            <FieldRowBold>
              <FieldLabel>Beurteilung</FieldLabel>
              <Field>{get(apber, 'apErfkritWerteByBeurteilung.text', '')}</Field>
            </FieldRowBold>
          }
          {
            !!apber.wirkungAufArt &&
            <FieldRow>
              <FieldLabel>Bemerkungen</FieldLabel>
              <Field>{get(apber, 'wirkungAufArt', '')}</Field>
            </FieldRow>
          }
          {
            !!apber.apberAnalyse &&
            <FieldRow>
              <FieldLabel>Analyse</FieldLabel>
              <Field>{get(apber, 'apberAnalyse', '')}</Field>
            </FieldRow>
          }
          {
            !!apber.konsequenzenUmsetzung &&
            <FieldRow>
              <FieldLabel>Konsequenzen für die Umsetzung</FieldLabel>
              <Field>{get(apber, 'konsequenzenUmsetzung', '')}</Field>
            </FieldRow>
          }
          {
            !!apber.konsequenzenErfolgskontrolle &&
            <FieldRow>
              <FieldLabel>Konsequenzen für die Erfolgskontrolle</FieldLabel>
              <Field>{get(apber, 'konsequenzenErfolgskontrolle', '')}</Field>
            </FieldRow>
          }
          <Row>
            {`${apberDatum ? format(apberDatum, 'DD.MM.YYYY') : '(Datum fehlt)'} / ${get(apber, 'adresseByBearbeiter.name', '(kein Bearbeiter)')}`}
          </Row>

        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(ApberForAp)
