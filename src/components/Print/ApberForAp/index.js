// @flow
import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import AutoComplete from '../../../shared/Autocomplete'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
  column-width: ${props =>
    props.width > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

type Props = {
  id: String,
  dimensions: Object,
  saveToDb: () => void,
  errors: Object,
}

class ApberPrint extends Component<Props> {
  constructor(props) {
    super(props)
    this.container = createRef()
  }

  render() {
    const {
      id,
      dimensions = { width: 380 },
    } = this.props

    return (
      <Query query={dataGql} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Container>
                <FieldsContainer>Lade...</FieldsContainer>
              </Container>
            )
          if (error) return `Fehler: ${error.message}`

          const veraenGegenVorjahrWerte = [
            { value: '+', label: '+' },
            { value: '-', label: '-' },
          ]
          const width = isNaN(dimensions.width) ? 380 : dimensions.width
          const row = get(data, 'apberById')
          let beurteilungWerte = get(data, 'allApErfkritWertes.nodes', [])
          beurteilungWerte = sortBy(beurteilungWerte, 'sort')
          beurteilungWerte = beurteilungWerte.map(el => ({
            value: el.code,
            label: el.text,
          }))
          let adressenWerte = get(data, 'allAdresses.nodes', [])
          adressenWerte = sortBy(adressenWerte, 'name')
          adressenWerte = adressenWerte.map(el => ({
            id: el.id,
            value: el.name,
          }))

          return (
            <ErrorBoundary>
              <Container innerRef={this.container}>
                <FormTitle apId={row.apId} title="AP-Bericht Druckversion" />
                <FieldsContainer width={width}>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                  />
                  <TextField
                    key={`${row.id}vergleichVorjahrGesamtziel`}
                    label="Vergleich Vorjahr - Gesamtziel"
                    value={row.vergleichVorjahrGesamtziel}
                    type="text"
                    multiLine
                  />
                  <RadioButtonGroup
                    key={`${row.id}beurteilung`}
                    value={row.beurteilung}
                    label="Beurteilung"
                    dataSource={beurteilungWerte}
                  />
                  <RadioButtonGroup
                    key={`${row.id}veraenderungZumVorjahr`}
                    value={row.veraenderungZumVorjahr}
                    label="Veränderung zum Vorjahr"
                    dataSource={veraenGegenVorjahrWerte}
                  />
                  <TextField
                    key={`${row.id}apberAnalyse`}
                    label="Analyse"
                    value={row.apberAnalyse}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}konsequenzenUmsetzung`}
                    label="Konsequenzen für die Umsetzung"
                    value={row.konsequenzenUmsetzung}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}konsequenzenErfolgskontrolle`}
                    label="Konsequenzen für die Erfolgskontrolle"
                    value={row.konsequenzenErfolgskontrolle}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}biotopeNeue`}
                    label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
                    value={row.biotopeNeue}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}biotopeOptimieren`}
                    label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
                    value={row.biotopeOptimieren}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}massnahmenApBearb`}
                    label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
                    value={row.massnahmenApBearb}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}massnahmenPlanungVsAusfuehrung`}
                    label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
                    value={row.massnahmenPlanungVsAusfuehrung}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}massnahmenOptimieren`}
                    label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
                    value={row.massnahmenOptimieren}
                    type="text"
                    multiLine
                  />
                  <TextField
                    key={`${row.id}wirkungAufArt`}
                    label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
                    value={row.wirkungAufArt}
                    type="text"
                    multiLine
                  />
                  <DateFieldWithPicker
                    key={`${row.id}datum`}
                    label="Datum"
                    value={row.datum}
                  />
                  <AutoComplete
                    key={`${row.id}bearbeiter`}
                    label="BearbeiterIn"
                    value={get(row, 'adresseByBearbeiter.name', '')}
                    objects={adressenWerte}
                    openabove
                  />
                </FieldsContainer>
              </Container>
            </ErrorBoundary>
          )
        }}
      </Query>
    )
  }
}

export default ApberPrint
