import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoFormik'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import updatePopByIdGql from './updatePopById'
import query from './query'
import queryPops from './queryPops'
import storeContext from '../../../../storeContext'
import { simpleTypes as popType } from '../../../../store/Tree/DataFilter/pop'
import Coordinates from '../../../shared/Coordinates'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

const Container = styled.div`
  height: ${props =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
`

const Pop = ({ treeName, showFilter = false }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { dataFilterSetValue, refetch } = store
  const { activeNodeArray, dataFilter } = store[treeName]

  let id =
    activeNodeArray.length > 5
      ? activeNodeArray[5]
      : '99999999-9999-9999-9999-999999999999'
  const apId = activeNodeArray[3]
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'

  const { data, loading, error, refetch: refetchPop } = useQuery(query, {
    variables: {
      id,
    },
  })

  const allPopsFilter = {
    apByApId: { projId: { equalTo: activeNodeArray[1] } },
  }
  const popFilter = {
    apId: { isNull: false },
    apByApId: { projId: { equalTo: activeNodeArray[1] } },
  }
  const popFilterValues = Object.entries(dataFilter.pop).filter(
    e => e[1] || e[1] === 0,
  )
  popFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    popFilter[key] = { [expression]: value }
  })
  const popApFilter = { apId: { equalTo: apId } }
  const popApFilterValues = Object.entries(dataFilter.pop).filter(
    e => e[1] || e[1] === 0,
  )
  popApFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    popApFilter[key] = { [expression]: value }
  })
  const { data: dataPops } = useQuery(queryPops, {
    variables: {
      showFilter,
      allPopsFilter,
      popFilter,
      popApFilter,
      apId,
    },
  })

  let popTotalCount
  let popFilteredCount
  let popOfApTotalCount
  let popOfApFilteredCount
  let row
  if (showFilter) {
    row = dataFilter.pop
    popTotalCount = get(dataPops, 'allPops.totalCount', '...')
    popFilteredCount = get(dataPops, 'popsFiltered.totalCount', '...')
    popOfApTotalCount = get(dataPops, 'popsOfAp.totalCount', '...')
    popOfApFilteredCount = get(dataPops, 'popsOfApFiltered.totalCount', '...')
  } else {
    row = get(data, 'popById', {})
  }

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      if (showFilter) {
        return dataFilterSetValue({
          treeName,
          table: 'pop',
          key: changedField,
          value,
        })
      } else {
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
      }
    },
    [
      client,
      dataFilterSetValue,
      refetch,
      row,
      showFilter,
      store.user.name,
      treeName,
    ],
  )

  if (!showFilter && loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        {showFilter ? (
          <FilterTitle
            title="Population"
            treeName={treeName}
            table="pop"
            totalNr={popTotalCount}
            filteredNr={popFilteredCount}
            totalApNr={popOfApTotalCount}
            filteredApNr={popOfApFilteredCount}
          />
        ) : (
          <FormTitle
            apId={get(data, 'popById.apId')}
            title="Population"
            treeName={treeName}
          />
        )}
        <FieldsContainer>
          <Formik
            key={showFilter ? row : row.id}
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
                  showFilter={showFilter}
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
                {!showFilter && (
                  <Coordinates row={row} refetchForm={refetchPop} table="pop" />
                )}
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Pop)
