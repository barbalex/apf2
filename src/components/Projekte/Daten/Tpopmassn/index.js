// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import AutoCompleteFromArray from '../../../shared/AutocompleteFromArray'
import TextField from '../../../shared/TextField'
import AutoComplete from '../../../shared/Autocomplete'
import RadioButton from '../../../shared/RadioButton'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
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

const enhance = compose(
  withState('errors', 'setErrors', ({})),
  withHandlers({
    saveToDb: ({
      refetchTree,
      setErrors,
      errors
    }) => async ({
      row,
      field,
      value,
      field2,
      value2,
      updateTpopmassn
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      const variables = {
        id: row.id,
        [field]: value,
      }
      if (field2) variables[field2] = value2
      console.log('Tpopmassn, saveToDb:', {
        field,
        value,
        field2,
        value2,
        variables,
        jahrOptimistic: field === 'jahr' ? value :
          field2 === 'jahr' ? value2 :
          row.jahr,
        datumOptimistic: field === 'datum' ? value :
          field2 === 'datum' ? value2 :
          row.datum,
      })
      try {
        await updateTpopmassn({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopmassnById: {
              tpopmassn: {
                id: row.id,
                typ: field === 'typ' ? value : row.typ,
                beschreibung: field === 'beschreibung' ? value : row.beschreibung,
                jahr: field === 'jahr' ? value :
                    field2 === 'jahr' ? value2 :
                    row.jahr,
                datum: field === 'datum' ? value :
                  field2 === 'datum' ? value2 :
                  row.datum,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                planBezeichnung:
                  field === 'planBezeichnung' ? value : row.planBezeichnung,
                flaeche: field === 'flaeche' ? value : row.flaeche,
                markierung: field === 'markierung' ? value : row.markierung,
                anzTriebe: field === 'anzTriebe' ? value : row.anzTriebe,
                anzPflanzen: field === 'anzPflanzen' ? value : row.anzPflanzen,
                anzPflanzstellen:
                  field === 'anzPflanzstellen' ? value : row.anzPflanzstellen,
                wirtspflanze: field === 'wirtspflanze' ? value : row.wirtspflanze,
                herkunftPop: field === 'herkunftPop' ? value : row.herkunftPop,
                sammeldatum: field === 'sammeldatum' ? value : row.sammeldatum,
                form: field === 'form' ? value : row.form,
                pflanzanordnung:
                  field === 'pflanzanordnung' ? value : row.pflanzanordnung,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                planVorhanden:
                  field === 'planVorhanden' ? value : row.planVorhanden,
                tpopmassnTypWerteByTyp: row.tpopmassnTypWerteByTyp,
                adresseByBearbeiter: row.adresseByBearbeiter,
                tpopByTpopId: row.tpopByTpopId,
                __typename: 'Tpopmassn',
              },
              __typename: 'Tpopmassn',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors(({}))
      if (['typ'].includes(field)) refetchTree()
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      /**
       * reset errors if dataset was changed
       * (but same form rerenders)
       */
      if (prevProps.id !== props.id) {
        props.setErrors(({}))
      }
    },
  }),
)

const Tpopmassn = ({
  id,
  onNewRequestWirtspflanze,
  onBlurWirtspflanze,
  dimensions = { width: 380 },
  saveToDb,
  errors,
}: {
  id: String,
  onNewRequestWirtspflanze: () => void,
  onBlurWirtspflanze: () => void,
  dimensions: number,
  saveToDb: () => void,
  errors: Object,
}) =>
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
                    saveToDb={value => {
                      saveToDb({
                        row,
                        field: 'jahr',
                        value,
                        field2: 'datum',
                        value2: null,
                        updateTpopmassn
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
                        updateTpopmassn,
                      })
                    }}
                    error={errors.datum}
                  />
                  <RadioButtonGroup
                    key={`${row.id}typ`}
                    label="Typ"
                    value={row.typ}
                    dataSource={tpopmasstypWerte}
                    saveToDb={value =>
                      saveToDb({ row, field: 'typ', value, updateTpopmassn })
                    }
                    error={errors.typ}
                  />
                  <TextField
                    key={`${row.id}beschreibung`}
                    label="Massnahme"
                    value={row.beschreibung}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'beschreibung',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.beschreibung}
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
                        updateTpopmassn,
                      })
                    }
                    error={errors.bearbeiter}
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
                        updateTpopmassn,
                      })
                    }
                    error={errors.bemerkungen}
                  />
                  <RadioButton
                    key={`${row.id}planVorhanden`}
                    label="Plan vorhanden"
                    value={row.planVorhanden}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'planVorhanden',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.planVorhanden}
                  />
                  <TextField
                    key={`${row.id}planBezeichnung`}
                    label="Plan Bezeichnung"
                    value={row.planBezeichnung}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'planBezeichnung',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.planBezeichnung}
                  />
                  <TextField
                    key={`${row.id}flaeche`}
                    label="Fläche (m2)"
                    value={row.flaeche}
                    type="number"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'flaeche',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.flaeche}
                  />
                  <TextField
                    key={`${row.id}form`}
                    label="Form der Ansiedlung"
                    value={row.form}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'form', value, updateTpopmassn })
                    }
                    error={errors.form}
                  />
                  <TextField
                    key={`${row.id}pflanzanordnung`}
                    label="Pflanzanordnung"
                    value={row.pflanzanordnung}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'pflanzanordnung',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.pflanzanordnung}
                  />
                  <TextField
                    key={`${row.id}markierung`}
                    label="Markierung"
                    value={row.markierung}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'markierung',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.markierung}
                  />
                  <TextField
                    key={`${row.id}anzTriebe`}
                    label="Anzahl Triebe"
                    value={row.anzTriebe}
                    type="number"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'anzTriebe',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.anzTriebe}
                  />
                  <TextField
                    key={`${row.id}anzPflanzen`}
                    label="Anzahl Pflanzen"
                    value={row.anzPflanzen}
                    type="number"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'anzPflanzen',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.anzPflanzen}
                  />
                  <TextField
                    key={`${row.id}anzPflanzstellen`}
                    label="Anzahl Pflanzstellen"
                    value={row.anzPflanzstellen}
                    type="number"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'anzPflanzstellen',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.anzPflanzstellen}
                  />
                  <AutoCompleteFromArray
                    key={`${row.id}wirtspflanze`}
                    label="Wirtspflanze"
                    value={row.wirtspflanze}
                    values={artWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'wirtspflanze',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.wirtspflanze}
                  />
                  <TextField
                    key={`${row.id}herkunftPop`}
                    label="Herkunftspopulation"
                    value={row.herkunftPop}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'herkunftPop',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.herkunftPop}
                  />
                  <TextField
                    key={`${row.id}sammeldatum`}
                    label="Sammeldatum"
                    value={row.sammeldatum}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'sammeldatum',
                        value,
                        updateTpopmassn,
                      })
                    }
                    error={errors.sammeldatum}
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

export default enhance(Tpopmassn)
