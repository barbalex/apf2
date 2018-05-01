// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
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

const jungpflanzenVorhandenDataSource = [
  { value: true, label: 'ja' },
  { value: false, label: 'nein' },
]

const Tpopfreiwkontr = ({
  id,
  dimensions = { width: 380 },
}: {
  id: String,
  dimensions: number,
}) => {
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
        let adressenWerte = get(data, 'allAdresses.nodes', [])
        adressenWerte = sortBy(adressenWerte, 'name')
        adressenWerte = adressenWerte.map(el => ({
          id: el.id,
          value: el.name,
        }))

        return (
          <ErrorBoundary>
            <Container innerRef={c => (this.container = c)}>
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
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            jahr: value,
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
                      key={`${row.id}bearbeiter`}
                      label="BearbeiterIn"
                      value={get(row, 'adresseByBearbeiter.name')}
                      objects={adressenWerte}
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
                      key={`${row.id}planVorhanden`}
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
                      key={`${row.id}flaecheUeberprueft`}
                      label="Überprüfte Fläche in m2"
                      value={row.flaecheUeberprueft}
                      type="number"
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            flaecheUeberprueft: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}deckungApArt`}
                      label="Deckung überprüfte Art (%)"
                      value={row.deckungApArt}
                      type="number"
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            deckungApArt: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}deckungNackterBoden`}
                      label="Deckung nackter Boden (%)"
                      value={row.deckungNackterBoden}
                      type="number"
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            deckungNackterBoden: value,
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
                      key={`${row.id}vegetationshoeheMaximum`}
                      label="Maximum der Vegetationshöhe in cm"
                      value={row.vegetationshoeheMaximum}
                      type="number"
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            vegetationshoeheMaximum: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}vegetationshoeheMittel`}
                      label="Mittelwert der Vegetationshöhe in cm"
                      value={row.vegetationshoeheMittel}
                      type="number"
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            vegetationshoeheMittel: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}gefaehrdung`}
                      label="Gefährdung"
                      value={row.gefaehrdung}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            gefaehrdung: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}bemerkungen`}
                      label="Bemerkungen"
                      value={row.bemerkungen}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateTpopkontr({
                          variables: {
                            id,
                            bemerkungen: value,
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

export default Tpopfreiwkontr
