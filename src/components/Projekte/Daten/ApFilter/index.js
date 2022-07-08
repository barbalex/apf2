import React, { useContext, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import FilterTitle from '../../../shared/FilterTitle'
import queryAeTaxonomiesById from './queryAeTaxonomiesById'
import queryLists from './queryLists'
import queryAps from './queryAps'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
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
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const FormContainer = styled.div`
  padding: 10px;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: rgb(46, 125, 50);
  color: white;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const LabelPopoverRowColumnLeft = styled.div`
  width: 110px;
`
const LabelPopoverRowColumnRight = styled.div`
  padding-left: 5px;
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

const ApFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const {
    dataFilter,
    apFilter: nurApFilter,
    nodeLabelFilter,
    apGqlFilter,
    activeNodeArray,
  } = store[treeName]

  // need to slice to rerender on change
  const aNA = activeNodeArray.slice()
  const apId = aNA[3]

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.ap.length - 1 < activeTab) {
      // filter was emtied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.ap.length])

  const { data: apsData, error: apsError } = useQuery(queryAps, {
    variables: {
      filteredFilter: apGqlFilter.filtered,
      allFilter: apGqlFilter.all,
    },
  })

  const {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
  } = useQuery(queryAdresses)

  const {
    data: dataLists,
    error: errorLists,
    loading: loadingLists,
  } = useQuery(queryLists)

  const {
    data: dataAeTaxonomiesById,
    error: errorAeTaxonomiesById,
    loading: loadingAeTaxonomiesById,
  } = useQuery(queryAeTaxonomiesById, {
    variables: {
      id: dataFilter.ap?.[activeTab]?.artId,
      run: !!dataFilter.ap?.[activeTab]?.artId,
    },
  })

  const artname =
    !!dataFilter.ap?.[activeTab]?.artId && !loadingAeTaxonomiesById
      ? dataAeTaxonomiesById?.aeTaxonomyById?.artname ?? ''
      : ''

  const row = dataFilter.ap[activeTab]
  // console.log('ApFilter', { row: row ? getSnapshot(row) : undefined, artname })

  const saveToDb = useCallback(
    (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      dataFilterSetValue({
        treeName,
        table: 'ap',
        key: field,
        value,
        index: activeTab,
      })
    },
    [activeTab, dataFilterSetValue, treeName],
  )

  const aeTaxonomiesFilter = useCallback(
    (inputValue) => {
      let filter = { apByArtIdExists: true }
      if (inputValue) filter.artname = { includesInsensitive: inputValue }
      if (nurApFilter) filter.apByArtId = { bearbeitung: { in: [1, 2, 3] } }
      return filter
    },
    [nurApFilter],
  )

  const errors = [
    ...(errorAdresses ? [errorAdresses] : []),
    ...(apsError ? [apsError] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorAeTaxonomiesById ? [errorAeTaxonomiesById] : []),
  ]

  const navApFilterComment = nurApFilter
    ? `Navigationsbaum, "nur AP"-Filter: Nur AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment = apId
    ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es wird nur diese berücksichtigt.'
    : undefined
  const navLabelComment = nodeLabelFilter.ap
    ? `Navigationsbaum, Label-Filter: Das Label der Art wird nach "${nodeLabelFilter.ap}" gefiltert.`
    : undefined

  const showFilterComments =
    !!navApFilterComment || !!navHiearchyComment || !!navLabelComment

  if (errors.length) return <Error errors={errors} />

  if (!row) return null

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Art"
          treeName={treeName}
          table="ap"
          totalNr={apsData?.allAps?.totalCount ?? '...'}
          filteredNr={apsData?.filteredAps?.totalCount ?? '...'}
          // need to pass row even though not used
          // to ensure title re-renders an change of row
          row={row}
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
            </FilterCommentList>
          </>
        )}
        <OrTabs
          dataFilter={dataFilter.ap}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          treeName={treeName}
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <SelectLoadingOptions
                field="artId"
                valueLabelPath="aeTaxonomyByArtId.artname"
                label="Art (das namensgebende Taxon)"
                row={{
                  ...row,
                  ...{
                    aeTaxonomyByArtId: {
                      artname,
                    },
                  },
                }}
                query={queryAeTaxonomies}
                filter={aeTaxonomiesFilter}
                queryNodesName="allAeTaxonomies"
                value={row?.artId}
                saveToDb={saveToDb}
              />
              <RadioButtonGroupWithInfo
                name="bearbeitung"
                dataSource={dataLists?.allApBearbstandWertes?.nodes ?? []}
                loading={loadingLists}
                popover={
                  <>
                    <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
                    <LabelPopoverContentRow>
                      <LabelPopoverRowColumnLeft>
                        keiner:
                      </LabelPopoverRowColumnLeft>
                      <LabelPopoverRowColumnRight>
                        kein Aktionsplan vorgesehen
                      </LabelPopoverRowColumnRight>
                    </LabelPopoverContentRow>
                    <LabelPopoverContentRow>
                      <LabelPopoverRowColumnLeft>
                        erstellt:
                      </LabelPopoverRowColumnLeft>
                      <LabelPopoverRowColumnRight>
                        Aktionsplan fertig, auf der Webseite der FNS
                      </LabelPopoverRowColumnRight>
                    </LabelPopoverContentRow>
                  </>
                }
                label="Aktionsplan"
                value={row?.bearbeitung}
                saveToDb={saveToDb}
              />
              <TextField
                name="startJahr"
                label="Start im Jahr"
                type="number"
                value={row?.startJahr}
                saveToDb={saveToDb}
              />
              <FieldContainer>
                <RadioButtonGroupWithInfo
                  name="umsetzung"
                  dataSource={dataLists?.allApUmsetzungWertes?.nodes ?? []}
                  loading={loadingLists}
                  popover={
                    <>
                      <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
                      <LabelPopoverContentRow>
                        <LabelPopoverRowColumnLeft>
                          noch keine
                          <br />
                          Umsetzung:
                        </LabelPopoverRowColumnLeft>
                        <LabelPopoverRowColumnRight>
                          noch keine Massnahmen ausgeführt
                        </LabelPopoverRowColumnRight>
                      </LabelPopoverContentRow>
                      <LabelPopoverContentRow>
                        <LabelPopoverRowColumnLeft>
                          in Umsetzung:
                        </LabelPopoverRowColumnLeft>
                        <LabelPopoverRowColumnRight>
                          bereits Massnahmen ausgeführt (auch wenn AP noch nicht
                          erstellt)
                        </LabelPopoverRowColumnRight>
                      </LabelPopoverContentRow>
                    </>
                  }
                  label="Stand Umsetzung"
                  value={row?.umsetzung}
                  saveToDb={saveToDb}
                />
              </FieldContainer>
              <Select
                name="bearbeiter"
                label="Verantwortlich"
                options={dataAdresses?.allAdresses?.nodes ?? []}
                loading={loadingAdresses}
                value={row?.bearbeiter}
                saveToDb={saveToDb}
              />
              <TextField
                name="ekfBeobachtungszeitpunkt"
                label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
                type="text"
                value={row?.ekfBeobachtungszeitpunkt}
                saveToDb={saveToDb}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApFilter)
