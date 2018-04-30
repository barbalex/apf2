// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import format from 'date-fns/format'

import RadioButton from '../../../shared/RadioButtonGql'
import RadioButtonGroup from '../../../shared/RadioButtonGroupGql'
import TextField from '../../../shared/TextFieldGql'
import AutoComplete from '../../../shared/AutocompleteGql'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerGql'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import tpopkontrByIdGql from './tpopkontrById.graphql'
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

const enhance = compose(inject('store'), observer)
const jungpflanzenVorhandenDataSource = [
  { value: true, label: 'ja' },
  { value: false, label: 'nein' },
]

const Tpopfreiwkontr = ({
  id,
  store,
  tree,
  dimensions = { width: 380 },
}: {
  id: String,
  store: Object,
  tree: Object,
  dimensions: number,
}) => {
  const { activeDataset } = tree
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <Query query={tpopkontrByIdGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`

        const row = get(data, 'tpopkontrById')

        return (
          <ErrorBoundary>
            <Container innerRef={c => (this.container = c)}>
              <FormTitle tree={tree} title="Freiwilligen-Kontrolle" />
              <Mutation mutation={updateTpopkontrByIdGql}>
                {(updateTpopkontr, { data }) => (
                  <FieldsContainer data-width={width}>
                    <TextField
                      key={`${row.id}jahr`}
                      label="Jahr"
                      value={row.jahr}
                      type="number"
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            jahr: event.target.value || null,
                            datum: null,
                          },
                        })
                      }
                    />
                    <DateFieldWithPicker
                      key={`${row.id}datum`}
                      label="Datum"
                      value={row.datum}
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            datum: value,
                            jahr: !!value ? format(value, 'YYYY') : null,
                          },
                        })
                      }
                    />

                    <AutoComplete
                      key={`${activeDataset.row.id}bearbeiter`}
                      label="BearbeiterIn"
                      value={get(row, 'adresseByBearbeiter.name')}
                      objects={store.dropdownList.adressen}
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            bearbeiter: value,
                          },
                        })
                      }
                    />
                    <RadioButton
                      key={`${activeDataset.row.id}planVorhanden`}
                      label="Auf Plan eingezeichnet"
                      value={row.planVorhanden}
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            planVorhanden: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${activeDataset.row.id}flaecheUeberprueft`}
                      label="Überprüfte Fläche in m2"
                      value={row.flaecheUeberprueft}
                      type="number"
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            flaecheUeberprueft: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${activeDataset.row.id}deckungApArt`}
                      label="Deckung überprüfte Art (%)"
                      value={row.deckungApArt}
                      type="number"
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            deckungApArt: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${activeDataset.row.id}deckungNackterBoden`}
                      label="Deckung nackter Boden (%)"
                      value={activeDataset.row.deckungNackterBoden}
                      type="number"
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            deckungNackterBoden: event.target.value,
                          },
                        })
                      }
                    />
                    <RadioButtonGroup
                      label="Auch junge Pflanzen vorhanden"
                      value={row.jungpflanzenVorhanden}
                      dataSource={jungpflanzenVorhandenDataSource}
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            jungpflanzenVorhanden: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${activeDataset.row.id}vegetationshoeheMaximum`}
                      label="Maximum der Vegetationshöhe in cm"
                      value={row.vegetationshoeheMaximum}
                      type="number"
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            vegetationshoeheMaximum: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${activeDataset.row.id}vegetationshoeheMittel`}
                      label="Mittelwert der Vegetationshöhe in cm"
                      value={row.vegetationshoeheMittel}
                      type="number"
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            vegetationshoeheMittel: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${activeDataset.row.id}gefaehrdung`}
                      label="Gefährdung"
                      fieldName="gefaehrdung"
                      value={row.gefaehrdung}
                      type="text"
                      multiLine
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            gefaehrdung: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${activeDataset.row.id}bemerkungen`}
                      label="Bemerkungen"
                      value={row.bemerkungen}
                      type="text"
                      multiLine
                      saveToDb={event =>
                        updateTpopkontr({
                          variables: {
                            id,
                            bemerkungen: event.target.value,
                          },
                        })
                      }
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

export default enhance(Tpopfreiwkontr)
