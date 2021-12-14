import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import RadioButtonGroupFormik from '../../../shared/RadioButtonGroupFormik'
import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextFieldFormik from '../../../shared/TextFieldFormik'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { ziel as zielFragment } from '../../../shared/fragments'
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
  apId: 'UUID',
  typ: 'Int',
  jahr: 'Int',
  bezeichnung: 'String',
}

const Ziel = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { activeNodeArray, setActiveNodeArray, openNodes, setOpenNodes } =
    store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 6
          ? activeNodeArray[6]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = useMemo(() => data?.zielById ?? {}, [data?.zielById])

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
            mutation updateZiel(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateZielById(
                input: {
                  id: $id
                  zielPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ziel {
                  ...ZielFields
                }
              }
            }
            ${zielFragment}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      // if jahr of ziel is updated, activeNodeArray und openNodes need to change
      if (field === 'jahr') {
        const newActiveNodeArray = [...activeNodeArray]
        newActiveNodeArray[5] = +value
        const oldParentNodeUrl = [...activeNodeArray]
        oldParentNodeUrl.pop()
        const newParentNodeUrl = [...newActiveNodeArray]
        newParentNodeUrl.pop()
        let newOpenNodes = openNodes.map((n) => {
          if (isEqual(n, activeNodeArray)) return newActiveNodeArray
          if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
          return n
        })
        setActiveNodeArray(newActiveNodeArray)
        setOpenNodes(newOpenNodes)
      }
    },
    [
      row,
      client,
      store.user.name,
      activeNodeArray,
      openNodes,
      setActiveNodeArray,
      setOpenNodes,
    ],
  )

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      const value = values[changedField]
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateZiel(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateZielById(
                input: {
                  id: $id
                  zielPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                ziel {
                  ...ZielFields
                }
              }
            }
            ${zielFragment}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateZielById: {
              ziel: {
                ...variables,
                __typename: 'Ziel',
              },
              __typename: 'Ziel',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
      // if jahr of ziel is updated, activeNodeArray und openNodes need to change
      if (changedField === 'jahr') {
        const newActiveNodeArray = [...activeNodeArray]
        newActiveNodeArray[5] = +value
        const oldParentNodeUrl = [...activeNodeArray]
        oldParentNodeUrl.pop()
        const newParentNodeUrl = [...newActiveNodeArray]
        newParentNodeUrl.pop()
        let newOpenNodes = openNodes.map((n) => {
          if (isEqual(n, activeNodeArray)) return newActiveNodeArray
          if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
          return n
        })
        setActiveNodeArray(newActiveNodeArray)
        setOpenNodes(newOpenNodes)
      }
    },
    [
      row,
      client,
      store.user.name,
      activeNodeArray,
      openNodes,
      setActiveNodeArray,
      setOpenNodes,
    ],
  )

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
          title="Ziel"
          treeName={treeName}
          table="ziel"
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
                  <RadioButtonGroupFormik
                    name="typ"
                    label="Zieltyp"
                    dataSource={dataLists?.allZielTypWertes?.nodes ?? []}
                    loading={loadingLists}
                    handleSubmit={handleSubmit}
                  />
                  <TextFieldFormik
                    name="bezeichnung"
                    label="Ziel"
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

export default observer(Ziel)
