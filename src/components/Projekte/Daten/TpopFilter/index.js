import React, { useCallback, useContext, useState, useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import FilterTitle from '../../../shared/FilterTitle'
import queryTpops from './queryTpops'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import Ek from './Ek'
import Tpop from './Tpop'
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
const FieldsContainer = styled.div`
  height: 100%;
  overflow: hidden !important;
  overflow-y: auto;
  fieldset {
    padding-right: 30px;
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: calc(100% - 48px);
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

const TpopFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue, urlQuery } = store

  const {
    activeNodeArray,
    dataFilter,
    tpopGqlFilter,
    nodeLabelFilter,
    mapFilter,
    apFilter,
    artIsFiltered,
    popIsFiltered,
    popGqlFilter,
  } = store[treeName]
  const [tab, setTab] = useState(urlQuery?.tpopTab ?? 'tpop')
  const onChangeTab = useCallback((event, value) => setTab(value), [])

  // need to slice to rerender on change
  const aNA = activeNodeArray.slice()
  const apId = aNA[3]
  const popId = aNA[5]
  const tpopId = aNA[7]

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpop.length - 1 < activeTab) {
      // filter was emtied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpop.length])

  const { data: dataTpops, error } = useQuery(queryTpops, {
    variables: {
      filteredFilter: tpopGqlFilter.filtered,
      allFilter: tpopGqlFilter.all,
    },
  })

  const row = dataFilter.tpop[activeTab]

  // console.log('TpopFilter', {
  //   dataTpops,
  //   mapFilter: mapFilter ? getSnapshot(mapFilter) : undefined,
  // })

  const [fieldErrors, setFieldErrors] = useState({})
  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'tpop',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
        index: activeTab,
      }),
    [activeTab, dataFilterSetValue, treeName],
  )

  const navApFilterComment = apFilter
    ? `Navigationsbaum, "nur AP"-Filter: Nur Teil-Populationen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment = tpopId
    ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Teil-Population gewählt. Es wird nur diese berücksichtigt.'
    : popId
    ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Teil-Populationen berücksichtigt.'
    : apId
    ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Teil-Populationen berücksichtigt.'
    : undefined
  const navLabelComment = nodeLabelFilter.tpop
    ? `Navigationsbaum, Label-Filter: Das Label der Teil-Populationen wird nach "${nodeLabelFilter.tpop}" gefiltert.`
    : undefined
  // TODO: expand to pop
  const artHierarchyComment = artIsFiltered
    ? 'Formular-Filter, Ebene Art: Es werden nur Teil-Populationen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment = popIsFiltered
    ? 'Formular-Filter, Ebene Population: Es werden nur Teil-Populationen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment = mapFilter
    ? 'Karten-Filter: wird angewendet.'
    : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!artHierarchyComment ||
    !!popHierarchyComment ||
    !!mapFilter

  console.log('TPopFilter', { popGqlFilter })

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Teil-Population"
          treeName={treeName}
          table="tpop"
          totalNr={dataTpops?.allTpops?.totalCount ?? '...'}
          filteredNr={dataTpops?.allTpopsFiltered?.totalCount ?? '...'}
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
              {!!artHierarchyComment && (
                <FilterComment>{artHierarchyComment}</FilterComment>
              )}
              {!!popHierarchyComment && (
                <FilterComment>{popHierarchyComment}</FilterComment>
              )}
              {!!mapFilterComment && (
                <FilterComment>{mapFilterComment}</FilterComment>
              )}
            </FilterCommentList>
          </>
        )}
        <PopOrTabs
          dataFilter={dataFilter.tpop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          treeName={treeName}
        />
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab label="Teil-Population" value="tpop" data-id="tpop" />
            <StyledTab label="EK" value="ek" data-id="ek" />
          </Tabs>
          <TabContent>
            {tab === 'tpop' ? (
              <Tpop
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                row={row}
                treeName={treeName}
                rowStringified={JSON.stringify(row)}
              />
            ) : (
              <Ek
                treeName={treeName}
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                row={row}
              />
            )}
          </TabContent>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TpopFilter)
