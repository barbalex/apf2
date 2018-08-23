// @flow
import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButton from '../../../shared/RadioButton'
import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import AutoComplete from '../../../shared/Autocomplete'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateTpopkontrByIdGql from './updateTpopkontrById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors }) => async ({
      row,
      field,
      value,
      field2,
      value2,
      updateTpopkontr,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      /**
       * enable passing two values
       * with same update
       */
      const variables = {
        id: row.id,
        [field]: value,
      }
      if (field2) variables[field2] = value2
      try {
        await updateTpopkontr({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrById: {
              tpopkontr: {
                id: row.id,
                typ: field === 'typ' ? value : row.typ,
                jahr:
                  field === 'jahr'
                    ? value
                    : field2 === 'jahr'
                      ? value2
                      : row.jahr,
                datum:
                  field === 'datum'
                    ? value
                    : field2 === 'datum'
                      ? value2
                      : row.datum,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                flaecheUeberprueft:
                  field === 'flaecheUeberprueft'
                    ? value
                    : row.flaecheUeberprueft,
                deckungVegetation:
                  field === 'deckungVegetation' ? value : row.deckungVegetation,
                deckungNackterBoden:
                  field === 'deckungNackterBoden'
                    ? value
                    : row.deckungNackterBoden,
                deckungApArt:
                  field === 'deckungApArt' ? value : row.deckungApArt,
                vegetationshoeheMaximum:
                  field === 'vegetationshoeheMaximum'
                    ? value
                    : row.vegetationshoeheMaximum,
                vegetationshoeheMittel:
                  field === 'vegetationshoeheMittel'
                    ? value
                    : row.vegetationshoeheMittel,
                gefaehrdung: field === 'gefaehrdung' ? value : row.gefaehrdung,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                planVorhanden:
                  field === 'planVorhanden' ? value : row.planVorhanden,
                jungpflanzenVorhanden:
                  field === 'jungpflanzenVorhanden'
                    ? value
                    : row.jungpflanzenVorhanden,
                adresseByBearbeiter: row.adresseByBearbeiter,
                tpopByTpopId: row.tpopByTpopId,
                __typename: 'Tpopkontr',
              },
              __typename: 'Tpopkontr',
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

const jungpflanzenVorhandenDataSource = [
  { value: true, label: 'ja' },
  { value: false, label: 'nein' },
]

type Props = {
  id: String,
  saveToDb: () => void,
  dimensions: Number,
  errors: Object,
}

class Tpopfreiwkontr extends Component<Props> {
  constructor(props) {
    super(props)
    this.container = createRef()
  }

  render() {
    const { id, saveToDb, dimensions = { width: 380 }, errors } = this.props

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

          const width = isNaN(dimensions.width) ? 380 : dimensions.width
          const row = get(data, 'tpopkontrById')
          let adressenWerte = get(data, 'allAdresses.nodes', [])
          adressenWerte = sortBy(adressenWerte, 'name')
          adressenWerte = adressenWerte.map(el => ({
            value: el.id,
            label: el.name,
          }))

          return (
            <ErrorBoundary>
              <Container innerRef={this.container}>
                <FormTitle
                  apId={get(data, 'tpopkontrById.tpopByTpopId.popByPopId.apId')}
                  title="Freiwilligen-Kontrolle"
                />
                <Mutation mutation={updateTpopkontrByIdGql}>
                  {(updateTpopkontr, { data }) => (
                    <FieldsContainer data-width={width}>
                      <TextField
                        key={`${row.id}jahr`}
                        label="Jahr"
                        value={row.jahr}
                        type="number"
                        saveToDb={value => {
                          saveToDb({
                            row,
                            field: 'jahr',
                            value,
                            field2: 'datum',
                            value2: null,
                            updateTpopkontr,
                          })
                        }}
                        error={errors.jahr}
                      />
                      <DateFieldWithPicker
                        key={`${row.id}datum`}
                        label="Datum"
                        value={row.datum}
                        saveToDb={value => {
                          saveToDb({
                            row,
                            field: 'datum',
                            value,
                            field2: 'jahr',
                            value2: !!value ? format(value, 'YYYY') : null,
                            updateTpopkontr,
                          })
                        }}
                        error={errors.datum}
                      />
                      <AutoComplete
                        key={`${row.id}bearbeiter`}
                        label="BearbeiterIn"
                        value={get(row, 'adresseByBearbeiter.name')}
                        objects={adressenWerte}
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'bearbeiter',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.bearbeiter}
                      />
                      <RadioButton
                        key={`${row.id}planVorhanden`}
                        label="Auf Plan eingezeichnet"
                        value={row.planVorhanden}
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'planVorhanden',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.planVorhanden}
                      />
                      <TextField
                        key={`${row.id}flaecheUeberprueft`}
                        label="Überprüfte Fläche in m2"
                        value={row.flaecheUeberprueft}
                        type="number"
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'flaecheUeberprueft',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.flaecheUeberprueft}
                      />
                      <TextField
                        key={`${row.id}deckungApArt`}
                        label="Deckung überprüfte Art (%)"
                        value={row.deckungApArt}
                        type="number"
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'deckungApArt',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.deckungApArt}
                      />
                      <TextField
                        key={`${row.id}deckungNackterBoden`}
                        label="Deckung nackter Boden (%)"
                        value={row.deckungNackterBoden}
                        type="number"
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'deckungNackterBoden',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.deckungNackterBoden}
                      />
                      <RadioButtonGroup
                        label="Auch junge Pflanzen vorhanden"
                        value={row.jungpflanzenVorhanden}
                        dataSource={jungpflanzenVorhandenDataSource}
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'jungpflanzenVorhanden',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.jungpflanzenVorhanden}
                      />
                      <TextField
                        key={`${row.id}vegetationshoeheMaximum`}
                        label="Maximum der Vegetationshöhe in cm"
                        value={row.vegetationshoeheMaximum}
                        type="number"
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'vegetationshoeheMaximum',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.vegetationshoeheMaximum}
                      />
                      <TextField
                        key={`${row.id}vegetationshoeheMittel`}
                        label="Mittelwert der Vegetationshöhe in cm"
                        value={row.vegetationshoeheMittel}
                        type="number"
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'vegetationshoeheMittel',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.vegetationshoeheMittel}
                      />
                      <TextField
                        key={`${row.id}gefaehrdung`}
                        label="Gefährdung"
                        value={row.gefaehrdung}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'gefaehrdung',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.gefaehrdung}
                      />
                      <TextField
                        key={`${row.id}bemerkungen`}
                        label="Bemerkungen"
                        value={row.bemerkungen}
                        type="text"
                        multiLine
                        saveToDb={value =>
                          saveToDb({
                            row,
                            field: 'bemerkungen',
                            value,
                            updateTpopkontr,
                          })
                        }
                        error={errors.bemerkungen}
                      />
                      <StringToCopy text={row.id} label="GUID" />
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

export default enhance(Tpopfreiwkontr)
