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
import updatePopmassnberByIdGql from './updatePopmassnberById.graphql'
import withAllTpopmassnErfbeurtWertes from './withAllTpopmassnErfbeurtWertes'

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
  withAllTpopmassnErfbeurtWertes,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updatePopmassnber,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updatePopmassnber({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updatePopmassnberById: {
              popmassnber: {
                id: row.id,
                popId: field === 'popId' ? value : row.popId,
                jahr: field === 'jahr' ? value : row.jahr,
                beurteilung: field === 'beurteilung' ? value : row.beurteilung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                tpopmassnErfbeurtWerteByBeurteilung:
                  row.tpopmassnErfbeurtWerteByBeurteilung,
                popByPopId: row.popByPopId,
                __typename: 'Popmassnber',
              },
              __typename: 'Popmassnber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['beurteilung'].includes(field)) refetchTree('popmassnbers')
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

const Popmassnber = ({
  id,
  saveToDb,
  errors,
  treeName,
  dataAllTpopmassnErfbeurtWertes,
}: {
  id: string,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
  dataAllTpopmassnErfbeurtWertes: Object,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading || dataAllTpopmassnErfbeurtWertes.loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`
      if (dataAllTpopmassnErfbeurtWertes.error)
        return `Fehler: ${dataAllTpopmassnErfbeurtWertes.error.message}`

      const row = get(data, 'popmassnberById', {})
      let popbeurteilungWerte = get(
        dataAllTpopmassnErfbeurtWertes,
        'allTpopmassnErfbeurtWertes.nodes',
        [],
      )
      popbeurteilungWerte = sortBy(popbeurteilungWerte, 'sort')
      popbeurteilungWerte = popbeurteilungWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(data, 'popmassnberById.popByPopId.apId')}
              title="Massnahmen-Bericht Population"
              treeName={treeName}
              table="popmassnber"
            />
            <Mutation mutation={updatePopmassnberByIdGql}>
              {(updatePopmassnber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'jahr', value, updatePopmassnber })
                    }
                    error={errors.jahr}
                  />
                  <RadioButtonGroup
                    key={`${row.id}beurteilung`}
                    label="Entwicklung"
                    value={row.beurteilung}
                    dataSource={popbeurteilungWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'beurteilung',
                        value,
                        updatePopmassnber,
                      })
                    }
                    error={errors.beurteilung}
                  />
                  <TextField
                    key={`${row.id}bemerkungen`}
                    label="Interpretation"
                    value={row.bemerkungen}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'bemerkungen',
                        value,
                        updatePopmassnber,
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

export default enhance(Popmassnber)
