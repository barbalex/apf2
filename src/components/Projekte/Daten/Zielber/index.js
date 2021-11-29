import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextFieldFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { zielber as zielberFragment } from '../../../shared/fragments'

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

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 8
          ? activeNodeArray[8]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = useMemo(() => data?.zielberById ?? {}, [data?.zielberById])

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

  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }

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
                  <TextField
                    name="jahr"
                    label="Jahr"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="erreichung"
                    label="Ziel-Erreichung"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
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
