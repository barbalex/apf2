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
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateErfkritByIdGql from './updateErfkritById.graphql'

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
  withState('errors', 'setErrors', ({})),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({ row, field, value, updateErfkrit }) => {
      try {
        await updateErfkrit({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateErfkritById: {
              erfkrit: {
                id: row.id,
                apId: field === 'apId' ? value : row.apId,
                erfolg: field === 'erfolg' ? value : row.erfolg,
                kriterien: field === 'kriterien' ? value : row.kriterien,
                __typename: 'Erfkrit',
              },
              __typename: 'Erfkrit',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors(({}))
      if (['erfolg'].includes(field)) refetchTree()
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors(({}))
      }
    },
  }),
)

const Erfkrit = ({
  id,
  saveToDb,
  errors,
}: {
  id: String,
  saveToDb: () => void,
  errors: Object,
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

      const row = get(data, 'erfkritById')
      let erfolgWerte = get(data, 'allApErfkritWertes.nodes', [])
      erfolgWerte = sortBy(erfolgWerte, 'sort')
      erfolgWerte = erfolgWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={row.apId} title="Erfolgs-Kriterium" />
            <Mutation mutation={updateErfkritByIdGql}>
              {(updateErfkrit, { data }) => (
                <FieldsContainer>
                  <RadioButtonGroup
                    key={`${row.id}erfolg`}
                    label="Beurteilung"
                    value={row.erfolg}
                    dataSource={erfolgWerte}
                    saveToDb={value =>
                      saveToDb({ row, field: 'erfolg', value, updateErfkrit })
                    }
                    error={errors.erfolg}
                  />
                  <TextField
                    key={`${row.id}kriterien`}
                    label="Kriterien"
                    value={row.kriterien}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'kriterien',
                        value,
                        updateErfkrit,
                      })
                    }
                    error={errors.kriterien}
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

export default enhance(Erfkrit)
