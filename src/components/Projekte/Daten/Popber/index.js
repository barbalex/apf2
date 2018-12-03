// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updatePopberByIdGql from './updatePopberById'
import mobxStoreContext from '../../../../mobxStoreContext'

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
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withData,
  observer,
)

const Popber = ({
  treeName,
  data,
  refetchTree,
}: {
  treeName: string,
  data: Object,
  refetchTree: () => void,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const [errors, setErrors] = useState({})

  const row = get(data, 'popberById', {})

  useEffect(() => setErrors({}), [row])

  let popentwicklungWerte = get(data, 'allTpopEntwicklungWertes.nodes', [])
  popentwicklungWerte = sortBy(popentwicklungWerte, 'sort')
  popentwicklungWerte = popentwicklungWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = event.target.value || null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updatePopberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          /*optimisticResponse: {
          __typename: 'Mutation',
          updatePopberById: {
            popber: {
              id: row.id,
              popId: field === 'popId' ? value : row.popId,
              jahr: field === 'jahr' ? value : row.jahr,
              entwicklung: field === 'entwicklung' ? value : row.entwicklung,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              tpopEntwicklungWerteByEntwicklung:
                row.tpopEntwicklungWerteByEntwicklung,
              popByPopId: row.popByPopId,
              __typename: 'Popber',
            },
            __typename: 'Popber',
          },
        },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['entwicklung'].includes(field)) refetchTree('popbers')
    },
    [row],
  )

  if (data.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(data, 'popberById.popByPopId.apId')}
          title="Kontroll-Bericht Population"
          treeName={treeName}
          table="popber"
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
            key={`${row.id}entwicklung`}
            name="entwicklung"
            label="Entwicklung"
            value={row.entwicklung}
            dataSource={popentwicklungWerte}
            saveToDb={saveToDb}
            error={errors.entwicklung}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen"
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

export default enhance(Popber)
