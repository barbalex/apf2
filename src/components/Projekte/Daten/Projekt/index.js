// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'

import TextField from '../../../shared/TextFieldGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import projektByIdGql from './projektById.graphql'
import updateProjektByIdGql from './updateProjektById.graphql'

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

const Projekt = ({ id }: { id: String }) => (
  <Query query={projektByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'projektById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle title="Projekt" />
            <Mutation mutation={updateProjektByIdGql}>
              {(updateProjekt, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}name`}
                    label="Name"
                    value={row.name}
                    type="text"
                    saveToDb={value =>
                      updateProjekt({
                        variables: {
                          id,
                          name: value,
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

export default Projekt
