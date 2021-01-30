import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextFieldFormik'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

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

const TpopkontrzaehlEinheitWerte = ({ treeName, table }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { refetch: refetchTree, appBarHeight } = store
  const { activeNodeArray } = store[treeName]

  const id =
    activeNodeArray.length > 2
      ? activeNodeArray[2]
      : '99999999-9999-9999-9999-999999999999'
  const query = gql`
    query werteByIdQuery($id: UUID!) {
      tpopkontrzaehlEinheitWerteById(id: $id) {
        id
        code
        text
        correspondsToMassnAnzPflanzen
        correspondsToMassnAnzTriebe
        sort
      }
    }
  `
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = data?.tpopkontrzaehlEinheitWerteById ?? {}

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      try {
        const mutation = gql`
          mutation updateWert(
            $id: UUID!
            $code: Int
            $text: String
            $correspondsToMassnAnzPflanzen: Boolean
            $correspondsToMassnAnzTriebe: Boolean
            $sort: Int
            $changedBy: String
          ) {
            updateTpopkontrzaehlEinheitWerteById(
              input: {
                id: $id
                tpopkontrzaehlEinheitWertePatch: {
                  id: $id
                  code: $code
                  text: $text
                  correspondsToMassnAnzPflanzen: $correspondsToMassnAnzPflanzen
                  correspondsToMassnAnzTriebe: $correspondsToMassnAnzTriebe
                  sort: $sort
                  changedBy: $changedBy
                }
              }
            ) {
              tpopkontrzaehlEinheitWerte {
                id
                code
                text
                correspondsToMassnAnzPflanzen
                correspondsToMassnAnzTriebe
                sort
                changedBy
              }
            }
          }
        `
        const variables = {
          ...objectsEmptyValuesToNull(values),
          changedBy: store.user.name,
        }
        //console.log('TpopkontrzaehlEinheitWerte:', { variables, __typename, updateName })
        await client.mutate({
          mutation,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlEinheitWerte: {
              id: row.id,
              __typename: 'TpopkontrzaehlEinheitWerte',
              content: variables,
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      refetch()
      const refetchTableName = `${table}s`
      // for unknown reason refetching is necessary here
      refetchTree[refetchTableName] && refetchTree[refetchTableName]()
      setErrors({})
    },
    [client, refetch, refetchTree, row, store.user.name, table],
  )

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
        <FormTitle
          apId={row.apId}
          title={table}
          treeName={treeName}
          table={table}
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik
              row={row}
              initialValues={row}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
                  <TextField
                    name="text"
                    label="Text"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="code"
                    label="Code"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  <Checkbox2States
                    name="correspondsToMassnAnzPflanzen"
                    label="Entspricht 'Anzahl Pflanzen' in Massnahmen"
                    handleSubmit={handleSubmit}
                  />
                  <Checkbox2States
                    name="correspondsToMassnAnzTriebe"
                    label="Entspricht 'Anzahl Triebe' in Massnahmen"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="sort"
                    label="Sort"
                    type="number"
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

export default observer(TpopkontrzaehlEinheitWerte)
