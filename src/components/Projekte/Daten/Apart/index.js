import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import SelectLoadingOptions from '../../../shared/SelectLoadingOptionsFormik'
import FormTitle from '../../../shared/FormTitle'
import updateApartByIdGql from './updateApartById'
import query from './query'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import queryAeEigById from './queryAeEigById'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const ApArt = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'apartById', {})

  const {
    data: dataAeEigById,
    loading: loadingAeEigById,
    error: errorAeEigById,
  } = useQuery(queryAeEigById, {
    variables: {
      id: row && row.artId ? row.artId : '99999999-9999-9999-9999-999999999999',
    },
  })

  // do not include already choosen assozarten
  const apartenOfAp = get(row, 'apByApId.apartsByApId.nodes', [])
    .map(o => o.artId)
    // but do include the art included in the row
    .filter(o => o !== row.artId)
    // no null values
    .filter(o => !!o)
  const aeEigenschaftenfilter = useCallback(
    inputValue =>
      !!inputValue
        ? apartenOfAp.length
          ? {
              artname: { includesInsensitive: inputValue },
              id: { notIn: apartenOfAp },
            }
          : { artname: { includesInsensitive: inputValue } }
        : { artname: { isNull: false } },
    [apartenOfAp],
  )

  // do not show any artId's that have been used?
  // Nope: because some species have already been worked as separate ap
  // because apart did not exist...
  // maybe do later

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      try {
        await client.mutate({
          mutation: updateApartByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateApartById: {
              apart: {
                ...values,
                __typename: 'Apart',
              },
              __typename: 'Apart',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
      changedField === 'artId' && refetch.aparts()
    },
    [client, refetch, row, store.user.name],
  )

  if (loading || loadingAeEigById) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorAeEigById) return `Fehler: ${errorAeEigById.message}`

  console.log('Apart rendering')

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Aktionsplan-Art"
          treeName={treeName}
          table="apart"
        />
        <FieldsContainer>
          <div>
            "Aktionsplan-Arten" sind alle Arten, welche der Aktionsplan
            behandelt. Häufig dürfte das bloss eine einzige Art sein. Folgende
            Gründe können dazu führen, dass hier mehrere aufgelistet werden:
            <ul>
              <li>Die AP-Art hat Synonyme</li>
              <li>
                Beobachtungen liegen in unterschiedlichen Taxonomien vor, z.B.
                SISF 2 und SISF 3 bzw. Checklist 2017
              </li>
              <li>
                Wenn eine Art im Rahmen des Aktionsplans inklusive nicht
                synonymer aber eng verwandter Arten gefasst wid (z.B.
                Unterarten)
              </li>
            </ul>
          </div>
          <div>
            Beobachtungen aller AP-Arten stehen im Ordner "Beobachtungen nicht
            beurteilt" zur Verfügung und können Teilpopulationen zugeordnet
            werden.
            <br />
            <br />
          </div>
          <div>
            Die im Aktionsplan gewählte namensgebende Art gibt dem Aktionsplan
            nicht nur den Namen. Unter ihrer id werden auch die Kontrollen an
            InfoFlora geliefert.
            <br />
            <br />
          </div>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form
                key={row ? row.id : 'artid'}
                onBlur={() => dirty && handleSubmit()}
              >
                <Field
                  name="artId"
                  valueLabel={
                    dataAeEigById.aeEigenschaftenById
                      ? dataAeEigById.aeEigenschaftenById.artname
                      : ''
                  }
                  label="Art"
                  row={row}
                  query={queryAeEigenschaftens}
                  filter={aeEigenschaftenfilter}
                  queryNodesName="allAeEigenschaftens"
                  component={SelectLoadingOptions}
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApArt)
