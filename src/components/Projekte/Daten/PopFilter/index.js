import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2States'
import FilterTitle from '../../../shared/FilterTitle'
import queryPops from './queryPops'
import storeContext from '../../../../storeContext'
import { simpleTypes as popType } from '../../../../store/Tree/DataFilter/pop'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import OrTabs from './Tabs'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  overflow-y: auto;
`

const PopFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const { activeNodeArray, dataFilter } = store[treeName]

  const apId = activeNodeArray[3]

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.pop.length - 1 < activeTab) {
      // filter was emtied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.pop.length])

  const allPopsFilter = {
    apByApId: { projId: { equalTo: activeNodeArray[1] } },
  }

  const popFilter = useMemo(() => {
    const filterArrayInStore = dataFilter.pop ? getSnapshot(dataFilter.pop) : []
    // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
    const filterArrayInStoreWithoutEmpty = filterArrayInStore.filter(
      (f) => Object.values(f).filter((v) => v !== null).length !== 0,
    )
    const filterArray = []
    for (const filter of filterArrayInStoreWithoutEmpty) {
      const popFilter = {
        apId: { isNull: false },
        apByApId: { projId: { equalTo: activeNodeArray[1] } },
      }
      const dataFilterPop = { ...filter }
      const popFilterValues = Object.entries(dataFilterPop).filter(
        (e) => e[1] || e[1] === 0,
      )
      popFilterValues.forEach(([key, value]) => {
        const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
        popFilter[key] = { [expression]: value }
      })
      filterArray.push(popFilter)
    }
    return { or: filterArray }
  }, [activeNodeArray, dataFilter.pop])

  const popApFilter = useMemo(() => {
    const filterArrayInStore = dataFilter.pop ? getSnapshot(dataFilter.pop) : []
    // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
    const filterArrayInStoreWithoutEmpty = filterArrayInStore.filter(
      (f) => Object.values(f).filter((v) => v !== null).length !== 0,
    )
    const filterArray = []
    for (const filter of filterArrayInStoreWithoutEmpty) {
      const popApFilter = { apId: { equalTo: apId } }
      const dataFilterPop = { ...filter }
      const popApFilterValues = Object.entries(dataFilterPop).filter(
        (e) => e[1] || e[1] === 0,
      )
      popApFilterValues.forEach(([key, value]) => {
        const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
        popApFilter[key] = { [expression]: value }
      })
      filterArray.push(popFilter)
    }
    return { or: filterArray }
  }, [apId, dataFilter.pop, popFilter])

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

  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'pop',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
        index: activeTab,
      }),
    [activeTab, dataFilterSetValue, treeName],
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
          activeTab={activeTab}
        />
        <OrTabs
          dataFilter={dataFilter.pop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          treeName={treeName}
        />
        <FormContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <TextField
              label="Nr."
              name="nr"
              type="number"
              value={row.nr}
              saveToDb={saveToDb}
            />
            <TextFieldWithInfo
              label="Name"
              name="name"
              type="text"
              popover="Dieses Feld möglichst immer ausfüllen"
              value={row.name}
              saveToDb={saveToDb}
            />
            <Status
              apJahr={row?.apByApId?.startJahr}
              showFilter={true}
              saveToDb={saveToDb}
              row={row}
            />
            <Checkbox2States
              label="Status unklar"
              name="statusUnklar"
              value={row.statusUnklar}
              saveToDb={saveToDb}
            />
            <TextField
              label="Begründung"
              name="statusUnklarBegruendung"
              type="text"
              multiLine
              value={row.statusUnklarBegruendung}
              saveToDb={saveToDb}
            />
          </SimpleBar>
        </FormContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PopFilter)
