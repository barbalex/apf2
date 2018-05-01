// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import RadioButtonGroup from '../../../shared/RadioButtonGroupGql'
import TextField from '../../../shared/TextFieldGql'
import AutoComplete from '../../../shared/AutocompleteGql'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerGql'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import apberByIdGql from './apberById.graphql'
import updateApberByIdGql from './updateApberById.graphql'

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

const Apber = ({
  id,
  dimensions = { width: 380 },
}: {
  id: String,
  dimensions: Object,
}) => {
  const veraenGegenVorjahrWerte = [
    { value: '+', label: '+' },
    { value: '-', label: '-' },
  ]
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <Query query={apberByIdGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`

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
            <Container innerRef={c => (this.container = c)}>
              <FormTitle apId={row.apId} title="AP-Bericht" />
              <Mutation mutation={updateApberByIdGql}>
                {(updateApber, { data }) => (
                  <FieldsContainer width={width}>
                    <TextField
                      key={`${row.id}jahr`}
                      label="Jahr"
                      value={row.jahr}
                      type="number"
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            jahr: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}vergleichVorjahrGesamtziel`}
                      label="Vergleich Vorjahr - Gesamtziel"
                      value={row.vergleichVorjahrGesamtziel}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            vergleichVorjahrGesamtziel: value,
                          },
                        })
                      }
                    />
                    <RadioButtonGroup
                      key={`${row.id}beurteilung`}
                      value={row.beurteilung}
                      label="Beurteilung"
                      dataSource={beurteilungWerte}
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            beurteilung: value,
                          },
                        })
                      }
                    />
                    <RadioButtonGroup
                      key={`${row.id}veraenderungZumVorjahr`}
                      value={row.veraenderungZumVorjahr}
                      label="Veränderung zum Vorjahr"
                      dataSource={veraenGegenVorjahrWerte}
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            veraenderungZumVorjahr: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}apberAnalyse`}
                      label="Analyse"
                      value={row.apberAnalyse}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            apberAnalyse: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}konsequenzenUmsetzung`}
                      label="Konsequenzen für die Umsetzung"
                      value={row.konsequenzenUmsetzung}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            konsequenzenUmsetzung: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}konsequenzenErfolgskontrolle`}
                      label="Konsequenzen für die Erfolgskontrolle"
                      value={row.konsequenzenErfolgskontrolle}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            konsequenzenErfolgskontrolle: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}biotopeNeue`}
                      label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
                      value={row.biotopeNeue}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            biotopeNeue: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}biotopeOptimieren`}
                      label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
                      value={row.biotopeOptimieren}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            biotopeOptimieren: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}massnahmenApBearb`}
                      label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
                      value={row.massnahmenApBearb}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            massnahmenApBearb: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}massnahmenPlanungVsAusfuehrung`}
                      label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
                      value={row.massnahmenPlanungVsAusfuehrung}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            massnahmenPlanungVsAusfuehrung: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}massnahmenOptimieren`}
                      label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
                      value={row.massnahmenOptimieren}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            massnahmenOptimieren: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}wirkungAufArt`}
                      label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
                      value={row.wirkungAufArt}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            wirkungAufArt: value,
                          },
                        })
                      }
                    />
                    <DateFieldWithPicker
                      key={`${row.id}datum`}
                      label="Datum"
                      value={row.datum}
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            datum: value,
                          },
                        })
                      }
                    />
                    <AutoComplete
                      key={`${row.id}bearbeiter`}
                      label="BearbeiterIn"
                      value={get(row, 'adresseByBearbeiter.name', '')}
                      objects={adressenWerte}
                      saveToDb={value =>
                        updateApber({
                          variables: {
                            id,
                            bearbeiter: value,
                          },
                        })
                      }
                      openabove
                    />
                  </FieldsContainer>
                )}
              </Mutation>
            </Container>
          </ErrorBoundary>
        )
      }}
    </Query>
  )
}

export default Apber
