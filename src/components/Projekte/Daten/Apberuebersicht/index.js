// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'

import TextField from '../../../shared/TextFieldGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import apberuebersichtByIdGql from './apberuebersichtById.graphql'
import updateApberuebersichtByIdGql from './updateApberuebersichtById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  height: 100%;
  padding: 10px;
  height: 100%;
`

const Apberuebersicht = ({ id }: { id: String }) => (
  <Query query={apberuebersichtByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'apberuebersichtById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle title="AP-Bericht Jahresübersicht" />
            <Mutation mutation={updateApberuebersichtByIdGql}>
              {(updateApberuebersicht, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      updateApberuebersicht({
                        variables: {
                          id,
                          jahr: value,
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
                      updateApberuebersicht({
                        variables: {
                          id,
                          bemerkungen: value,
                        },
                      })
                    }
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

export default Apberuebersicht
