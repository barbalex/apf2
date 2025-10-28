import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'

import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.jsx'
import { FilterTitle } from '../../../shared/FilterTitle.jsx'
import { queryAeTaxonomiesById } from './queryAeTaxonomiesById.js'
import { queryLists } from './queryLists.js'
import { queryAps } from './queryAps.js'
import { queryAdresses } from './queryAdresses.js'
import { queryAeTaxonomies } from './queryAeTaxonomies.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Tabs } from './Tabs.jsx'

import {
  popover,
  title,
  row,
  columnLeft,
  container,
  fieldsContainer,
  formContainer,
  fieldContainer,
  filterCommentTitle,
  filterComment,
} from './index.module.css'

export const ApFilter = observer(() => {
  const store = useContext(MobxContext)
  const {
    dataFilter,
    apFilter: nurApFilter,
    nodeLabelFilter,
    apGqlFilter,
    dataFilterSetValue,
  } = store.tree

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
    !!dataFilter.ap?.[activeTab]?.artId && !loadingAeTaxonomiesById ?
      (dataAeTaxonomiesById?.aeTaxonomyById?.artname ?? '')
    : ''

  const row = dataFilter.ap[activeTab]
  // console.log('ApFilter', { row: row ? getSnapshot(row) : undefined, artname })

  const saveToDb = (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    dataFilterSetValue({
      table: 'ap',
      key: field,
      value,
      index: activeTab,
    })
  }

  const aeTaxonomiesFilter = (inputValue) => {
    let filter = { apByArtIdExists: true }
    if (inputValue) filter.artname = { includesInsensitive: inputValue }
    if (nurApFilter) filter.apByArtId = { bearbeitung: { in: [1, 2, 3] } }
    return filter
  }

  const errors = [
    ...(errorAdresses ? [errorAdresses] : []),
    ...(apsError ? [apsError] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorAeTaxonomiesById ? [errorAeTaxonomiesById] : []),
  ]

  const navApFilterComment =
    nurApFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur AP-Arten werden berücksichtigt.`
    : undefined
  const navLabelComment =
    nodeLabelFilter.ap ?
      `Navigationsbaum, Label-Filter: Das Label der Art wird nach "${nodeLabelFilter.ap}" gefiltert.`
    : undefined

  const showFilterComments = !!navApFilterComment || !!navLabelComment

  if (errors.length) return <Error errors={errors} />

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={container}>
        <FilterTitle
          title="Art"
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
            <div className={filterCommentTitle}>Zusätzlich aktive Filter:</div>
            <ul>
              {!!navApFilterComment && (
                <li className={filterComment}>{navApFilterComment}</li>
              )}
              {!!navLabelComment && (
                <li className={filterComment}>{navLabelComment}</li>
              )}
            </ul>
          </>
        )}
        <Tabs
          dataFilter={dataFilter.ap}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={fieldsContainer}>
          <div className={formContainer}>
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
                <div className={popover}>
                  <div className={title}>Legende</div>
                  <div className={row}>
                    <div className={columnLeft}>keiner:</div>
                    <div>kein Aktionsplan vorgesehen</div>
                  </div>
                  <div className={row}>
                    <div className={columnLeft}>erstellt:</div>
                    <div>Aktionsplan fertig, auf der Webseite der FNS</div>
                  </div>
                </div>
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
            <div className={fieldContainer}>
              <RadioButtonGroupWithInfo
                name="umsetzung"
                dataSource={dataLists?.allApUmsetzungWertes?.nodes ?? []}
                loading={loadingLists}
                popover={
                  <div className={popover}>
                    <div className={title}>Legende</div>
                    <div className={row}>
                      <div className={columnLeft}>
                        noch keine
                        <br />
                        Umsetzung:
                      </div>
                      <div>noch keine Massnahmen ausgeführt</div>
                    </div>
                    <div className={row}>
                      <div className={columnLeft}>in Umsetzung:</div>
                      <div>
                        bereits Massnahmen ausgeführt (auch wenn AP noch nicht
                        erstellt)
                      </div>
                    </div>
                  </div>
                }
                label="Stand Umsetzung"
                value={row?.umsetzung}
                saveToDb={saveToDb}
              />
            </div>
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
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
})
