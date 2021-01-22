import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
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
import { ziel as zielFragment } from '../../../shared/fragments'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
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
  const { appBarHeight } = store
  const {
    activeNodeArray,
    setActiveNodeArray,
    openNodes,
    setOpenNodes,
  } = store[treeName]

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

  const row = get(data, 'zielById', {})

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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
        <FormTitle
          apId={row.apId}
          title="Ziel"
          treeName={treeName}
          table="ziel"
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
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
                    name="typ"
                    label="Zieltyp"
                    dataSource={get(dataLists, 'allZielTypWertes.nodes', [])}
                    loading={loadingLists}
                    handleSubmit={handleSubmit}
                  />
                  <TextField
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
