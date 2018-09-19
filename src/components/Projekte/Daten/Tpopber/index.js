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
import updateTpopberByIdGql from './updateTpopberById.graphql'

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
      updateTpopber,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateTpopber({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopberById: {
              tpopber: {
                id: row.id,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                jahr: field === 'jahr' ? value : row.jahr,
                entwicklung: field === 'entwicklung' ? value : row.entwicklung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                tpopEntwicklungWerteByEntwicklung:
                  row.tpopEntwicklungWerteByEntwicklung,
                tpopByTpopId: row.tpopByTpopId,
                __typename: 'Tpopber',
              },
              __typename: 'Tpopber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
        /**
         * DO NOT do the following, because:
         * can fire after component was unmounted...
         */
        /*
        setTimeout(() => {
          const newErrors = {...errors}
          delete newErrors[field]
          setErrors(newErrors)
        }, 1000 * 10)
        */
      }
      setErrors({})
      if (['entwicklung'].includes(field)) refetchTree('tpopbers')
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

const Tpopber = ({
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

      const row = get(data, 'tpopberById')
      let tpopentwicklungWerte = get(data, 'allTpopEntwicklungWertes.nodes', [])
      tpopentwicklungWerte = sortBy(tpopentwicklungWerte, 'sort')
      tpopentwicklungWerte = tpopentwicklungWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(data, 'tpopberById.tpopByTpopId.popByPopId.apId')}
              title="Kontroll-Bericht Teil-Population"
              treeName={treeName}
              table="tpopber"
            />
            <Mutation mutation={updateTpopberByIdGql}>
              {(updateTpopber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'jahr',
                        value,
                        updateTpopber,
                      })
                    }
                    error={errors.jahr}
                  />
                  <RadioButtonGroup
                    key={`${row.id}entwicklung`}
                    label="Entwicklung"
                    value={row.entwicklung}
                    dataSource={tpopentwicklungWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'entwicklung',
                        value,
                        updateTpopber,
                      })
                    }
                    error={errors.entwicklung}
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
                        updateTpopber,
                      })
                    }
                    error={errors.bemerkungen}
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

export default enhance(Tpopber)
