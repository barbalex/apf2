// @flow
import React from 'react'
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
import FormTitle from '../../../shared/FormTitle'
import Select from '../../../shared/Select'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const enhance = compose(
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updateTpopkontrzaehl,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateTpopkontrzaehl({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlById: {
              tpopkontrzaehl: {
                id: row.id,
                anzahl: field === 'anzahl' ? value : row.anzahl,
                einheit: field === 'einheit' ? value : row.einheit,
                methode: field === 'methode' ? value : row.methode,
                tpopkontrzaehlEinheitWerteByEinheit:
                  row.tpopkontrzaehlEinheitWerteByEinheit,
                tpopkontrzaehlMethodeWerteByMethode:
                  row.tpopkontrzaehlMethodeWerteByMethode,
                tpopkontrByTpopkontrId: row.tpopkontrByTpopkontrId,
                __typename: 'Tpopkontrzaehl',
              },
              __typename: 'Tpopkontrzaehl',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['einheit', 'methode'].includes(field)) refetchTree('tpopkontrzaehls')
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

const Tpopkontrzaehl = ({
  id,
  saveToDb,
  errors,
  treeName,
}: {
  id: string,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopkontrzaehlById', {})
      let zaehleinheitWerte = get(
        data,
        'allTpopkontrzaehlEinheitWertes.nodes',
        [],
      )
      zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort').map(el => ({
        value: el.code,
        label: el.text,
      }))
      let methodeWerte = get(data, 'allTpopkontrzaehlMethodeWertes.nodes', [])
      methodeWerte = sortBy(methodeWerte, 'sort')
      methodeWerte = methodeWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(
                data,
                'tpopkontrzaehlById.tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.apId',
              )}
              title="Zählung"
              treeName={treeName}
              table="tpopkontrzaehl"
            />
            <Mutation mutation={updateTpopkontrzaehlByIdGql}>
              {(updateTpopkontrzaehl, { data }) => (
                <FieldsContainer>
                  <Select
                    key={`${row.id}einheit`}
                    value={row.einheit}
                    field="einheit"
                    label="Einheit"
                    options={zaehleinheitWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'einheit',
                        value,
                        updateTpopkontrzaehl,
                      })
                    }
                    error={errors.einheit}
                  />
                  <TextField
                    key={`${row.id}anzahl`}
                    label="Anzahl (nur ganze Zahlen)"
                    value={row.anzahl}
                    type="number"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'anzahl',
                        value,
                        updateTpopkontrzaehl,
                      })
                    }
                    error={errors.anzahl}
                  />
                  <RadioButtonGroup
                    key={`${row.id}methode`}
                    label="Methode"
                    value={row.methode}
                    dataSource={methodeWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'methode',
                        value,
                        updateTpopkontrzaehl,
                      })
                    }
                    error={errors.methode}
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

export default enhance(Tpopkontrzaehl)
