import React, { useContext, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2States'
import FilterTitle from '../../../shared/FilterTitle'
import queryPops from './queryPops'
import storeContext from '../../../../storeContext'
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
const FilterComment = styled.div`
  margin-top: -10px;
  padding: 0 10px 16px 10px;
  font-size: 0.75em;
`

const PopFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const {
    activeNodeArray,
    dataFilter,
    nodeLabelFilter,
    popGqlFilter,
    mapFilter,
  } = store[treeName]

  // need to slice to rerender on change
  const apId = activeNodeArray.slice()[3]

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.pop.length - 1 < activeTab) {
      // filter was emtied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.pop.length])

  const { data: dataPops, error } = useQuery(queryPops, {
    variables: {
      filteredFilter: popGqlFilter.filtered,
      allFilter: popGqlFilter.all,
    },
  })

  const row = dataFilter.pop[activeTab]
  const totalNr = dataPops?.pops?.totalCount ?? '...'
  const filteredNr = dataPops?.popsFiltered?.totalCount ?? '...'

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

  const hiearchyComment = apId
    ? 'Im Navigationsbaum ist eine Art gewählt. Es werden (nur) ihre Populationen berücksichtigt.'
    : 'Es werden alle Populationen des Projekts berücksichtigt.'

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
        <FilterComment>{hiearchyComment}</FilterComment>
        {!!nodeLabelFilter.pop && (
          <FilterComment>{`Gemäss Navigationsbaum wird das Label der Populationen nach "${nodeLabelFilter.pop}" gefiltert.`}</FilterComment>
        )}
        {!!mapFilter && (
          <FilterComment>
            Der gesetzte Karten-Filter wird angewendet.
          </FilterComment>
        )}
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
