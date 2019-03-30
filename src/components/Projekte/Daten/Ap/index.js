// @flow
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
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import TextField2 from '../../../shared/TextField2'
import Select from '../../../shared/Select'
import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateApByIdGql from './updateApById'
import query from './query'
import queryLists from './queryLists'
import queryAps from './queryAps'
import queryAdresses from './queryAdresses'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import { simpleTypes as apType } from '../../../../mobxStore/NodeFilterTree/ap'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
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

const Ap = ({
  treeName,
  showFilter = false,
}: {
  treeName: String,
  showFilter: Boolean,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const { nodeFilter, nodeFilterSetValue, user, refetch } = mobxStore
  const { activeNodeArray } = mobxStore[treeName]

  let id =
    activeNodeArray.length > 3
      ? activeNodeArray[3]
      : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const { data, error, loading } = useQuery(query, {
    variables: { id },
  })

  const apFilter = useMemo(() => {
    const apFilter = { projId: { in: activeNodeArray[1] } }
    const apFilterValues = Object.entries(nodeFilter[treeName].ap).filter(
      e => e[1] || e[1] === 0,
    )
    apFilterValues.forEach(([key, value]) => {
      const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
      apFilter[key] = { [expression]: value }
    })
    return apFilter
  }, [activeNodeArray[1], nodeFilter[treeName].ap])

  const { data: allApsData, error: allApsError } = useQuery(queryAps, {
    variables: { apFilter, showFilter },
  })

  const {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
  } = useQuery(queryAdresses)
  const {
    data: dataAeEigenschaftens,
    error: errorAeEigenschaftens,
    loading: loadingAeEigenschaftens,
  } = useQuery(queryAeEigenschaftens, {
    variables: { showData: !showFilter, showFilter, apId: id },
  })
  const {
    data: dataLists,
    error: errorLists,
    loading: loadingLists,
  } = useQuery(queryLists)

  const [errors, setErrors] = useState({})

  const row = showFilter ? nodeFilter[treeName].ap : get(data, 'apById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'ap',
          key: field,
          value,
        })
        refetch.aps()
      } else {
        try {
          await client.mutate({
            mutation: updateApByIdGql,
            variables: {
              id: row.id,
              [field]: value,
              changedBy: user.name,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateApById: {
                ap: {
                  id: row.id,
                  startJahr: field === 'startJahr' ? value : row.startJahr,
                  bearbeitung:
                    field === 'bearbeitung' ? value : row.bearbeitung,
                  umsetzung: field === 'umsetzung' ? value : row.umsetzung,
                  artId: field === 'artId' ? value : row.artId,
                  bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                  ekfBeobachtungszeitpunkt:
                    field === 'ekfBeobachtungszeitpunkt'
                      ? value
                      : row.ekfBeobachtungszeitpunkt,
                  projId: field === 'projId' ? value : row.projId,
                  aeEigenschaftenByArtId: row.aeEigenschaftenByArtId,
                  __typename: 'Ap',
                },
                __typename: 'Ap',
              },
            },
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        setErrors({})
        if (['artId'].includes(field)) refetch.aps()
      }
    },
    [row, showFilter],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (errorAeEigenschaftens) {
    return `Fehler: ${errorAeEigenschaftens.message}`
  }
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (allApsError) return `Fehler: ${allApsError.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  if (error) return `Fehler: ${error.message}`

  console.log('Ap rendering')

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        {showFilter ? (
          <FilterTitle
            title="Aktionsplan"
            treeName={treeName}
            table="ap"
            totalNr={get(allApsData, 'allAps.totalCount', '...')}
            filteredNr={get(allApsData, 'filteredAps.totalCount', '...')}
          />
        ) : (
          <FormTitle apId={row.id} title="Aktionsplan" treeName={treeName} />
        )}
        <FieldsContainer>
          <Select
            key={`${row.id}artId`}
            name="artId"
            value={row.artId}
            field="artId"
            label="Art (gibt dem Aktionsplan den Namen)"
            options={get(
              dataAeEigenschaftens,
              `${showFilter ? 'forFilter' : 'forData'}.nodes`,
              [],
            )}
            loading={loadingAeEigenschaftens}
            saveToDb={saveToDb}
            error={errors.artId}
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
          <TextField2
            key={`${row.id}startJahr`}
            name="startJahr"
            label="Start im Jahr"
            row={row}
            type="number"
            saveToDb={saveToDb}
            error={errors.startJahr}
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
          <TextField2
            key={`${row.id}ekfBeobachtungszeitpunkt`}
            name="ekfBeobachtungszeitpunkt"
            label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
            row={row}
            saveToDb={saveToDb}
            error={errors.ekfBeobachtungszeitpunkt}
          />
          {!showFilter && (
            <TextFieldNonUpdatable
              key={`${row.id}artwert`}
              label="Artwert"
              value={get(
                row,
                'aeEigenschaftenByArtId.artwert',
                'Diese Art hat keinen Artwert',
              )}
            />
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ap)
