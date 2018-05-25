// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateZielByIdGql from './updateZielById.graphql'
import setTreeKeyGql from './setTreeKey.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  height: 100%;
  overflow: auto !important;
`

const enhance = compose(
  withHandlers({
    saveToDb: ({ tree }) => ({ row, field, value, updateZiel, client }) => {
      updateZiel({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateZielById: {
            ziel: {
              id: row.id,
              apId: field === 'apId' ? value : row.apId,
              typ: field === 'typ' ? value : row.typ,
              jahr: field === 'jahr' ? value : row.jahr,
              bezeichnung: field === 'bezeichnung' ? value : row.bezeichnung,
              __typename: 'Ziel',
            },
            __typename: 'Ziel',
          },
        },
      })
      // if jahr of ziel is updated, activeNodeArray und openNodes need to change
      if (field === 'jahr') {
        const { activeNodeArray, openNodes } = tree
        const newActiveNodeArray = clone(activeNodeArray)
        newActiveNodeArray[5] = +value
        const oldParentNodeUrl = clone(activeNodeArray)
        oldParentNodeUrl.pop()
        const newParentNodeUrl = clone(newActiveNodeArray)
        newParentNodeUrl.pop()
        const newOpenNodes = openNodes.map(n => {
          if (isEqual(n, activeNodeArray)) return newActiveNodeArray
          if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
          return n
        })
        client.mutate({
          mutation: setTreeKeyGql,
          variables: {
            tree: tree.name,
            value1: newActiveNodeArray,
            key1: 'activeNodeArray',
            value2: newOpenNodes,
            key2: 'openNodes'
          }
        })
      }
    },
  })
)

const Ziel = ({
  id,
  tree,
  saveToDb
}: {
  id: String,
  tree: Object,
  saveToDb: () => void
}) =>
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data, client }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'zielById')
      let typWerte = get(data, 'allZielTypWertes.nodes', [])
      typWerte = sortBy(typWerte, 'sort')
      typWerte = typWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={row.apId} title="Ziel" />
            <Mutation mutation={updateZielByIdGql}>
              {(updateZiel, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'jahr', value, updateZiel, client })
                    }
                  />
                  <RadioButtonGroup
                    key={`${row.id}typ`}
                    label="Zieltyp"
                    value={row.typ}
                    dataSource={typWerte}
                    saveToDb={value =>
                      saveToDb({ row, field: 'typ', value, updateZiel })
                    }
                  />
                  <TextField
                    key={`${row.id}bezeichnung`}
                    label="Ziel"
                    value={row.bezeichnung}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({ row, field: 'bezeichnung', value, updateZiel })
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

export default enhance(Ziel)
