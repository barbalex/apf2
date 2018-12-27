// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './data'
import updateTpopmassnberByIdGql from './updateTpopmassnberById'
import withAllTpopmassnErfbeurtWertes from './withAllTpopmassnErfbeurtWertes'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

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
  observer,
)

const Tpopmassnber = ({
  treeName,
  dataAllTpopmassnErfbeurtWertes,
}: {
  treeName: string,
  dataAllTpopmassnErfbeurtWertes: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { refetch } = mobxStore
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    suspend: false,
    variables: {
      id:
        activeNodeArray.length > 9
          ? activeNodeArray[9]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'tpopmassnberById', {})

  useEffect(() => setErrors({}), [row])

  let tpopmassnbeurtWerte = get(
    dataAllTpopmassnErfbeurtWertes,
    'allTpopmassnErfbeurtWertes.nodes',
    [],
  )
  tpopmassnbeurtWerte = sortBy(tpopmassnbeurtWerte, 'sort')
  tpopmassnbeurtWerte = tpopmassnbeurtWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)
      if ([undefined, ''].includes(value)) value = null
      try {
        await client.mutate({
          mutation: updateTpopmassnberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopmassnberById: {
              tpopmassnber: {
                id: row.id,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                jahr: field === 'jahr' ? value : row.jahr,
                beurteilung: field === 'beurteilung' ? value : row.beurteilung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                tpopByTpopId: row.tpopByTpopId,
                __typename: 'Tpopmassnber',
              },
              __typename: 'Tpopmassnber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['beurteilung'].includes(field)) refetch.tpopmassnbers()
    },
    [row],
  )

  if (loading || dataAllTpopmassnErfbeurtWertes.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (dataAllTpopmassnErfbeurtWertes.error) {
    return `Fehler: ${dataAllTpopmassnErfbeurtWertes.error.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(data, 'tpopmassnberById.tpopByTpopId.popByPopId.apId')}
          title="Massnahmen-Bericht Teil-Population"
          treeName={treeName}
          table="tpopmassnber"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}jahr`}
            name="jahr"
            label="Jahr"
            value={row.jahr}
            type="number"
            saveToDb={saveToDb}
            error={errors.jahr}
          />
          <RadioButtonGroup
            label="Entwicklung"
            name="beurteilung"
            value={row.beurteilung}
            dataSource={tpopmassnbeurtWerte}
            saveToDb={saveToDb}
            error={errors.beurteilung}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Interpretation"
            value={row.bemerkungen}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bemerkungen}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopmassnber)
