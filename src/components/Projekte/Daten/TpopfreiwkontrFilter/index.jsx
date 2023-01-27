import React, { useEffect, useContext, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'

import queryTpopkontrs from './queryTpopkontrs'
import FilterTitle from '../../../shared/FilterTitle'
import storeContext from '../../../../storeContext'
import TpopfreiwkontrForm from './Form'
import OrTabs from './Tabs'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
  @media print {
    font-size: 11px;
    height: auto;
    width: inherit;
    margin: 0 !important;
    padding: 0.5cm !important;
    overflow: hidden;
    page-break-after: always;
  }
`
const ScrollContainer = styled.div`
  overflow-y: auto;
`
const FilterCommentTitle = styled.div`
  margin-top: -10px;
  margin-bottom: -10px;
  padding: 0 10px;
  font-size: 0.75em;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
`
const FilterCommentList = styled.ul``
const FilterComment = styled.li`
  padding: 0 10px;
  font-size: 0.75em;
`

const Tpopfreiwkontr = () => {
  const { apId } = useParams()

  const store = useContext(storeContext)
  const tree = store.tree
  const {
    dataFilter,
    ekfGqlFilter,
    nodeLabelFilter,
    mapFilter,
    apFilter,
    artIsFiltered,
    popIsFiltered,
    tpopIsFiltered,
  } = tree

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpopfreiwkontr.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpopfreiwkontr.length])

  const row = dataFilter.tpopfreiwkontr[activeTab]

  const { data: dataTpopkontrs } = useQuery(queryTpopkontrs, {
    variables: {
      filteredFilter: ekfGqlFilter.filtered,
      allFilter: ekfGqlFilter.all,
    },
  })

  const navApFilterComment = apFilter
    ? `Navigationsbaum, "nur AP"-Filter: Nur Freiwilligen-Kontrollen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    // tpopId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Teil-Population gewählt. Es werden nur ihre Freiwilligen-Kontrollen berücksichtigt.'
    // : popId
    // ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Freiwilligen-Kontrollen berücksichtigt.' :
    apId
      ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Freiwilligen-Kontrollen berücksichtigt.'
      : undefined
  const navLabelComment = nodeLabelFilter.tpopfeldkontr
    ? `Navigationsbaum, Label-Filter: Das Label der Freiwilligen-Kontrollen wird nach "${nodeLabelFilter.tpopfeldkontr}" gefiltert.`
    : undefined
  const artHierarchyComment = artIsFiltered
    ? 'Formular-Filter, Ebene Art: Es werden nur Freiwilligen-Kontrollen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const popHierarchyComment = popIsFiltered
    ? 'Formular-Filter, Ebene Population: Es werden nur Freiwilligen-Kontrollen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const tpopHierarchyComment = tpopIsFiltered
    ? 'Formular-Filter, Ebene Teil-Population: Es werden nur Freiwilligen-Kontrollen berücksichtigt, deren Teil-Population die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment = mapFilter
    ? 'Karten-Filter: Nur Freiwilligen-Kontrollen von Teil-Populationen innerhalb des Karten-Filters werden berücksichtigt.'
    : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!artHierarchyComment ||
    !!popHierarchyComment ||
    !!tpopHierarchyComment ||
    !!mapFilter

  return (
    <Container>
      <FilterTitle
        title="Freiwilligen-Kontrollen"
        table="tpopfreiwkontr"
        totalNr={dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'}
        filteredNr={dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'}
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
            {!!tpopHierarchyComment && (
              <FilterComment>{tpopHierarchyComment}</FilterComment>
            )}
            {!!mapFilterComment && (
              <FilterComment>{mapFilterComment}</FilterComment>
            )}
          </FilterCommentList>
        </>
      )}
      <OrTabs
        dataFilter={dataFilter.tpopfreiwkontr}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ScrollContainer>
        <SimpleBar
          style={{
            maxHeight: '100%',
            height: '100%',
          }}
        >
          <TpopfreiwkontrForm row={row} activeTab={activeTab} />
        </SimpleBar>
      </ScrollContainer>
    </Container>
  )
}

export default observer(Tpopfreiwkontr)
