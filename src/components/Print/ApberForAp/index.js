import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sum from 'lodash/sum'
import sortBy from 'lodash/sortBy'
import minBy from 'lodash/minBy'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import { MdPrint } from 'react-icons/md'
import Fab from '@material-ui/core/Fab'
import { useQuery } from '@apollo/client'
import MarkdownIt from 'markdown-it'

import queryMengen from './queryMengen'
import Ziele from './Ziele'
import Massnahmen from './Massnahmen'
import AMengen from './AMengen'
import BMengen from './BMengen'
import CMengen from './CMengen'
import storeContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'
import PopMenge from '../../Projekte/Daten/Ap/Auswertung/PopMenge'
import PopStatus from '../../Projekte/Daten/Ap/Auswertung/PopStatus'
import TpopKontrolliert from '../../Projekte/Daten/Ap/Auswertung/TpopKontrolliert'

const mdParser = new MarkdownIt({ breaks: true })

const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: ${(props) => (props.issubreport ? '0' : '1cm auto')};
  margin-left: ${(props) =>
    props.issubreport ? '-0.75cm !important' : '1cm auto'};
  /* Define a white paper background that sticks out from the darker overall background */
  background: ${(props) => (props.issubreport ? 'rgba(0, 0, 0, 0)' : '#fff')};
  /* Show a drop shadow beneath each page */
  box-shadow: ${(props) =>
    props.issubreport ? 'unset' : '0 4px 5px rgba(75, 75, 75, 0.2)'};

  /* set dimensions */
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: auto !important;
    overflow: visible !important;
    width: 21cm;

    margin: 0 !important;
    padding: ${(props) => (props.issubreport ? '0' : '0.5cm !important')};
    /*padding-left: 0 !important;*/
    /* try this */
    page-break-before: always !important;

    box-shadow: unset;
  }
`
const ContentContainer = styled.div`
  padding: 1.5cm;
  font-size: 14px;
  @media print {
    padding: 0;
    height: auto !important;
    overflow: visible !important;
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
  padding-bottom: 8px;
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
const StyledFab = styled(Fab)`
  position: fixed !important;
  top: 74px;
  right: 20px;
  > span {
    height: 24px;
    width: 24px;
  }
  > span > svg {
    height: 24px;
    width: 24px;
  }
  @media print {
    display: none !important;
  }
`
const ChartContainer = styled.div`
  padding: 10px 0;
`

const ApberForAp = ({
  apId,
  jahr,
  apData: apDataPassed,
  /**
   * when ApberForAp is called from ApberForYear
   * isSubReport is passed
   */
  isSubReport,
  // and need to build print button only once
  // so only when index is 0
  subReportIndex,
}) => {
  const store = useContext(storeContext)
  const { setIsPrint } = store

  const apData = isSubReport ? apDataPassed : apDataPassed.apById
  const artname = get(apData, 'aeTaxonomyByArtId.artname', '(Art fehlt)')
  const apber = get(apData, 'apbersByApId.nodes[0]', {})
  const apberDatum = get(apber, 'datum')
  const erfkrit = sortBy(get(apData, 'erfkritsByApId.nodes', []), (e) =>
    get(e, 'apErfkritWerteByErfolg.sort'),
  )
  const ziele = sortBy(get(apData, 'zielsByApId.nodes', []), (e) => [
    get(e, 'zielTypWerteByTyp.sort'),
    e.bezeichnung,
  ])
  const pops = get(apData, 'popsByApId.nodes', [])
  const tpops = flatten(pops.map((p) => get(p, 'tpopsByPopId.nodes', [])))
  const massns = sortBy(
    flatten(tpops.map((t) => get(t, 'tpopmassnsByTpopId.nodes', []))),
    (m) => [
      get(m, 'tpopByTpopId.popByPopId.nr'),
      get(m, 'tpopByTpopId.nr'),
      get(m, 'datum'),
      get(m, 'tpopmassnTypWerteByTyp.text'),
      get(m, 'beschreibung'),
    ],
  )
  const firstMassn = minBy(
    flatten(tpops.map((t) => get(t, 'firstTpopmassn.nodes[0]', []))),
    'datum',
  )
  const yearOfFirstMassn = !!firstMassn
    ? format(new Date(firstMassn.datum), 'yyyy')
    : 0
  const firstTpopber = minBy(
    flatten(tpops.map((t) => get(t, 'firstTpopber.nodes[0]', []))),
    'jahr',
  )
  const yearOfFirstTpopber = !!firstTpopber ? firstTpopber.jahr : 0
  const startJahr = get(apData, 'startJahr', 0)

  const mengenResult = useQuery(queryMengen, {
    variables: { apId, startJahr, jahr },
  })

  const onClickPrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsPrint(true)
      setTimeout(() => {
        window.print()
        setIsPrint(false)
      })
    }
  }, [setIsPrint])

  const { data, error, loading } = mengenResult
  const a3LPop = get(data, 'apById.a3LPop.totalCount', 0)
  const a3LTpop = sum(
    get(data, 'apById.a3LTpop.nodes', []).map((p) =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const a4LPop = get(data, 'apById.a4LPop.totalCount', 0)
  const a4LTpop = sum(
    get(data, 'apById.a4LTpop.nodes', []).map((p) =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const a5LPop = get(data, 'apById.a5LPop.totalCount', 0)
  const a5LTpop = sum(
    get(data, 'apById.a5LTpop.nodes', []).map((p) =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const a7LPop = get(data, 'apById.a7LPop.totalCount', 0)
  const a7LTpop = sum(
    get(data, 'apById.a7LTpop.nodes', []).map((p) =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const a8LPop = get(data, 'apById.a8LPop.totalCount', 0)
  const a8LTpop = sum(
    get(data, 'apById.a8LTpop.nodes', []).map((p) =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const a9LPop = get(data, 'apById.a9LPop.totalCount', 0)
  const a9LTpop = sum(
    get(data, 'apById.a9LTpop.nodes', []).map((p) =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const a10LPop = get(data, 'apById.a10LPop.totalCount', 0)
  const a10LTpop = sum(
    get(data, 'apById.a10LTpop.nodes', []).map((p) =>
      get(p, 'tpopsByPopId.totalCount'),
    ),
  )
  const a1LPop = a3LPop + a4LPop + a5LPop + a7LPop + a8LPop + a9LPop
  const a1LTpop = a3LTpop + a4LTpop + a5LTpop + a7LTpop + a8LTpop + a9LTpop
  const a2LPop = a3LPop + a4LPop + a5LPop
  const a2LTpop = a3LTpop + a4LTpop + a5LTpop
  const a6LPop = a7LPop + a8LPop
  const a6LTpop = a7LTpop + a8LTpop

  if (error) return `Fehler beim Laden der Daten: ${error.message}`

  if (startJahr === 0)
    return (
      <ErrorBoundary>
        <Container issubreport={isSubReport}>
          <ContentContainer>
            Bitte beim AP ein Startjahr ergänzen!
          </ContentContainer>
        </Container>
      </ErrorBoundary>
    )

  return (
    <ErrorBoundary>
      <Container issubreport={isSubReport}>
        {!subReportIndex && (
          <StyledFab
            onClick={onClickPrint}
            title="drucken"
            aria-label="drucken"
            color="primary"
          >
            <MdPrint />
          </StyledFab>
        )}
        <ContentContainer>
          <Header>
            {`Jahresbericht ${get(apber, 'jahr', '(Jahr fehlt)')},
              ${artname},
              ${format(new Date(), 'dd.MM.yyyy')}`}
          </Header>

          <Title1>{artname}</Title1>

          <Row>
            <p>{`Start Programm: ${get(
              apData,
              'startJahr',
              '(Start-Jahr fehlt)',
            )}`}</p>
            <p>{`Erste Massnahme: ${yearOfFirstMassn}`}</p>
            <p>{`Erste Kontrolle: ${yearOfFirstTpopber}`}</p>
          </Row>

          <AMengen
            loading={loading}
            jahr={jahr}
            a1LPop={a1LPop}
            a1LTpop={a1LTpop}
            a2LPop={a2LPop}
            a2LTpop={a2LTpop}
            a3LPop={a3LPop}
            a3LTpop={a3LTpop}
            a4LPop={a4LPop}
            a4LTpop={a4LTpop}
            a5LPop={a5LPop}
            a5LTpop={a5LTpop}
            a6LPop={a6LPop}
            a6LTpop={a6LTpop}
            a7LPop={a7LPop}
            a7LTpop={a7LTpop}
            a8LPop={a8LPop}
            a8LTpop={a8LTpop}
            a9LPop={a9LPop}
            a9LTpop={a9LTpop}
            a10LPop={a10LPop}
            a10LTpop={a10LTpop}
          />
          {!!apber.biotopeNeue && (
            <FieldRowFullWidth>
              <TitledLabel>
                Bemerkungen / Folgerungen für nächstes Jahr: neue Biotope
              </TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(get(apber, 'biotopeNeue', '')),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}
          <BMengen apId={apId} jahr={jahr} mengenResult={mengenResult} />
          <ChartContainer>
            <TpopKontrolliert id={apId} height={250} print />
          </ChartContainer>
          <ChartContainer>
            <PopStatus id={apId} height={250} print />
          </ChartContainer>
          <ChartContainer>
            <PopMenge id={apId} height={250} print />
          </ChartContainer>
          {!!apber.biotopeOptimieren && (
            <FieldRowFullWidth>
              <TitledLabel>
                Bemerkungen / Folgerungen für nächstes Jahr: Optimierung Biotope
              </TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      get(apber, 'biotopeOptimieren', ''),
                    ),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}

          <CMengen
            jahr={jahr}
            startJahr={startJahr}
            mengenResult={mengenResult}
          />
          {!!apber.massnahmenPlanungVsAusfuehrung && (
            <FieldRowFullWidth>
              <TitledLabel>Vergleich Ausführung/Planung</TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      get(apber, 'massnahmenPlanungVsAusfuehrung', ''),
                    ),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}
          {!!apber.massnahmenOptimieren && (
            <FieldRowFullWidth>
              <TitledLabel>
                Bemerkungen / Folgerungen für nächstes Jahr: Optimierung
                Massnahmen
              </TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      get(apber, 'massnahmenOptimieren', ''),
                    ),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}
          {!!apber.massnahmenApBearb && (
            <FieldRowFullWidth>
              <TitledLabel>
                Weitere Aktivitäten der Aktionsplan-Verantwortlichen
              </TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      get(apber, 'massnahmenApBearb', ''),
                    ),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}
          {!!massns.length && <Massnahmen massns={massns} />}

          <Title1>
            D. Einschätzung der Wirkung des AP insgesamt auf die Art
          </Title1>
          {!!apber.vergleichVorjahrGesamtziel && (
            <FieldRow>
              <FieldLabel>
                Vergleich zu Vorjahr - Ausblick auf Gesamtziel
              </FieldLabel>
              <Field>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      get(apber, 'vergleichVorjahrGesamtziel', ''),
                    ),
                  }}
                />
              </Field>
            </FieldRow>
          )}
          {!!ziele.length && <Ziele ziele={ziele} />}
          {!!erfkrit.length && (
            <FieldRow>
              <FieldLabel>Beurteilungsskala</FieldLabel>
              <Field>
                {erfkrit.map((e) => (
                  <ErfkritRow key={e.id}>
                    <ErfkritErfolg>{`${get(
                      e,
                      'apErfkritWerteByErfolg.text',
                      '(fehlt)',
                    )}:`}</ErfkritErfolg>
                    <ErfkritKriterium>
                      {e.kriterien || '(fehlt)'}
                    </ErfkritKriterium>
                  </ErfkritRow>
                ))}
              </Field>
            </FieldRow>
          )}
          {!!apber.apErfkritWerteByBeurteilung && (
            <FieldRowBold>
              <FieldLabel>Beurteilung</FieldLabel>
              <Field>
                {get(apber, 'apErfkritWerteByBeurteilung.text', '')}
              </Field>
            </FieldRowBold>
          )}
          {!!apber.wirkungAufArt && (
            <FieldRow>
              <FieldLabel>Bemerkungen</FieldLabel>
              <Field>{get(apber, 'wirkungAufArt', '')}</Field>
            </FieldRow>
          )}
          {!!apber.apberAnalyse && (
            <FieldRow>
              <FieldLabel>Analyse</FieldLabel>
              <Field>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(get(apber, 'apberAnalyse', '')),
                  }}
                />
              </Field>
            </FieldRow>
          )}
          {!!apber.konsequenzenUmsetzung && (
            <FieldRow>
              <FieldLabel>Konsequenzen für die Umsetzung</FieldLabel>
              <Field>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      get(apber, 'konsequenzenUmsetzung', ''),
                    ),
                  }}
                />
              </Field>
            </FieldRow>
          )}
          {!!apber.konsequenzenErfolgskontrolle && (
            <FieldRow>
              <FieldLabel>Konsequenzen für die Erfolgskontrolle</FieldLabel>
              <Field>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      get(apber, 'konsequenzenErfolgskontrolle', ''),
                    ),
                  }}
                />
              </Field>
            </FieldRow>
          )}
          <Row>
            {`${
              apberDatum
                ? format(new Date(apberDatum), 'dd.MM.yyyy')
                : '(Datum fehlt)'
            } / ${get(apber, 'adresseByBearbeiter.name', '(kein Bearbeiter)')}`}
          </Row>
        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default ApberForAp
