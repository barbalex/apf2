import React, { useContext, useCallback, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form, Field } from 'formik'
import { gql } from '@apollo/client'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoFormik'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import Coordinates from '../../../shared/Coordinates'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { pop } from '../../../shared/fragments'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  padding: 10px;
`
const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  overflow-y: auto !important;
  height: calc(100% - 43px - 48px + 4px);
`
const FilesContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 43px);
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`

const fieldTypes = {
  apId: 'UUID',
  nr: 'Int',
  name: 'String',
  status: 'Int',
  statusUnklar: 'Boolean',
  statusUnklarBegruendung: 'String',
  bekanntSeit: 'Int',
}

const Pop = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { refetch, urlQuery, setUrlQuery } = store
  const { activeNodeArray, datenWidth } = store[treeName]

  let id =
    activeNodeArray.length > 5
      ? activeNodeArray[5]
      : '99999999-9999-9999-9999-999999999999'

  const { data, loading, error, refetch: refetchPop } = useQuery(query, {
    variables: {
      id,
    },
  })

  const [tab, setTab] = useState(get(urlQuery, 'popTab', 'pop'))
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'popTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  const row = get(data, 'popById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // when GeomPoint is changed, Coordinates takes over
      // need to return
      if (changedField === null) return

      const value = values[changedField]
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updatePopForPop(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updatePopById(
                input: {
                  id: $id
                  popPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                pop {
                  ...PopFields
                }
              }
            }
            ${pop}
          `,
          variables,
          // no optimistic responce as geomPoint
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      // update pop on map
      if (
        (value &&
          row &&
          ((changedField === 'lv95Y' && row.lv95X) ||
            (changedField === 'lv95X' && row.lv95Y))) ||
        (!value && (changedField === 'lv95Y' || changedField === 'lv95X'))
      ) {
        if (refetch.popForMap) refetch.popForMap()
      }
      setErrors({})
    },
    [client, refetch, row, store.user.name],
  )

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Lade...</LoadingContainer>
      </Container>
    )
  }
  if (error) return `Fehler beim Laden der Daten: ${error.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(data, 'popById.apId')}
          title="Population"
          treeName={treeName}
        />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Population" value="pop" data-id="pop" />
          <StyledTab label="Dateien" value="dateien" data-id="dateien" />
        </Tabs>
        {tab === 'pop' && (
          <FormContainer>
            <Formik
              key={row.id}
              initialValues={row}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty }) => (
                <Form onBlur={() => dirty && handleSubmit()}>
                  <Field
                    label="Nr."
                    name="nr"
                    type="number"
                    component={TextField}
                  />
                  <Field
                    label="Name"
                    name="name"
                    type="text"
                    popover="Dieses Feld möglichst immer ausfüllen"
                    component={TextFieldWithInfo}
                  />
                  <Field
                    apJahr={get(row, 'apByApId.startJahr')}
                    treeName={treeName}
                    showFilter={false}
                    component={Status}
                  />
                  <Field
                    label="Status unklar"
                    name="statusUnklar"
                    component={Checkbox2States}
                  />
                  <Field
                    label="Begründung"
                    name="statusUnklarBegruendung"
                    type="text"
                    multiLine
                    component={TextField}
                  />
                  <Coordinates row={row} refetchForm={refetchPop} table="pop" />
                </Form>
              )}
            </Formik>
          </FormContainer>
        )}
        {tab === 'dateien' && (
          <FilesContainer data-width={datenWidth}>
            <Files parentId={row.id} parent="pop" />
          </FilesContainer>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Pop)
