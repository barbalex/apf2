// @flow
import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data'
import updateApberByIdGql from './updateApberById'
import withAllAdresses from './withAllAdresses'
import withAllApErfkritWertes from './withAllApErfkritWertes'

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

const enhance = compose(
  withAllApErfkritWertes,
  withAllAdresses,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors }) => async ({
      row,
      field,
      value,
      updateApber,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateApber({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateApberById: {
              apber: {
                id: row.id,
                jahr: field === 'jahr' ? value : row.jahr,
                situation: field === 'situation' ? value : row.situation,
                vergleichVorjahrGesamtziel:
                  field === 'vergleichVorjahrGesamtziel'
                    ? value
                    : row.vergleichVorjahrGesamtziel,
                beurteilung: field === 'beurteilung' ? value : row.beurteilung,
                veraenderungZumVorjahr:
                  field === 'veraenderungZumVorjahr'
                    ? value
                    : row.veraenderungZumVorjahr,
                apberAnalyse:
                  field === 'apberAnalyse' ? value : row.apberAnalyse,
                konsequenzenUmsetzung:
                  field === 'konsequenzenUmsetzung'
                    ? value
                    : row.konsequenzenUmsetzung,
                konsequenzenErfolgskontrolle:
                  field === 'konsequenzenErfolgskontrolle'
                    ? value
                    : row.konsequenzenErfolgskontrolle,
                biotopeNeue: field === 'biotopeNeue' ? value : row.biotopeNeue,
                biotopeOptimieren:
                  field === 'biotopeOptimieren' ? value : row.biotopeOptimieren,
                massnahmenOptimieren:
                  field === 'massnahmenOptimieren'
                    ? value
                    : row.massnahmenOptimieren,
                wirkungAufArt:
                  field === 'wirkungAufArt' ? value : row.wirkungAufArt,
                datum: field === 'datum' ? value : row.datum,
                massnahmenApBearb:
                  field === 'massnahmenApBearb' ? value : row.massnahmenApBearb,
                massnahmenPlanungVsAusfuehrung:
                  field === 'massnahmenPlanungVsAusfuehrung'
                    ? value
                    : row.massnahmenPlanungVsAusfuehrung,
                apId: field === 'apId' ? value : row.apId,
                bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                apErfkritWerteByBeurteilung: row.apErfkritWerteByBeurteilung,
                adresseByBearbeiter: row.adresseByBearbeiter,
                __typename: 'Apber',
              },
              __typename: 'Apber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

type Props = {
  id: string,
  dimensions: Object,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
  dataAllAdresses: Object,
  dataAllApErfkritWertes: Object,
}

class Apber extends Component<Props> {
  constructor(props) {
    super(props)
    this.container = createRef()
  }

  render() {
    const {
      id,
      dimensions = { width: 380 },
      saveToDb,
      errors,
      treeName,
      dataAllAdresses,
      dataAllApErfkritWertes,
    } = this.props

    return (
      <Query query={dataGql} variables={{ id }}>
        {({ loading, error, data }) => {
          if (
            loading ||
            dataAllAdresses.loading ||
            dataAllApErfkritWertes.loading
          )
            return (
              <Container>
                <FieldsContainer>Lade...</FieldsContainer>
              </Container>
            )
          if (error) return `Fehler: ${error.message}`
          if (dataAllAdresses.error)
            return `Fehler: ${dataAllAdresses.error.message}`
          if (dataAllApErfkritWertes.error)
            return `Fehler: ${dataAllApErfkritWertes.error.message}`

          const veraenGegenVorjahrWerte = [
            { value: '+', label: '+' },
            { value: '-', label: '-' },
          ]
          const width = isNaN(dimensions.width) ? 380 : dimensions.width
          const row = get(data, 'apberById', {})
          let beurteilungWerte = get(
            dataAllApErfkritWertes,
            'allApErfkritWertes.nodes',
            [],
          )
          beurteilungWerte = sortBy(beurteilungWerte, 'sort')
          beurteilungWerte = beurteilungWerte.map(el => ({
            value: el.code,
            label: el.text,
          }))
          let adressenWerte = get(dataAllAdresses, 'allAdresses.nodes', [])
          adressenWerte = sortBy(adressenWerte, 'name')
          adressenWerte = adressenWerte.map(el => ({
            value: el.id,
            label: el.name,
          }))

          return (
            <ErrorBoundary>
              <Container innerRef={this.container}>
                <FormTitle
                  apId={row.apId}
                  title="AP-Bericht"
                  treeName={treeName}
                  table="apber"
                />
                <Mutation mutation={updateApberByIdGql}>
                  {(updateApber, { data }) => (
                    <FieldsContainer width={width}>
                      <TextField
                        key={`${row.id}jahr`}
                        label="Jahr"
                        value={row.jahr}
                        type="number"
                        saveToDb={value =>
                          saveToDb({ row, field: 'jahr', value, updateApber })
                        }
                        error={errors.jahr}
                      />
                      <TextField
                        key={`${row.id}vergleichVorjahrGesamtziel`}
                        label="Vergleich Vorjahr - Gesamtziel"
                        value={row.vergleichVorjahrGesamtziel}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'vergleichVorjahrGesamtziel',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.vergleichVorjahrGesamtziel}
                      />
                      <RadioButtonGroup
                        key={`${row.id}beurteilung`}
                        value={row.beurteilung}
                        label="Beurteilung"
                        dataSource={beurteilungWerte}
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'beurteilung',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.beurteilung}
                      />
                      <RadioButtonGroup
                        key={`${row.id}veraenderungZumVorjahr`}
                        value={row.veraenderungZumVorjahr}
                        label="Veränderung zum Vorjahr"
                        dataSource={veraenGegenVorjahrWerte}
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'veraenderungZumVorjahr',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.veraenderungZumVorjahr}
                      />
                      <TextField
                        key={`${row.id}apberAnalyse`}
                        label="Analyse"
                        value={row.apberAnalyse}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'apberAnalyse',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.apberAnalyse}
                      />
                      <TextField
                        key={`${row.id}konsequenzenUmsetzung`}
                        label="Konsequenzen für die Umsetzung"
                        value={row.konsequenzenUmsetzung}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'konsequenzenUmsetzung',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.konsequenzenUmsetzung}
                      />
                      <TextField
                        key={`${row.id}konsequenzenErfolgskontrolle`}
                        label="Konsequenzen für die Erfolgskontrolle"
                        value={row.konsequenzenErfolgskontrolle}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'konsequenzenErfolgskontrolle',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.konsequenzenErfolgskontrolle}
                      />
                      <TextField
                        key={`${row.id}biotopeNeue`}
                        label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
                        value={row.biotopeNeue}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'biotopeNeue',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.biotopeNeue}
                      />
                      <TextField
                        key={`${row.id}biotopeOptimieren`}
                        label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
                        value={row.biotopeOptimieren}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'biotopeOptimieren',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.biotopeOptimieren}
                      />
                      <TextField
                        key={`${row.id}massnahmenApBearb`}
                        label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
                        value={row.massnahmenApBearb}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'massnahmenApBearb',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.massnahmenApBearb}
                      />
                      <TextField
                        key={`${row.id}massnahmenPlanungVsAusfuehrung`}
                        label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
                        value={row.massnahmenPlanungVsAusfuehrung}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'massnahmenPlanungVsAusfuehrung',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.massnahmenPlanungVsAusfuehrung}
                      />
                      <TextField
                        key={`${row.id}massnahmenOptimieren`}
                        label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
                        value={row.massnahmenOptimieren}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'massnahmenOptimieren',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.massnahmenOptimieren}
                      />
                      <TextField
                        key={`${row.id}wirkungAufArt`}
                        label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
                        value={row.wirkungAufArt}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'wirkungAufArt',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.wirkungAufArt}
                      />
                      <DateFieldWithPicker
                        key={`${row.id}datum`}
                        label="Datum"
                        value={row.datum}
                        saveToDb={value =>
                          saveToDb({ row, field: 'datum', value, updateApber })
                        }
                        error={errors.datum}
                      />
                      <Select
                        key={`${row.id}bearbeiter`}
                        value={row.bearbeiter}
                        field="bearbeiter"
                        label="BearbeiterIn"
                        options={adressenWerte}
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'bearbeiter',
                            value,
                            updateApber,
                          })
                        }
                        error={errors.bearbeiter}
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
}

export default enhance(Apber)
