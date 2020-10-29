import React, { useContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

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
  height: calc(100vh - 64px - 81px);
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`
const LoadingContainer = styled.div`
  height: calc(100vh - 64px - 81px);
  background-color: #ffd3a7;
`
const FormContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
  padding: 10px;
  padding-top: 0;
`

const PopFilter = ({ treeName }) => {
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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (error) {
    return (
      <LoadingContainer>{`Fehler beim Laden der Daten: ${error.message}`}</LoadingContainer>
    )
  }
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
          setFormTitleHeight={setFormTitleHeight}
        />
        <FormContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik
              key={row}
              initialValues={row}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
                  <TextField
                    label="Nr."
                    name="nr"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  <TextFieldWithInfo
                    label="Name"
                    name="name"
                    type="text"
                    popover="Dieses Feld möglichst immer ausfüllen"
                    handleSubmit={handleSubmit}
                  />
                  <Status
                    apJahr={get(row, 'apByApId.startJahr')}
                    treeName={treeName}
                    showFilter={true}
                    handleSubmit={handleSubmit}
                  />
                  <Checkbox2States
                    label="Status unklar"
                    name="statusUnklar"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    label="Begründung"
                    name="statusUnklarBegruendung"
                    type="text"
                    multiLine
                    handleSubmit={handleSubmit}
                  />
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FormContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PopFilter)
