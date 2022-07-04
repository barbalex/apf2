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
import PopOrTabs from './Tabs'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FormContainer = styled.div`
  padding: 10px;
  overflow-y: auto;
`

const PopFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const { activeNodeArray, dataFilter } = store[treeName]

  // need to slice to rerender on change
  const apId = activeNodeArray.slice()[3]

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.pop.length - 1 < activeTab) {
      // filter was emtied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.pop.length])

  // need this so apFilter changes on any change inside a member of dataFilter.ap
  const dataFilterPopStringified = JSON.stringify(dataFilter.pop)

  const popFilter = useMemo(() => {
    const filterArrayInStore = dataFilter.pop ? getSnapshot(dataFilter.pop) : []
    // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
    const filterArrayInStoreWithoutEmpty = filterArrayInStore.filter(
      (f) => Object.values(f).filter((v) => v !== null).length !== 0,
    )
    const filterArray = []
    for (const filter of filterArrayInStoreWithoutEmpty) {
      const popFilter = apId ? { apId: { equalTo: apId } } : {}
      const dataFilterPop = { ...filter }
      const popApFilterValues = Object.entries(dataFilterPop).filter(
        (e) => e[1] || e[1] === 0,
      )
      popApFilterValues.forEach(([key, value]) => {
        const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
        popFilter[key] = { [expression]: value }
      })
      filterArray.push(popFilter)
    }
    return { or: filterArray }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apId, dataFilter.pop, dataFilterPopStringified])

  const { data: dataPops, error } = useQuery(queryPops, {
    variables: {
      popFilter,
      apId,
      apIdExists: !!apId,
      apIdNotExists: !apId,
    },
  })

  const row = dataFilter.pop[activeTab]
  const totalNr = apId
    ? dataPops?.pops?.totalCount ?? '...'
    : dataPops?.allPops?.totalCount ?? '...'
  const filteredNr = apId
    ? dataPops?.popsFiltered?.totalCount ?? '...'
    : dataPops?.allPopsFiltered?.totalCount ?? '...'

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

  console.log('PopFilter', {
    filteredNr,
    totalNr,
    // activeNodeArray: activeNodeArray.slice(),
    apId,
  })

  if (error) return <Error error={error} />

  // if (!row) return null

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Population"
          treeName={treeName}
          table="pop"
          totalNr={totalNr}
          filteredNr={filteredNr}
          activeTab={activeTab}
        />
        <PopOrTabs
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
              value={row?.nr}
              saveToDb={saveToDb}
            />
            <TextFieldWithInfo
              label="Name"
              name="name"
              type="text"
              popover="Dieses Feld möglichst immer ausfüllen"
              value={row?.name}
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
              value={row?.statusUnklar}
              saveToDb={saveToDb}
            />
            <TextField
              label="Begründung"
              name="statusUnklarBegruendung"
              type="text"
              multiLine
              value={row?.statusUnklarBegruendung}
              saveToDb={saveToDb}
            />
          </SimpleBar>
        </FormContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PopFilter)
