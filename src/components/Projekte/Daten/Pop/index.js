import React, { useContext, useCallback, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoFormik'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import FormTitle from '../../../shared/FormTitle'
import updatePopByIdGql from './updatePopById'
import query from './query'
import storeContext from '../../../../storeContext'
import Coordinates from '../../../shared/Coordinates'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ErrorBoundary from '../../../shared/ErrorBoundary'

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
      const value = values[changedField]
      let geomPoint = get(values, 'geomPoint.geojson') || null
      if (geomPoint) {
        geomPoint = JSON.parse(geomPoint)
        // need to add crs otherwise PostGIS v2.5 (on server) errors
        geomPoint.crs = {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326',
          },
        }
      }
      const variables = {
        ...objectsEmptyValuesToNull(values),
        // need to pass geomPoint as GeoJSON
        geomPoint,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: updatePopByIdGql,
          variables,
          // no optimistic responce as geomPoint
          /*optimisticResponse: {
              __typename: 'Mutation',
              updatePopById: {
                pop: {
                  ...variables,
                  // need to pass geomPoint with its typename
                  geomPoint: values.geomPoint,
                  __typename: 'Pop',
                },
                __typename: 'Pop',
              },
            },*/
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
  if (error) return `Fehler: ${error.message}`
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
