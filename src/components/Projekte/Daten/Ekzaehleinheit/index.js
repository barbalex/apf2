import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import Checkbox2States from '../../../shared/Checkbox2States'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  bemerkungen: 'String',
  apId: 'UUID',
  zaehleinheitId: 'UUID',
  zielrelevant: 'Boolean',
  notMassnCountUnit: 'Boolean',
  sort: 'Int',
}

const Ekzaehleinheit = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = useMemo(
    () => data?.ekzaehleinheitById ?? {},
    [data?.ekzaehleinheitById],
  )

  const ekzaehleinheitenOfAp = (
    row?.apByApId?.ekzaehleinheitsByApId?.nodes ?? []
  ).map((o) => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekzaehleinheitenOfAp.filter((o) => o !== row.zaehleinheitId)
  const zaehleinheitWerteFilter = notToShow.length
    ? { id: { notIn: notToShow } }
    : { id: { isNull: false } }
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists, {
    variables: {
      filter: zaehleinheitWerteFilter,
    },
  })

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateEkzaehleinheit(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateEkzaehleinheitById(
                input: {
                  id: $id
                  ekzaehleinheitPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekzaehleinheit {
                  ...EkzaehleinheitFields
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    ...TpopkontrzaehlEinheitWerteFields
                  }
                }
              }
            }
            ${ekzaehleinheit}
            ${tpopkontrzaehlEinheitWerte}
          `,
          variables,
        })
      } catch (error) {
        if (
          field === 'zielrelevant' &&
          (error.message.includes('doppelter Schlüsselwert') ||
            error.message.includes('duplicate key value'))
        ) {
          return setFieldErrors({
            [field]: 'Pro Aktionsplan darf nur eine Einheit zielrelevant sein',
          })
        }
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
    },
    [client, row, store.user.name],
  )

  console.log('Ekzaehleinheit rendering, loading:', loading)

  if (loading) return <Spinner />

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="EK-Zähleinheit"
          treeName={treeName}
          table="ekzaehleinheit"
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <Select
                name="zaehleinheitId"
                label="Zähleinheit"
                options={dataLists?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
                loading={loadingLists}
                value={row.zaehleinheitId}
                saveToDb={saveToDb}
                error={fieldErrors.zaehleinheitId}
              />
              <Checkbox2States
                name="zielrelevant"
                label="zielrelevant"
                value={row.zielrelevant}
                saveToDb={saveToDb}
                error={fieldErrors.zielrelevant}
              />
              {row.zielrelevant && (
                <Checkbox2States
                  name="notMassnCountUnit"
                  label="Entspricht bewusst keiner Massnahmen-Zähleinheit ('Anzahl Pflanzen' oder 'Anzahl Triebe')"
                  value={row.notMassnCountUnit}
                  saveToDb={saveToDb}
                  error={fieldErrors.notMassnCountUnit}
                />
              )}
              <TextField
                name="sort"
                label="Sortierung"
                type="number"
                value={row.sort}
                saveToDb={saveToDb}
                error={fieldErrors.sort}
              />
              <TextField
                name="bemerkungen"
                label="Bemerkungen"
                type="text"
                multiLine
                value={row.bemerkungen}
                saveToDb={saveToDb}
                error={fieldErrors.bemerkungen}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ekzaehleinheit)
