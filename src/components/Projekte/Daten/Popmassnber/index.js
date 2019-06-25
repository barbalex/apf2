import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { Formik, Form, Field } from 'formik'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryLists from './queryLists'
import updatePopmassnberByIdGql from './updatePopmassnberById'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const Popmassnber = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
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

  const row = get(data, 'popmassnberById', {})

  useEffect(() => setErrors({}), [row])

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      try {
        await client.mutate({
          mutation: updatePopmassnberByIdGql,
          variables: {
            id: values.id,
            popId: values.popId,
            jahr: values.jahr,
            beurteilung: values.beurteilung,
            bemerkungen: values.bemerkungen,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updatePopmassnberById: {
              popmassnber: {
                id: values.id,
                popId: values.popId,
                jahr: values.jahr,
                beurteilung: values.beurteilung,
                bemerkungen: values.bemerkungen,
                __typename: 'Popmassnber',
              },
              __typename: 'Popmassnber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
      changedField === 'beurteilung' && refetch.popmassnbers()
    },
    [row],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorLists) {
    return `Fehler: ${errorLists.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(data, 'popmassnberById.popByPopId.apId')}
          title="Massnahmen-Bericht Population"
          treeName={treeName}
          table="popmassnber"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="jahr"
                  label="Jahr"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="beurteilung"
                  label="Entwicklung"
                  component={RadioButtonGroup}
                  dataSource={get(
                    dataLists,
                    'allTpopmassnErfbeurtWertes.nodes',
                    [],
                  )}
                  loading={loadingLists}
                />
                <Field
                  name="bemerkungen"
                  label="Interpretation"
                  type="text"
                  component={TextField}
                  multiLine
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Popmassnber)
