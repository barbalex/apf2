import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { TextField } from '../../../shared/TextField.jsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.jsx'
import { Status } from '../../../shared/Status.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { FilterTitle } from '../../../shared/FilterTitle.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { PopOrTabs } from './PopOrTabs.jsx'

import {
  container,
  formContainer,
  filterCommentTitle,
  filterComment,
} from './index.module.css'

export const PopFilter = observer(() => {
  const { apId } = useParams()

  const store = useContext(MobxContext)
  const {
    dataFilter: dataFilterRaw,
    nodeLabelFilter,
    popGqlFilter,
    mapFilter,
    artIsFiltered,
    apFilter,
    dataFilterSetValue,
  } = store.tree

  // somehow to live updates without this
  const dataFilter = dataFilterRaw.toJSON()

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.pop.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.pop.length])

  const { data: dataPops, error } = useQuery(query, {
    variables: {
      filteredFilter: popGqlFilter.filtered,
      allFilter: popGqlFilter.all,
    },
  })

  const row = dataFilter.pop[activeTab]

  const saveToDb = async (event) =>
    dataFilterSetValue({
      table: 'pop',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

  const navApFilterComment =
    apFilter ?
      `Navigationsbaum, "nur AP"-Filter: Nur Populationen von AP-Arten werden berücksichtigt.`
    : undefined
  const navHiearchyComment =
    apId ?
      'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Populationen berücksichtigt.'
    : undefined
  const navLabelComment =
    nodeLabelFilter.pop ?
      `Navigationsbaum, Label-Filter: Das Label der Populationen wird nach "${nodeLabelFilter.pop}" gefiltert.`
    : undefined
  const hierarchyComment =
    artIsFiltered ?
      'Formular-Filter, Ebene Art: Es werden nur Populationen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
    : undefined
  const mapFilterComment =
    mapFilter ? 'Karten-Filter: wird angewendet.' : undefined

  const showFilterComments =
    !!navApFilterComment ||
    !!navHiearchyComment ||
    !!navLabelComment ||
    !!hierarchyComment ||
    !!mapFilter

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={container}>
        <FilterTitle
          title="Population"
          table="pop"
          totalNr={dataPops?.pops?.totalCount ?? '...'}
          filteredNr={dataPops?.popsFiltered?.totalCount ?? '...'}
          activeTab={activeTab}
        />
        {showFilterComments && (
          <>
            <div className={filterCommentTitle}>Zusätzlich aktive Filter:</div>
            <ul>
              {!!navApFilterComment && (
                <li className={filterComment}>{navApFilterComment}</li>
              )}
              {!!navHiearchyComment && (
                <li className={filterComment}>{navHiearchyComment}</li>
              )}
              {!!navLabelComment && (
                <li className={filterComment}>{navLabelComment}</li>
              )}
              {!!hierarchyComment && (
                <li className={filterComment}>{hierarchyComment}</li>
              )}
              {!!mapFilterComment && (
                <li className={filterComment}>{mapFilterComment}</li>
              )}
            </ul>
          </>
        )}
        <PopOrTabs
          dataFilter={dataFilter.pop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className={formContainer}>
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
        </div>
      </div>
    </ErrorBoundary>
  )
})
