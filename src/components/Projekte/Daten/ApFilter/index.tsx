import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'

import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.jsx'
import { TextField } from '../../../shared/TextField.tsx'
import { Select } from '../../../shared/Select.jsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.jsx'
import { FilterTitle } from '../../../shared/FilterTitle.jsx'
import { queryAeTaxonomiesById } from './queryAeTaxonomiesById.ts'
import { queryLists } from './queryLists.ts'
import { queryAps } from './queryAps.ts'
import { queryAdresses } from './queryAdresses.ts'
import { queryAeTaxonomies } from './queryAeTaxonomies.ts'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Tabs } from './Tabs.tsx'

import type { AdresseId } from '../../../../models/apflora/Adresse.js'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.js'
import type { ApBearbstandWerteCode } from '../../../../models/apflora/ApBearbstandWerte.js'
import type { ApUmsetzungWerteCode } from '../../../../models/apflora/ApUmsetzungWerte.js'

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

interface ApsQueryResult {
  allAps: {
    totalCount: number
  }
  filteredAps: {
    totalCount: number
  }
}

interface AdressesQueryResult {
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
}

interface ListsQueryResult {
  allApBearbstandWertes: {
    nodes: Array<{
      value: ApBearbstandWerteCode
      label: string
    }>
  }
  allApUmsetzungWertes: {
    nodes: Array<{
      value: ApUmsetzungWerteCode
      label: string
    }>
  }
}

interface AeTaxonomiesByIdQueryResult {
  aeTaxonomyById: {
    artname: string
  }
}

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

  const { data: apsData, error: apsError } = useQuery<ApsQueryResult>(
    queryAps,
    {
      variables: {
        filteredFilter: apGqlFilter.filtered,
        allFilter: apGqlFilter.all,
      },
    },
  )

  const {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
  } = useQuery<AdressesQueryResult>(queryAdresses)

  const {
    data: dataLists,
    error: errorLists,
    loading: loadingLists,
  } = useQuery<ListsQueryResult>(queryLists)

  const {
    data: dataAeTaxonomiesById,
    error: errorAeTaxonomiesById,
    loading: loadingAeTaxonomiesById,
  } = useQuery<AeTaxonomiesByIdQueryResult>(queryAeTaxonomiesById, {
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

  const saveToDb = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    dataFilterSetValue({
      table: 'ap',
      key: field,
      value,
      index: activeTab,
    })
  }

  const aeTaxonomiesFilter = (inputValue: string) => {
    let filter: any = { apByArtIdExists: true }
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
              key={`${row?.id}artId`}
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
              key={`${row?.id}bearbeitung`}
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
                key={`${row?.id}umsetzung`}
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
              key={`${row?.id}bearbeiter`}
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
