import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments'

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
  popId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

const Popber = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 7
          ? activeNodeArray[7]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = useMemo(() => data?.popberById ?? {}, [data?.popberById])

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
            mutation updatePopber(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updatePopberById(
                input: {
                  id: $id
                  popberPatch: {
                    ${changedField}: $${changedField}
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
          optimisticResponse: {
            __typename: 'Mutation',
            updatePopberById: {
              popber: {
                ...variables,
                __typename: 'Popber',
              },
              __typename: 'Popber',
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

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
  ]
  if (errors.length) return <Error errors={errors} />

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
            <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
                  <TextField
                    name="jahr"
                    label="Jahr"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  <RadioButtonGroup
                    name="entwicklung"
                    label="Entwicklung"
                    dataSource={
                      dataLists?.allTpopEntwicklungWertes?.nodes ?? []
                    }
                    loading={loadingLists}
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

export default observer(Popber)
