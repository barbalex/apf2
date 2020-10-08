import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Formik, Form, Field } from 'formik'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoFormik'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import FilterTitle from '../../../shared/FilterTitle'
import queryPops from './queryPops'
import storeContext from '../../../../storeContext'
import { simpleTypes as popType } from '../../../../store/Tree/DataFilter/pop'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  height: calc(100vh - 145px);
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`
const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  overflow-y: auto !important;
  height: calc(100% - 43px - 48px + 4px);
`

const Pop = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const { activeNodeArray, dataFilter } = store[treeName]

  const apId = activeNodeArray[3]

  const allPopsFilter = {
    apByApId: { projId: { equalTo: activeNodeArray[1] } },
  }
  const popFilter = {
    apId: { isNull: false },
    apByApId: { projId: { equalTo: activeNodeArray[1] } },
  }
  const popFilterValues = Object.entries(dataFilter.pop).filter(
    (e) => e[1] || e[1] === 0,
  )
  popFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    popFilter[key] = { [expression]: value }
  })
  const popApFilter = { apId: { equalTo: apId } }
  const popApFilterValues = Object.entries(dataFilter.pop).filter(
    (e) => e[1] || e[1] === 0,
  )
  popApFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
    popApFilter[key] = { [expression]: value }
  })
  const { data: dataPops, error } = useQuery(queryPops, {
    variables: {
      showFilter: true,
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
  const row = dataFilter.pop
  popTotalCount = get(dataPops, 'allPops.totalCount', '...')
  popFilteredCount = get(dataPops, 'popsFiltered.totalCount', '...')
  popOfApTotalCount = get(dataPops, 'popsOfAp.totalCount', '...')
  popOfApFilteredCount = get(dataPops, 'popsOfApFiltered.totalCount', '...')

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      return dataFilterSetValue({
        treeName,
        table: 'pop',
        key: changedField,
        value,
      })
    },
    [dataFilterSetValue, row, treeName],
  )

  if (error) return `Fehler beim Laden der Daten: ${error.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Population"
          treeName={treeName}
          table="pop"
          totalNr={popTotalCount}
          filteredNr={popFilteredCount}
          totalApNr={popOfApTotalCount}
          filteredApNr={popOfApFilteredCount}
        />
        <FormContainer>
          <Formik
            key={row}
            initialValues={row}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <TextField label="Nr." name="nr" type="number" />
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
                  showFilter={true}
                  component={Status}
                />
                <Field
                  label="Status unklar"
                  name="statusUnklar"
                  component={Checkbox2States}
                />
                <TextField
                  label="Begründung"
                  name="statusUnklarBegruendung"
                  type="text"
                  multiLine
                />
              </Form>
            )}
          </Formik>
        </FormContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Pop)
