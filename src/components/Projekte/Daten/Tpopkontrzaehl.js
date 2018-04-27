// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import AutoComplete from '../../shared/Autocomplete'
import ErrorBoundary from '../../shared/ErrorBoundary'

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

const Tpopkontrzaehl = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeNode } = tree

  return (
    <Query
      query={gql`
        query TpopkontrzaehlQuery($id: UUID!) {
          tpopkontrzaehlById(id: $id) {
            id
            anzahl
            einheit
            tpopkontrzaehlEinheitWerteByEinheit {
              text
            }
            methode
          }
          allTpopkontrzaehlEinheitWertes {
            nodes {
              id
              code
              text
              sort
            }
          }
          allTpopkontrzaehlMethodeWertes {
            nodes {
              id
              code
              text
              sort
            }
          }
        }
      `}
      variables={{ id: activeNode.id }}
    >
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
              <FormTitle tree={tree} title="Zählung" />
              <FieldsContainer>
                <AutoComplete
                  key={`${row.id}einheitNew`}
                  tree={tree}
                  label="Einheit"
                  fieldName="einheit"
                  value={get(row, 'tpopkontrzaehlEinheitWerteByEinheit.text')}
                  objects={zaehleinheitWerte}
                  updatePropertyInDb={store.updatePropertyInDb}
                />
                <TextField
                  key={`${row.id}anzahl`}
                  tree={tree}
                  label="Anzahl (nur ganze Zahlen)"
                  fieldName="anzahl"
                  value={row.anzahl}
                  type="number"
                  updateProperty={store.updateProperty}
                  updatePropertyInDb={store.updatePropertyInDb}
                />
                <RadioButtonGroup
                  key={`${row.id}methode`}
                  tree={tree}
                  fieldName="methode"
                  label="Methode"
                  value={row.methode}
                  dataSource={methodeWerte}
                  updatePropertyInDb={store.updatePropertyInDb}
                />
              </FieldsContainer>
            </Container>
          </ErrorBoundary>
        )
      }}
    </Query>
  )
}

export default enhance(Tpopkontrzaehl)
