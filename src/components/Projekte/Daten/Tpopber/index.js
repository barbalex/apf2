// @flow
import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateTpopberByIdGql from './updateTpopberById'

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
  withApollo,
  withData,
)

const Tpopber = ({
  id,
  treeName,
  data,
  client,
  refetchTree,
}: {
  id: string,
  treeName: string,
  data: Object,
  client: Object,
  refetchTree: () => void,
}) => {
  const [errors, setErrors] = useState({})

  useEffect(() => setErrors({}), [id])

  const row = get(data, 'tpopberById', {})
  let tpopentwicklungWerte = get(data, 'allTpopEntwicklungWertes.nodes', [])
  tpopentwicklungWerte = sortBy(tpopentwicklungWerte, 'sort')
  tpopentwicklungWerte = tpopentwicklungWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = event.target.value
      if (value === undefined) value = null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updateTpopberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
          __typename: 'Mutation',
          updateTpopberById: {
            tpopber: {
              id: row.id,
              tpopId: field === 'tpopId' ? value : row.tpopId,
              jahr: field === 'jahr' ? value : row.jahr,
              entwicklung: field === 'entwicklung' ? value : row.entwicklung,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              tpopEntwicklungWerteByEntwicklung:
                row.tpopEntwicklungWerteByEntwicklung,
              tpopByTpopId: row.tpopByTpopId,
              __typename: 'Tpopber',
            },
            __typename: 'Tpopber',
          },
        },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
        /**
         * DO NOT do the following, because:
         * can fire after component was unmounted...
         */
        /*
      setTimeout(() => {
        const newErrors = {...errors}
        delete newErrors[field]
        setErrors(newErrors)
      }, 1000 * 10)
      */
      }
      setErrors({})
      if (['entwicklung'].includes(field)) refetchTree('tpopbers')
    },
    [id],
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
          apId={get(data, 'tpopberById.tpopByTpopId.popByPopId.apId')}
          title="Kontroll-Bericht Teil-Population"
          treeName={treeName}
          table="tpopber"
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
            dataSource={tpopentwicklungWerte}
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

export default enhance(Tpopber)
