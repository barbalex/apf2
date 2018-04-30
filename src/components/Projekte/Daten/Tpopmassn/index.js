// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

import RadioButtonGroup from '../../../shared/RadioButtonGroupGql'
import AutoCompleteFromArray from '../../../shared/AutocompleteFromArrayGql'
import TextField from '../../../shared/TextFieldGql'
import AutoComplete from '../../../shared/AutocompleteGql'
import RadioButton from '../../../shared/RadioButton'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerGql'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import tpopmassnByIdGql from './tpopmassnById.graphql'
import updateTpopmassnByIdGql from './updateTpopmassnById.graphql'

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

const Tpopmassn = ({
  id,
  store,
  tree,
  onNewRequestWirtspflanze,
  onBlurWirtspflanze,
  dimensions = { width: 380 },
}: {
  id: String,
  store: Object,
  tree: Object,
  onNewRequestWirtspflanze: () => void,
  onBlurWirtspflanze: () => void,
  dimensions: number,
}) => {
  const { activeDataset } = tree
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <Query query={tpopmassnByIdGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`

        const row = get(data, 'tpopmassnById')
        let adressenWerte = get(data, 'allAdresses.nodes', [])
        adressenWerte = sortBy(adressenWerte, 'name')
        adressenWerte = adressenWerte.map(el => ({
          id: el.id,
          value: el.name,
        }))
        let tpopmasstypWerte = get(data, 'allTpopmassnTypWertes.nodes', [])
        tpopmasstypWerte = sortBy(tpopmasstypWerte, 'sort')
        tpopmasstypWerte = tpopmasstypWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
        const artWerte = get(data, 'allAeEigenschaftens.nodes', [])
          .map(o => o.artname)
          .sort()

        return (
          <ErrorBoundary>
            <Container innerRef={c => (this.container = c)}>
              <FormTitle
                apId={get(data, 'tpopmassnById.tpopByTpopId.popByPopId.apId')}
                title="Massnahme"
              />
              <Mutation mutation={updateTpopmassnByIdGql}>
                {(updateTpopmassn, { data }) => (
                  <FieldsContainer data-width={width}>
                    <TextField
                      key={`${row.id}jahr`}
                      label="Jahr"
                      value={row.jahr}
                      type="number"
                      saveToDb={event =>
                        updateTpopmassn({
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
                        updateTpopmassn({
                          variables: {
                            id,
                            datum: value,
                            jahr: !!value ? format(value, 'YYYY') : null,
                          },
                        })
                      }
                    />
                    <RadioButtonGroup
                      key={`${row.id}typ`}
                      label="Typ"
                      value={row.typ}
                      dataSource={tpopmasstypWerte}
                      saveToDb={value =>
                        updateTpopmassn({
                          variables: {
                            id,
                            typ: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}beschreibung`}
                      label="Massnahme"
                      value={row.beschreibung}
                      type="text"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            beschreibung: event.target.value,
                          },
                        })
                      }
                    />
                    <AutoComplete
                      key={`${activeDataset.row.id}bearbeiter`}
                      label="BearbeiterIn"
                      value={get(row, 'adresseByBearbeiter.name')}
                      objects={adressenWerte}
                      saveToDb={value =>
                        updateTpopmassn({
                          variables: {
                            id,
                            bearbeiter: value,
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
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            bemerkungen: event.target.value,
                          },
                        })
                      }
                    />
                    <RadioButton
                      tree={tree}
                      fieldName="plan_vorhanden"
                      label="Plan vorhanden"
                      value={activeDataset.row.plan_vorhanden}
                      updatePropertyInDb={store.updatePropertyInDb}
                    />
                    <TextField
                      key={`${row.id}planBezeichnung`}
                      label="Plan Bezeichnung"
                      value={row.planBezeichnung}
                      type="text"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            planBezeichnung: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}flaeche`}
                      label="Fläche (m2)"
                      value={row.flaeche}
                      type="number"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            flaeche: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}form`}
                      label="Form der Ansiedlung"
                      value={row.form}
                      type="text"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            form: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}pflanzanordnung`}
                      label="Pflanzanordnung"
                      value={row.pflanzanordnung}
                      type="text"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            pflanzanordnung: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}markierung`}
                      label="Markierung"
                      value={row.markierung}
                      type="text"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            markierung: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}anzTriebe`}
                      label="Anzahl Triebe"
                      value={row.anzTriebe}
                      type="number"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            anzTriebe: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}anzPflanzen`}
                      label="Anzahl Pflanzen"
                      value={row.anzPflanzen}
                      type="number"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            anzPflanzen: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}anzPflanzstellen`}
                      label="Anzahl Pflanzstellen"
                      value={row.anzPflanzstellen}
                      type="number"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            anzPflanzstellen: event.target.value,
                          },
                        })
                      }
                    />
                    <AutoCompleteFromArray
                      key={`${activeDataset.row.id}wirtspflanze`}
                      label="Wirtspflanze"
                      value={row.wirtspflanze}
                      values={artWerte}
                      saveToDb={val =>
                        updateTpopmassn({
                          variables: {
                            id,
                            wirtspflanze: val,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}herkunftPop`}
                      label="Herkunftspopulation"
                      value={row.herkunftPop}
                      type="text"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            herkunftPop: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}sammeldatum`}
                      label="Sammeldatum"
                      value={row.sammeldatum}
                      type="text"
                      saveToDb={event =>
                        updateTpopmassn({
                          variables: {
                            id,
                            sammeldatum: event.target.value,
                          },
                        })
                      }
                    />
                    <StringToCopy text={row.id} label="id" />
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

export default enhance(Tpopmassn)
