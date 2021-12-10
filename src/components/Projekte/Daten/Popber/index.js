import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Spinner from '../../../shared/Spinner'
import Error from '../../../shared/Error'
import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments'

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
  popId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

const Popber = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 7
          ? activeNodeArray[7]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = useMemo(() => data?.popberById ?? {}, [data?.popberById])

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
          mutation updatePopber(
            $id: UUID!
            $${field}: ${fieldTypes[field]}
            $changedBy: String
          ) {
            updatePopberById(
              input: {
                id: $id
                popberPatch: {
                  ${field}: $${field}
                  changedBy: $changedBy
                }
              }
            ) {
              popber {
                ...PopberFields
                tpopEntwicklungWerteByEntwicklung {
                  ...TpopEntwicklungWerteFields
                }
                popByPopId {
                  ...PopFields
                }
              }
            }
          }
          ${pop}
          ${popber}
          ${tpopEntwicklungWerte}
        `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      // only set if necessary (to reduce renders)
      if (Object.keys(fieldErrors).length) {
        setFieldErrors({})
      }
    },
    [client, fieldErrors, row, store.user.name],
  )
  console.log('Popber rendering, loading:', loading)

  if (loading) return <Spinner />

  if (error) return <Error errors={[error]} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={data?.popberById?.popByPopId?.apId}
          title="Kontroll-Bericht Population"
          treeName={treeName}
          table="popber"
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <TextField
                name="jahr"
                label="Jahr"
                type="number"
                value={row.jahr}
                saveToDb={saveToDb}
                error={fieldErrors.jahr}
              />
              <RadioButtonGroup
                name="entwicklung"
                label="Entwicklung"
                dataSource={data?.allTpopEntwicklungWertes?.nodes ?? []}
                loading={loading}
                value={row.entwicklung}
                saveToDb={saveToDb}
                error={fieldErrors.entwicklung}
              />
              <TextField
                name="bemerkungen"
                label="Bemerkungen"
                type="text"
                value={row.bemerkungen}
                multiLine
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

export default observer(Popber)
