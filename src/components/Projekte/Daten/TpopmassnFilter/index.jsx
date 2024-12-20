import { memo, useCallback, useContext, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { SelectLoadingOptionsTypable } from '../../../shared/SelectLoadingOptionsTypable.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { DateField } from '../../../shared/Date.jsx'

import { FilterTitle } from '../../../shared/FilterTitle.jsx'
import { constants } from '../../../../modules/constants.js'
import { query } from './query.js'
import { queryAeTaxonomies } from './queryAeTaxonomies.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Tabs } from './Tabs.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FormScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
`
const ColumnContainer = styled.div`
  padding: 10px;
  column-width: ${constants.columnWidth}px;
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

export const TpopmassnFilter = memo(
  observer(() => {
    const { apId } = useParams()

    const store = useContext(MobxContext)
    const {
      dataFilter,
      tpopmassnGqlFilter,
      nodeLabelFilter,
      mapFilter,
      apFilter,
      artIsFiltered,
      popIsFiltered,
      tpopIsFiltered,
      dataFilterSetValue,
    } = store.tree

    const [activeTab, setActiveTab] = useState(0)
    useEffect(() => {
      if (dataFilter.tpopmassn.length - 1 < activeTab) {
        // filter was emptied, need to set correct tab
        setActiveTab(0)
      }
    }, [activeTab, dataFilter.tpopmassn.length])

    const { data, loading, error } = useQuery(query, {
      variables: {
        filteredFilter: tpopmassnGqlFilter.filtered,
        allFilter: tpopmassnGqlFilter.all,
      },
    })

    const row = dataFilter.tpopmassn[activeTab]

    const isAnpflanzung = data?.allTpopmassnTypWertes?.nodes?.find(
      (n) => n.value === row?.typ,
    )?.anpflanzung

    const saveToDb = useCallback(
      async (event) =>
        dataFilterSetValue({
          table: 'tpopmassn',
          key: event.target.name,
          value: ifIsNumericAsNumber(event.target.value),
          index: activeTab,
        }),
      [dataFilterSetValue, activeTab],
    )

    const navApFilterComment =
      apFilter ?
        `Navigationsbaum, "nur AP"-Filter: Nur Massnahmen von AP-Arten werden berücksichtigt.`
      : undefined
    const navHiearchyComment =
      // tpopId ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Teil-Population gewählt. Es werden nur ihre Massnahmen berücksichtigt.'
      // : popId
      // ? 'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Population gewählt. Es werden nur ihre Massnahmen berücksichtigt.' :
      apId ?
        'Navigationsbaum, Hierarchie-Filter: Im Navigationsbaum ist eine Art gewählt. Es werden nur ihre Massnahmen berücksichtigt.'
      : undefined
    const navLabelComment =
      nodeLabelFilter.tpopmassn ?
        `Navigationsbaum, Label-Filter: Das Label der Massnahmen wird nach "${nodeLabelFilter.tpopmassn}" gefiltert.`
      : undefined
    const artHierarchyComment =
      artIsFiltered ?
        'Formular-Filter, Ebene Art: Es werden nur Massnahmen berücksichtigt, deren Art die Bedingungen des gesetzten Filters erfüllt.'
      : undefined
    const popHierarchyComment =
      popIsFiltered ?
        'Formular-Filter, Ebene Population: Es werden nur Massnahmen berücksichtigt, deren Population die Bedingungen des gesetzten Filters erfüllt.'
      : undefined
    const tpopHierarchyComment =
      tpopIsFiltered ?
        'Formular-Filter, Ebene Teil-Population: Es werden nur Massnahmen berücksichtigt, deren Teil-Population die Bedingungen des gesetzten Filters erfüllt.'
      : undefined
    const mapFilterComment =
      mapFilter ?
        'Karten-Filter: Nur Massnahmen von Teil-Populationen innerhalb des Karten-Filters werden berücksichtigt.'
      : undefined

    const showFilterComments =
      !!navApFilterComment ||
      !!navHiearchyComment ||
      !!navLabelComment ||
      !!artHierarchyComment ||
      !!popHierarchyComment ||
      !!tpopHierarchyComment ||
      !!mapFilter

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container>
          <FilterTitle
            title="Massnahmen"
            table="tpopmassn"
            totalNr={data?.allTpopmassns?.totalCount ?? '...'}
            filteredNr={data?.tpopmassnsFiltered?.totalCount ?? '...'}
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
          <Tabs
            dataFilter={dataFilter.tpopmassn}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <FormScrollContainer>
            <ColumnContainer>
              <TextField
                name="jahr"
                label="Jahr"
                type="number"
                value={row?.jahr}
                saveToDb={saveToDb}
              />
              <DateField
                name="datum"
                label="Datum"
                value={row?.datum}
                saveToDb={saveToDb}
              />
              <RadioButtonGroup
                name="typ"
                label="Typ"
                dataSource={data?.allTpopmassnTypWertes?.nodes ?? []}
                loading={loading}
                value={row?.typ}
                saveToDb={saveToDb}
              />
              <TextField
                name="beschreibung"
                label="Massnahme"
                type="text"
                value={row?.beschreibung}
                saveToDb={saveToDb}
              />
              <Select
                name="bearbeiter"
                label="BearbeiterIn"
                options={data?.allAdresses?.nodes ?? []}
                loading={loading}
                value={row?.bearbeiter}
                saveToDb={saveToDb}
              />
              <TextField
                name="bemerkungen"
                label="Bemerkungen"
                type="text"
                multiLine
                value={row?.bemerkungen}
                saveToDb={saveToDb}
              />
              <Checkbox2States
                name="planVorhanden"
                label="Plan vorhanden"
                value={row?.planVorhanden}
                saveToDb={saveToDb}
              />
              <TextField
                name="planBezeichnung"
                label="Plan Bezeichnung"
                type="text"
                value={row?.planBezeichnung}
                saveToDb={saveToDb}
              />
              <TextField
                name="flaeche"
                label="Fläche (m2)"
                type="number"
                value={row?.flaeche}
                saveToDb={saveToDb}
              />
              <TextField
                name="form"
                label="Form der Ansiedlung"
                type="text"
                value={row?.form}
                saveToDb={saveToDb}
              />
              <TextField
                name="pflanzanordnung"
                label="Pflanzanordnung"
                type="text"
                value={row?.pflanzanordnung}
                saveToDb={saveToDb}
              />
              <TextField
                name="markierung"
                label="Markierung"
                type="text"
                value={row?.markierung}
                saveToDb={saveToDb}
              />
              <TextField
                name="anzTriebe"
                label="Anzahl Triebe"
                type="number"
                value={row?.anzTriebe}
                saveToDb={saveToDb}
              />
              <TextField
                name="anzPflanzen"
                label="Anzahl Pflanzen"
                type="number"
                value={row?.anzPflanzen}
                saveToDb={saveToDb}
              />
              <TextField
                name="anzPflanzstellen"
                label="Anzahl Pflanzstellen"
                type="number"
                value={row?.anzPflanzstellen}
                saveToDb={saveToDb}
              />
              {isAnpflanzung && (
                <>
                  <Select
                    name="zieleinheitEinheit"
                    label="Ziel-Einheit: Einheit (wird automatisch gesetzt)"
                    options={data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
                    loading={loading}
                    value={row?.zieleinheitEinheit}
                    saveToDb={saveToDb}
                  />
                  <TextField
                    name="zieleinheitAnzahl"
                    label="Ziel-Einheit: Anzahl (nur ganze Zahlen)"
                    type="number"
                    value={row?.zieleinheitAnzahl}
                    saveToDb={saveToDb}
                  />
                </>
              )}
              <SelectLoadingOptionsTypable
                field="wirtspflanze"
                label="Wirtspflanze"
                query={queryAeTaxonomies}
                queryNodesName="allAeTaxonomies"
                value={row?.wirtspflanze}
                saveToDb={saveToDb}
                row={row}
              />
              <TextField
                name="herkunftPop"
                label="Herkunftspopulation"
                type="text"
                value={row?.herkunftPop}
                saveToDb={saveToDb}
              />
              <TextField
                name="sammeldatum"
                label="Sammeldatum"
                type="text"
                value={row?.sammeldatum}
                saveToDb={saveToDb}
              />
              <TextField
                name="vonAnzahlIndividuen"
                label="Anzahl besammelte Individuen der Herkunftspopulation"
                type="number"
                value={row?.vonAnzahlIndividuen}
                saveToDb={saveToDb}
              />
            </ColumnContainer>
          </FormScrollContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
