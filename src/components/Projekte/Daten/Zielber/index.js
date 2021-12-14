import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import TextFieldFormik from '../../../shared/TextFieldFormik'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { zielber as zielberFragment } from '../../../shared/fragments'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const LoadingContainer = styled.div`
  height: 100%;
  padding: 10px;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const StyledForm = styled(Form)`
  padding: 10px;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  zielId: 'UUID',
  jahr: 'Int',
  erreichung: 'String',
  bemerkungen: 'String',
}

const Zielber = ({ treeName }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 8
          ? activeNodeArray[8]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = useMemo(() => data?.zielberById ?? {}, [data?.zielberById])

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
            mutation updateZielber(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateZielberById(
                input: {
                  id: $id
                  zielberPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                zielber {
                  ...ZielberFields
                }
              }
            }
            ${zielberFragment}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
    },
    [client, row, store.user.name],
  )

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateZielber(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateZielberById(
                input: {
                  id: $id
                  zielberPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                zielber {
                  ...ZielberFields
                }
              }
            }
            ${zielberFragment}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateZielberById: {
              zielber: {
                ...variables,
                __typename: 'Zielber',
              },
              __typename: 'Zielber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [client, row, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={activeNodeArray[3]}
          title="Ziel-Bericht"
          treeName={treeName}
          table="zielber"
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
                  <TextFieldFormik
                    name="jahr"
                    label="Jahr"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  <TextFieldFormik
                    name="erreichung"
                    label="Ziel-Erreichung"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextFieldFormik
                    name="bemerkungen"
                    label="Bemerkungen"
                    type="text"
                    multiLine
                    handleSubmit={handleSubmit}
                  />
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Zielber)
