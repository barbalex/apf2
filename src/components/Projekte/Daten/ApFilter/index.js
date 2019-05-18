import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import TextField from '../../../shared/TextField2'
import Select from '../../../shared/Select'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import FilterTitle from '../../../shared/FilterTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import queryAeEigenschaftenById from './queryAeEigenschaftenById'
import queryLists from './queryLists'
import queryAps from './queryAps'
import queryAdresses from './queryAdresses'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import { simpleTypes as apType } from '../../../../store/NodeFilterTree/ap'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
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
  background-color: #565656;
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

const ApFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { nodeFilter, nodeFilterSetValue, refetch } = store
  const { activeNodeArray } = store[treeName]

  const projId = activeNodeArray[1]
  const nodeFilterAp = { ...nodeFilter[treeName].ap }
  const apFilter = useMemo(() => {
    const apFilter = { projId: { equalTo: projId } }
    const apFilterValues = Object.entries(nodeFilterAp).filter(
      e => e[1] || e[1] === 0,
    )
    apFilterValues.forEach(([key, value]) => {
      const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
      apFilter[key] = { [expression]: value }
    })
    return apFilter
  }, [projId, nodeFilterAp])
  const { data: apsData, error: apsError } = useQuery(queryAps, {
    variables: { apFilter },
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
    data: dataAeEigenschaftenById,
    error: errorAeEigenschaftenById,
    loading: loadingAeEigenschaftenById,
  } = useQuery(queryAeEigenschaftenById, {
    variables: {
      id: nodeFilter[treeName].ap.artId,
      run: !!nodeFilter[treeName].ap.artId,
    },
  })

  const artname =
    !!nodeFilter[treeName].ap.artId && !loadingAeEigenschaftenById
      ? get(dataAeEigenschaftenById, 'aeEigenschaftenById.artname') || ''
      : ''

  const [errors, setErrors] = useState({})

  const row = nodeFilter[treeName].ap

  useEffect(() => {
    setErrors({})
  }, [row])

  const saveToDb = useCallback(
    event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      nodeFilterSetValue({
        treeName,
        table: 'ap',
        key: field,
        value,
      })
      refetch.aps()
    },
    [row],
  )

  const aeEigenschaftenFilter = useCallback(inputValue =>
    !!inputValue
      ? {
          apByArtIdExists: true,
          artname: { includesInsensitive: inputValue },
        }
      : {
          apByArtIdExists: true,
        },
  )

  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (apsError) return `Fehler: ${apsError.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  if (errorAeEigenschaftenById) {
    return `Fehler: ${errorAeEigenschaftenById.message}`
  }

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Aktionsplan"
          treeName={treeName}
          table="ap"
          totalNr={get(apsData, 'allAps.totalCount', '...')}
          filteredNr={get(apsData, 'filteredAps.totalCount', '...')}
        />
        <FieldsContainer>
          <SelectLoadingOptions
            key={`${row.id}artId`}
            field="artId"
            valueLabelPath="aeEigenschaftenByArtId.artname"
            label="Art (gibt dem Aktionsplan den Namen)"
            row={{
              ...row,
              ...{
                aeEigenschaftenByArtId: {
                  artname,
                },
              },
            }}
            saveToDb={saveToDb}
            error={errors.artId}
            query={queryAeEigenschaftens}
            filter={aeEigenschaftenFilter}
            queryNodesName="allAeEigenschaftens"
          />
          <RadioButtonGroupWithInfo
            key={`${row.id}bearbeitung`}
            name="bearbeitung"
            value={row.bearbeitung}
            dataSource={get(dataLists, 'allApBearbstandWertes.nodes', [])}
            loading={loadingLists}
            saveToDb={saveToDb}
            error={errors.bearbeitung}
            popover={
              <>
                <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
                <LabelPopoverContentRow>
                  <LabelPopoverRowColumnLeft>keiner:</LabelPopoverRowColumnLeft>
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
          />
          <TextField
            key={`${row.id}startJahr`}
            name="startJahr"
            label="Start im Jahr"
            row={row}
            type="number"
            saveToDb={saveToDb}
            errors={errors}
          />
          <FieldContainer>
            <RadioButtonGroupWithInfo
              key={`${row.id}umsetzung`}
              name="umsetzung"
              value={row.umsetzung}
              dataSource={get(dataLists, 'allApUmsetzungWertes.nodes', [])}
              loading={loadingLists}
              saveToDb={saveToDb}
              error={errors.umsetzung}
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
            />
          </FieldContainer>
          <Select
            key={`${row.id}bearbeiter`}
            name="bearbeiter"
            value={row.bearbeiter}
            field="bearbeiter"
            label="Verantwortlich"
            options={get(dataAdresses, 'allAdresses.nodes', [])}
            loading={loadingAdresses}
            saveToDb={saveToDb}
            error={errors.bearbeiter}
          />
          <TextField
            key={`${row.id}ekfBeobachtungszeitpunkt`}
            name="ekfBeobachtungszeitpunkt"
            label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApFilter)
