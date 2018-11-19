// @flow
import React, { useContext, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import { withApollo } from 'react-apollo'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import RadioButton from '../../../shared/RadioButton'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updatePopByIdGql from './updatePopById'
import withData from './withData'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const enhance = compose(
  withApollo,
  withData,
  observer,
)

const Pop = ({
  // pass in fake id to avoid error when filter is shown
  // which means there is no id
  id = '99999999-9999-9999-9999-999999999999',
  treeName,
  data,
  client,
}: {
  id: string,
  treeName: string,
  data: Object,
  client: Object,
}) => {
  if (data.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`

  const { nodeFilter, nodeFilterSetValue } = useContext(mobxStoreContext)

  const showFilter = !!nodeFilter[treeName].activeTable
  let row
  if (showFilter) {
    row = nodeFilter[treeName].pop
  } else {
    row = get(data, 'popById', {})
  }

  const [errors, setErrors] = useState({})

  useEffect(() => setErrors({}), [id])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = event.target.value || null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'pop',
          key: field,
          value,
        })
        //refetchTree()
      } else {
        try {
          client.mutate({
            mutation: updatePopByIdGql,
            variables: {
              id: row.id,
              [field]: value,
            },
            /*optimisticResponse: {
            __typename: 'Mutation',
            updatePopById: {
              pop: {
                id: row.id,
                apId: field === 'apId' ? value : row.apId,
                nr: field === 'nr' ? value : row.nr,
                name: field === 'name' ? value : row.name,
                status: field === 'status' ? value : row.status,
                statusUnklar:
                  field === 'statusUnklar' ? value : row.statusUnklar,
                statusUnklarBegruendung:
                  field === 'statusUnklarBegruendung'
                    ? value
                    : row.statusUnklarBegruendung,
                bekanntSeit:
                  field === 'bekanntSeit' ? value : row.bekanntSeit,
                x: field === 'x' ? value : row.x,
                y: field === 'y' ? value : row.y,
                apByApId: row.apByApId,
                __typename: 'Pop',
              },
              __typename: 'Pop',
            },
          },*/
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        setErrors({})
      }
    },
    [id, showFilter],
  )

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <FormTitle
          apId={get(data, 'popById.apId')}
          title="Population"
          treeName={treeName}
          table="pop"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}nr`}
            label="Nr."
            name="nr"
            value={row.nr}
            type="number"
            saveToDb={saveToDb}
            error={errors.nr}
          />
          <TextFieldWithInfo
            key={`${row.id}name`}
            label="Name"
            name="name"
            value={row.name}
            type="text"
            saveToDb={saveToDb}
            error={errors.name}
            popover="Dieses Feld möglichst immer ausfüllen"
          />
          <Status
            key={`${row.id}status`}
            apJahr={get(row, 'apByApId.startJahr')}
            herkunftValue={row.status}
            bekanntSeitValue={row.bekanntSeit}
            saveToDb={saveToDb}
            treeName={treeName}
          />
          <RadioButton
            key={`${row.id}statusUnklar`}
            label="Status unklar"
            name="statusUnklar"
            value={row.statusUnklar}
            saveToDb={saveToDb}
            error={errors.statusUnklar}
          />
          <TextField
            key={`${row.id}statusUnklarBegruendung`}
            label="Begründung"
            name="statusUnklarBegruendung"
            value={row.statusUnklarBegruendung}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.statusUnklarBegruendung}
          />
          <TextField
            key={`${row.id}x`}
            label="X-Koordinaten"
            name="x"
            value={row.x}
            type="number"
            saveToDb={saveToDb}
            error={errors.x}
          />
          <TextField
            key={`${row.id}y`}
            label="Y-Koordinaten"
            name="y"
            value={row.y}
            type="number"
            saveToDb={saveToDb}
            error={errors.y}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Pop)
