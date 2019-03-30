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
import query from './query'
import updatePopmassnberByIdGql from './updatePopmassnberById'
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

const Popmassnber = ({
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
    variables: {
      id:
        activeNodeArray.length > 7
          ? activeNodeArray[7]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'popmassnberById', {})

  useEffect(() => setErrors({}), [row])

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

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updatePopmassnberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
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
      if (['beurteilung'].includes(field)) refetch.popmassnbers()
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
          apId={get(data, 'popmassnberById.popByPopId.apId')}
          title="Massnahmen-Bericht Population"
          treeName={treeName}
          table="popmassnber"
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
            key={`${row.id}beurteilung`}
            name="beurteilung"
            label="Entwicklung"
            value={row.beurteilung}
            dataSource={popbeurteilungWerte}
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

export default enhance(Popmassnber)
