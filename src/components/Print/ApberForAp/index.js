import React from "react"
import styled from "styled-components"
import get from "lodash/get"
import sortBy from "lodash/sortBy"
import minBy from "lodash/minBy"
import flatten from "lodash/flatten"
import format from "date-fns/format"

import ErrorBoundary from "../../shared/ErrorBoundary"
import Ziele from "./Ziele"
import Massnahmen from "./Massnahmen"
import AMengen from "./AMengen"
import BMengen from "./BMengen"
import CMengen from "./CMengen"

const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: ${props => (props.issubreport ? "0" : "1cm auto")};
  margin-left: ${props =>
    props.issubreport ? "-0.75cm !important" : "1cm auto"};
  /* Define a white paper background that sticks out from the darker overall background */
  background: ${props => (props.issubreport ? "rgba(0, 0, 0, 0)" : "#fff")};
  /* Show a drop shadow beneath each page */
  box-shadow: ${props =>
    props.issubreport ? "unset" : "0 4px 5px rgba(75, 75, 75, 0.2)"};

  /* set dimensions */
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: auto !important;
    overflow: visible !important;
    width: 21cm;

    margin: 0 !important;
    padding: ${props => (props.issubreport ? "0" : "0.5cm !important")};
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

const ApberForAp = ({
  apId,
  jahr,
  apData: apDataPassed,
  /**
   * when ApberForAp is called from ApberForYear
   * isSubReport is passed
   */
  isSubReport,
}) => {
  const apData = isSubReport ? apDataPassed : apDataPassed.apById
  const artname = get(apData, "aeEigenschaftenByArtId.artname", "(Art fehlt)")
  const apber = get(apData, "apbersByApId.nodes[0]", {})
  const apberDatum = get(apber, "datum")
  const erfkrit = sortBy(get(apData, "erfkritsByApId.nodes", []), e =>
    get(e, "apErfkritWerteByErfolg.sort")
  )
  const ziele = sortBy(get(apData, "zielsByApId.nodes", []), e => [
    get(e, "zielTypWerteByTyp.sort"),
    e.bezeichnung,
  ])
  const pops = get(apData, "popsByApId.nodes", [])
  const tpops = flatten(pops.map(p => get(p, "tpopsByPopId.nodes", [])))
  const massns = sortBy(
    flatten(tpops.map(t => get(t, "tpopmassnsByTpopId.nodes", []))),
    m => [
      get(m, "tpopByTpopId.popByPopId.nr"),
      get(m, "tpopByTpopId.nr"),
      get(m, "datum"),
      get(m, "tpopmassnTypWerteByTyp.text"),
      get(m, "beschreibung"),
    ]
  )
  const firstMassn = minBy(
    flatten(tpops.map(t => get(t, "firstTpopmassn.nodes[0]", []))),
    "datum"
  )
  const yearOfFirstMassn = !!firstMassn
    ? format(new Date(firstMassn.datum), "yyyy")
    : 0
  const firstTpopber = minBy(
    flatten(tpops.map(t => get(t, "firstTpopber.nodes[0]", []))),
    "jahr"
  )
  const yearOfFirstTpopber = !!firstTpopber ? firstTpopber.jahr : 0
  const startJahr = get(apData, "startJahr", 0)

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
        <ContentContainer>
          <Header>
            {`Jahresbericht ${get(apber, "jahr", "(Jahr fehlt)")},
              ${artname},
              ${format(new Date(), "dd.MM.yyyy")}`}
          </Header>

          <Title1>{artname}</Title1>

          <Row>
            <p>{`Start Programm: ${get(
              apData,
              "startJahr",
              "(Start-Jahr fehlt)"
            )}`}</p>
            <p>{`Erste Massnahme: ${yearOfFirstMassn}`}</p>
            <p>{`Erste Kontrolle: ${yearOfFirstTpopber}`}</p>
          </Row>

          <AMengen apId={apId} jahr={jahr} startJahr={startJahr} />
          {!!apber.biotopeNeue && (
            <FieldRowFullWidth>
              <TitledLabel>
                Bemerkungen / Folgerungen für nächstes Jahr: neue Biotope
              </TitledLabel>
              <FullWidthField>{get(apber, "biotopeNeue", "")}</FullWidthField>
            </FieldRowFullWidth>
          )}

          <BMengen apId={apId} jahr={jahr} startJahr={startJahr} />
          {!!apber.biotopeOptimieren && (
            <FieldRowFullWidth>
              <TitledLabel>
                Bemerkungen / Folgerungen für nächstes Jahr: Optimierung Biotope
              </TitledLabel>
              <FullWidthField>
                {get(apber, "biotopeOptimieren", "")}
              </FullWidthField>
            </FieldRowFullWidth>
          )}

          <CMengen apId={apId} jahr={jahr} startJahr={startJahr} />
          {!!apber.massnahmenPlanungVsAusfuehrung && (
            <FieldRowFullWidth>
              <TitledLabel>Vergleich Ausführung/Planung</TitledLabel>
              <FullWidthField>
                {get(apber, "massnahmenPlanungVsAusfuehrung", "")}
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
                {get(apber, "massnahmenOptimieren", "")}
              </FullWidthField>
            </FieldRowFullWidth>
          )}
          {!!apber.massnahmenApBearb && (
            <FieldRowFullWidth>
              <TitledLabel>
                Weitere Aktivitäten der Aktionsplan-Verantwortlichen
              </TitledLabel>
              <FullWidthField>
                {get(apber, "massnahmenApBearb", "")}
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
              <Field>{get(apber, "vergleichVorjahrGesamtziel", "")}</Field>
            </FieldRow>
          )}
          {!!ziele.length && <Ziele ziele={ziele} />}
          {!!erfkrit.length && (
            <FieldRow>
              <FieldLabel>Beurteilungsskala</FieldLabel>
              <Field>
                {erfkrit.map(e => (
                  <ErfkritRow key={e.id}>
                    <ErfkritErfolg>{`${get(
                      e,
                      "apErfkritWerteByErfolg.text",
                      "(fehlt)"
                    )}:`}</ErfkritErfolg>
                    <ErfkritKriterium>
                      {e.kriterien || "(fehlt)"}
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
                {get(apber, "apErfkritWerteByBeurteilung.text", "")}
              </Field>
            </FieldRowBold>
          )}
          {!!apber.wirkungAufArt && (
            <FieldRow>
              <FieldLabel>Bemerkungen</FieldLabel>
              <Field>{get(apber, "wirkungAufArt", "")}</Field>
            </FieldRow>
          )}
          {!!apber.apberAnalyse && (
            <FieldRow>
              <FieldLabel>Analyse</FieldLabel>
              <Field>{get(apber, "apberAnalyse", "")}</Field>
            </FieldRow>
          )}
          {!!apber.konsequenzenUmsetzung && (
            <FieldRow>
              <FieldLabel>Konsequenzen für die Umsetzung</FieldLabel>
              <Field>{get(apber, "konsequenzenUmsetzung", "")}</Field>
            </FieldRow>
          )}
          {!!apber.konsequenzenErfolgskontrolle && (
            <FieldRow>
              <FieldLabel>Konsequenzen für die Erfolgskontrolle</FieldLabel>
              <Field>{get(apber, "konsequenzenErfolgskontrolle", "")}</Field>
            </FieldRow>
          )}
          <Row>
            {`${
              apberDatum
                ? format(new Date(apberDatum), "dd.MM.yyyy")
                : "(Datum fehlt)"
            } / ${get(apber, "adresseByBearbeiter.name", "(kein Bearbeiter)")}`}
          </Row>
        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default ApberForAp
