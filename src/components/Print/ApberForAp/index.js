// @flow
import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

import ErrorBoundary from '../../shared/ErrorBoundary'
import getActiveNodes from '../../../modules/getActiveNodes'
import dataGql from './data.graphql'
import Ziele from './Ziele'

const LoadingContainer = styled.div`
  padding: 15px;
  height: 100%;
`
const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;
  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  /* set dimensions */
  height: 29.7cm;
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: inherit;
    width: inherit;

    margin: 0 !important;
    padding: 0.5cm !important;
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const ContentContainer = styled.div`
  padding: 1.5cm;
  font-size: 14px;
`
const Header = styled.p`
  font-size: 12px;
`
const Title1 = styled.h3`
  font-size: 14px;
  font-weight: 800;
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
`
const FieldRow = styled.div`
  display: flex;
  padding: 0.2cm 0;
`
const FieldRowBold = styled(FieldRow)`
  font-weight: 800;
`
const FieldLabel = styled.label`
  width: 5.5cm;
  padding-right: 0.5cm;
`
const Field = styled.div`
  width: 100%;
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


type Props = {
  activeNodeArray: Array<String>,
  dimensions: Object,
  errors: Object,
}

class ApberPrint extends Component<Props> {
  constructor(props) {
    super(props)
    this.container = createRef()
  }

  render() {
    const { activeNodeArray } = this.props
    const { /*projekt: projId, */ap: apId, apber: apberId } = getActiveNodes(activeNodeArray)

    return (
      <Query
        query={dataGql}
        variables={{ apId, apberId }}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Container>
                <LoadingContainer>Lade...</LoadingContainer>
              </Container>
            )
          if (error) return `Fehler: ${error.message}`

          console.log('ApberForAp, data:', data)
          const artname = get(data, 'apById.aeEigenschaftenByArtId.artname', '(Art fehlt)')
          //const ap = get(data, 'apById')
          const apber = get(data, 'apById.apbersByApId.nodes[0]')
          const apberDatum = get(apber, 'datum')
          const erfkrit = sortBy(
            get(data, 'apById.erfkritsByApId.nodes'),
            e => get(e, 'apErfkritWerteByErfolg.sort')
          )
          const ziele = sortBy(
            get(data, 'apById.zielsByApId.nodes'),
            e => get(e, 'zielTypWerteByTyp.sort')
          ).filter(
            e => e.jahr === apber.jahr
          )

          return (
            <ErrorBoundary>
              <Container innerRef={this.container}>
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
                    <p>{`Erste Massnahme im Jahr: ${get(data, 'allVApberErstemassnjahrs.nodes[0].jahr', '(Jahr fehlt)')}`}</p>
                  </Row>

                  <Title1>A. Grundmengen</Title1>

                  <Title1>B. Bestandesentwicklung</Title1>

                  <Title1>C. Zwischenbilanz zur Wirkung von Massnahmen</Title1>
                  <TitledLabel></TitledLabel>

                  <Title1>D. Einschätzung der Wirkung des AP insgesamt auf die Art</Title1>
                  <FieldRow>
                    <FieldLabel>Einschätzung der Wirkung des AP insgesamt auf die Art</FieldLabel>
                    <Field>{get(apber, 'wirkungAufArt', '')}</Field>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>Vergleich zu Vorjahr - Ausblick auf Gesamtziel</FieldLabel>
                    <Field>{get(apber, 'vergleichVorjahrGesamtziel', '')}</Field>
                  </FieldRow>
                  <Ziele ziele={ziele} />
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
                  <FieldRowBold>
                    <FieldLabel>Beurteilung</FieldLabel>
                    <Field>{get(apber, 'apErfkritWerteByBeurteilung.text', '')}</Field>
                  </FieldRowBold>
                  <FieldRow>
                    <FieldLabel>Analyse</FieldLabel>
                    <Field>{get(apber, 'apberAnalyse', '')}</Field>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>Konsequenzen für die Umsetzung</FieldLabel>
                    <Field>{get(apber, 'konsequenzenUmsetzung', '')}</Field>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>Konsequenzen für die Erfolgskontrolle</FieldLabel>
                    <Field>{get(apber, 'konsequenzenErfolgskontrolle', '')}</Field>
                  </FieldRow>
                  <Row>{`${apberDatum ? format(apberDatum, 'DD.MM.YYYY') : '(Datum fehlt)'} / ${get(apber, 'adresseByBearbeiter.name')}`}</Row>

                </ContentContainer>
              </Container>
            </ErrorBoundary>
          )
        }}
      </Query>
    )
  }
}

export default ApberPrint
