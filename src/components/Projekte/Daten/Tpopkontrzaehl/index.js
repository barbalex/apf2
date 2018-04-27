// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import RadioButtonGroup from '../../../shared/RadioButtonGroupGql'
import TextField from '../../../shared/TextFieldGql'
import FormTitle from '../../../shared/FormTitle'
import AutoComplete from '../../../shared/AutocompleteGql'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import tpopkontrzaehlByIdGql from './tpopkontrzaehlById.graphql'
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

const enhance = compose(inject('store'), observer)

const Tpopkontrzaehl = ({ id, tree }: { id: String, tree: Object }) => {
  return (
    <Query query={tpopkontrzaehlByIdGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`

        const row = get(data, 'tpopkontrzaehlById')
        let zaehleinheitWerte = get(
          data,
          'allTpopkontrzaehlEinheitWertes.nodes',
          []
        )
        zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort').map(el => ({
          id: el.code,
          value: el.text,
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
                tree={tree}
                apId={get(
                  data,
                  'tpopkontrzaehlById.tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.apId'
                )}
                title="Zählung"
              />
              <Mutation mutation={updateTpopkontrzaehlByIdGql}>
                {(updateTpopkontrzaehl, { data }) => (
                  <FieldsContainer>
                    <AutoComplete
                      key={`${row.id}einheit`}
                      label="Einheit"
                      value={get(
                        row,
                        'tpopkontrzaehlEinheitWerteByEinheit.text'
                      )}
                      objects={zaehleinheitWerte}
                      saveToDb={val =>
                        updateTpopkontrzaehl({
                          variables: {
                            id: row.id,
                            anzahl: row.anzahl,
                            einheit: val,
                            methode: row.methode,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}anzahl`}
                      label="Anzahl (nur ganze Zahlen)"
                      value={row.anzahl}
                      type="number"
                      saveToDb={event =>
                        updateTpopkontrzaehl({
                          variables: {
                            id: row.id,
                            anzahl: event.target.value,
                            einheit: row.einheit,
                            methode: row.methode,
                          },
                        })
                      }
                    />
                    <RadioButtonGroup
                      key={`${row.id}methode`}
                      label="Methode"
                      value={row.methode}
                      dataSource={methodeWerte}
                      saveToDb={val =>
                        updateTpopkontrzaehl({
                          variables: {
                            id: row.id,
                            anzahl: row.anzahl,
                            einheit: row.einheit,
                            methode: val,
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
}

export default enhance(Tpopkontrzaehl)
