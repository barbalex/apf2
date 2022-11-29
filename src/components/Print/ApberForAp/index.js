import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import sortBy from 'lodash/sortBy'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import { MdPrint } from 'react-icons/md'
import Fab from '@mui/material/Fab'
import MarkdownIt from 'markdown-it'

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

const NoDataContainer = styled.div`
  margin: 1cm;
`
const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: ${(props) => (props.issubreport ? '0' : '1cm auto')};
  margin-left: ${(props) => (props.issubreport ? '0 !important' : '1cm auto')};
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
  padding: ${(props) => (props.issubreport ? '1.5cm 0 1.5cm 0' : '1.5cm')};
  width: ${(props) => (props.issubreport ? '18cm' : 'unset')};
  font-size: 14px;
  @media print {
    padding: 0;
    padding: ${(props) => (props.issubreport ? '0' : '0 1.5cm')};
    width: 21cm;
    height: auto !important;
    overflow: visible !important;
  }
`
const Header = styled.p`
  font-size: 12px;
`
const Title1 = styled.h3`
  font-size: 16px;
  font-weight: 700;
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
  font-weight: 700;
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
  @media print {
    break-inside: avoid;
  }
`

const ApberForAp = ({
  apId,
  jahr,
  apData: apDataPassed,
  node,
  /**
   * when ApberForAp is called from ApberForYear
   * isSubReport is passed
   */
  isSubReport = false,
  // and need to build print button only once
  // so only when index is 0
  subReportIndex,
}) => {
  const store = useContext(storeContext)
  const { setIsPrint } = store

  const apData = isSubReport ? apDataPassed : apDataPassed.apById
  const apber = apData?.apbersByApId?.nodes?.[0] ?? {}
  const apberDatum = apber?.datum
  const erfkrit = sortBy(
    apData?.erfkritsByApId?.nodes ?? [],
    (e) => e?.apErfkritWerteByErfolg?.sort,
  )
  const ziele = sortBy(apData?.zielsByApId?.nodes ?? [], (e) => [
    e?.zielTypWerteByTyp?.sort,
    e.bezeichnung,
  ])
  const pops = apData?.popsByApId?.nodes ?? []
  const tpops = flatten(pops.map((p) => p?.tpopsByPopId?.nodes ?? []))
  const massns = sortBy(
    flatten(tpops.map((t) => t?.tpopmassnsByTpopId?.nodes ?? [])),
    (m) => [
      m?.tpopByTpopId?.popByPopId.nr,
      m?.tpopByTpopId?.nr,
      m?.datum,
      m?.tpopmassnTypWerteByTyp?.text,
      m?.beschreibung,
    ],
  )

  const onClickPrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsPrint(true)
      // need a long enough timeout
      // because the component is loaded anew
      setTimeout(() => {
        window.print()
        setIsPrint(false)
      })
    }
  }, [setIsPrint])

  if (!node) {
    return (
      <NoDataContainer issubreport={isSubReport}>
        <div>Sorry, es gibt nicht ausreichend Daten.</div>
        <div>
          Kann es sein, dass es sich nicht um einen gültigen Aktionsplan
          handelt?
        </div>
      </NoDataContainer>
    )
  }

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
        <ContentContainer issubreport={isSubReport}>
          <Header>
            {`Jahresbericht ${jahr},
              ${node?.artname ?? ''},
              ${format(new Date(), 'dd.MM.yyyy')}`}
          </Header>

          <Title1>{node?.artname ?? ''}</Title1>

          <Row>
            <p>{`Start Programm: ${
              node?.startJahr ?? '(Start-Jahr fehlt)'
            }`}</p>
            <p>{`Erste Massnahme: ${node?.firstMassn ?? ''}`}</p>
            <p>{`Erste Kontrolle: ${node?.b1FirstYear ?? ''}`}</p>
          </Row>

          <AMengen loading={false} node={node} jahr={jahr} />
          {!!apber.biotopeNeue && (
            <FieldRowFullWidth>
              <TitledLabel>
                Bemerkungen / Folgerungen für nächstes Jahr: neue Biotope
              </TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.biotopeNeue ?? ''),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}
          <BMengen apId={apId} jahr={jahr} loading={false} node={node} />
          <ChartContainer>
            <TpopKontrolliert id={apId} jahr={jahr} height={250} print />
          </ChartContainer>
          <ChartContainer>
            <PopStatus id={apId} year={jahr} height={250} print />
          </ChartContainer>
          <ChartContainer>
            <PopMenge id={apId} jahr={jahr} height={250} print />
          </ChartContainer>
          {!!apber.biotopeOptimieren && (
            <FieldRowFullWidth>
              <TitledLabel>
                Bemerkungen / Folgerungen für nächstes Jahr: Optimierung Biotope
              </TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.biotopeOptimieren ?? ''),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}

          <CMengen jahr={jahr} loading={false} node={node} />
          {!!apber.massnahmenPlanungVsAusfuehrung && (
            <FieldRowFullWidth>
              <TitledLabel>Vergleich Ausführung/Planung</TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      apber?.massnahmenPlanungVsAusfuehrung ?? '',
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
                    __html: mdParser.render(apber?.massnahmenOptimieren ?? ''),
                  }}
                />
              </FullWidthField>
            </FieldRowFullWidth>
          )}
          {!!apber.massnahmenApBearb && (
            <FieldRowFullWidth>
              <TitledLabel>
                Weitere Aktivitäten der Art-Verantwortlichen
              </TitledLabel>
              <FullWidthField>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.massnahmenApBearb ?? ''),
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
                      apber?.vergleichVorjahrGesamtziel ?? '',
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
                    <ErfkritErfolg>{`${
                      e?.apErfkritWerteByErfolg?.text ?? '(fehlt)'
                    }:`}</ErfkritErfolg>
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
              <Field>{apber?.apErfkritWerteByBeurteilung?.text ?? ''}</Field>
            </FieldRowBold>
          )}
          {!!apber.wirkungAufArt && (
            <FieldRow>
              <FieldLabel>Bemerkungen</FieldLabel>
              <Field>{apber?.wirkungAufArt ?? ''}</Field>
            </FieldRow>
          )}
          {!!apber.apberAnalyse && (
            <FieldRow>
              <FieldLabel>Analyse</FieldLabel>
              <Field>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.apberAnalyse ?? ''),
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
                    __html: mdParser.render(apber?.konsequenzenUmsetzung ?? ''),
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
                      apber?.konsequenzenErfolgskontrolle ?? '',
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
            } / ${node?.bearbeiter ?? '(kein Bearbeiter)'}`}
          </Row>
        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default ApberForAp
