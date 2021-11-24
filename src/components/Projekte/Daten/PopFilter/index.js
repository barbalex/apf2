import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoFormik'
import Status from '../../../shared/StatusFormik'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import FilterTitle from '../../../shared/FilterTitle'
import queryPops from './queryPops'
import storeContext from '../../../../storeContext'
import { simpleTypes as popType } from '../../../../store/Tree/DataFilter/pop'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FormContainer = styled.div`
  overflow-y: auto;
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
      allPopsFilter,
      popFilter,
      popApFilter,
      apId,
      apIdExists: !!apId,
    },
  })

  let popTotalCount
  let popFilteredCount
  let popOfApTotalCount
  let popOfApFilteredCount
  const row = dataFilter.pop
  popTotalCount = dataPops?.allPops?.totalCount ?? '...'
  popFilteredCount = dataPops?.popsFiltered?.totalCount ?? '...'
  popOfApTotalCount = dataPops?.popsOfAp?.totalCount ?? '...'
  popOfApFilteredCount = dataPops?.popsOfApFiltered?.totalCount ?? '...'

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

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

  if (error) return <Error error={error} />
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
                    apJahr={row?.apByApId?.startJahr}
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
