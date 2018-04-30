// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'

import TextField from '../../../shared/TextFieldGql'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoGql'
import Status from '../../../shared/Status'
import RadioButton from '../../../shared/RadioButtonGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import popByIdGql from './popById.graphql'
import updatePopByIdGql from './updatePopById.graphql'

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

const Pop = ({ id }: { id: String }) => (
  <Query query={popByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={get(data, 'popById.apId')} title="Population" />
            <Mutation mutation={updatePopByIdGql}>
              {(updatePop, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}nr`}
                    label="Nr."
                    value={row.nr}
                    type="number"
                    saveToDb={event =>
                      updatePop({
                        variables: {
                          id,
                          nr: event.target.value,
                        },
                      })
                    }
                  />
                  <TextFieldWithInfo
                    key={`${row.id}name`}
                    label="Name"
                    value={row.name}
                    type="text"
                    saveToDb={event =>
                      updatePop({
                        variables: {
                          id,
                          name: event.target.value,
                        },
                      })
                    }
                    popover="Dieses Feld möglichst immer ausfüllen"
                  />
                  <Status
                    apJahr={get(data, 'tpopById.apByApId.startJahr')}
                    herkunftValue={row.status}
                    bekanntSeitValue={row.bekanntSeit}
                    saveToDbBekanntSeit={value =>
                      updatePop({
                        variables: {
                          id,
                          bekanntSeit: value,
                        },
                      })
                    }
                    saveToDbStatus={value =>
                      updatePop({
                        variables: {
                          id,
                          status: value,
                        },
                      })
                    }
                  />
                  <RadioButton
                    key={`${row.id}statusUnklar`}
                    label="Status unklar"
                    value={row.statusUnklar}
                    saveToDb={value =>
                      updatePop({
                        variables: {
                          id,
                          statusUnklar: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}statusUnklarBegruendung`}
                    label="Begründung"
                    value={row.statusUnklarBegruendung}
                    type="text"
                    multiLine
                    saveToDb={event =>
                      updatePop({
                        variables: {
                          id,
                          statusUnklarBegruendung: event.target.value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}x`}
                    label="X-Koordinaten"
                    value={row.x}
                    type="number"
                    saveToDb={event =>
                      updatePop({
                        variables: {
                          id,
                          x: event.target.value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}y`}
                    label="Y-Koordinaten"
                    value={row.y}
                    type="number"
                    saveToDb={event =>
                      updatePop({
                        variables: {
                          id,
                          y: event.target.value,
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

export default Pop
