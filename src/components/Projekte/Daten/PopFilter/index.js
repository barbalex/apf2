import React, { useContext, useCallback, useState, useEffect } from 'react'
import styled from '@emotion/styled'
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
const FilterCommentTitle = styled.div`
  margin-top: -10px;
  padding: 0 10px 16px 10px;
  font-size: 0.75em;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
`
const FilterCommentList = styled.ul`
  margin-bottom: 10px;
`
const FilterComment = styled.li`
  margin-top: -10px;
  padding: 0 10px 0 10px;
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
    artIsFiltered,
    apFilter,
  } = store[treeName]

  // need to slice to rerender on change
  const aNA = activeNodeArray.slice()
  const apId = aNA[3]

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

  const navApFilterComment = apFilter
    ? `Navigationsbaum, "nur AP"-Filter: Nur Populationen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment = apId
    ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Populationen berücksichtigt.'
    : undefined
  const navLabelComment = nodeLabelFilter.pop
    ? `Navigationsbaum, Label-Filter: Das Label der Populationen wird nach "${nodeLabelFilter.pop}" gefiltert.`
    : undefined
  const hierarchyComment = artIsFiltered
    ? 'Formular-Filter, Ebene Art: Es werden nur Populationen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment = mapFilter
    ? 'Karten-Filter: wird angewendet.'
    : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!hierarchyComment ||
    !!mapFilter

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Population"
          treeName={treeName}
          table="pop"
          totalNr={dataPops?.pops?.totalCount ?? '...'}
          filteredNr={dataPops?.popsFiltered?.totalCount ?? '...'}
          activeTab={activeTab}
        />
        {showFilterComments && (
          <>
            <FilterCommentTitle>Zusätzlich aktive Filter:</FilterCommentTitle>
            <FilterCommentList>
              {!!navApFilterComment && (
                <FilterComment>{navApFilterComment}</FilterComment>
              )}
              {!!navHiearchyComment && (
                <FilterComment>{navHiearchyComment}</FilterComment>
              )}
              {!!navLabelComment && (
                <FilterComment>{navLabelComment}</FilterComment>
              )}
              {!!hierarchyComment && (
                <FilterComment>{hierarchyComment}</FilterComment>
              )}
              {!!mapFilterComment && (
                <FilterComment>{mapFilterComment}</FilterComment>
              )}
            </FilterCommentList>
          </>
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
