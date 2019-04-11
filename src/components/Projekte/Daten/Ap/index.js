import React, { useContext, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import TextField from '../../../shared/TextField2'
import Select from '../../../shared/Select'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateApByIdGql from './updateApById'
import query from './query'
import queryLists from './queryLists'
import queryAdresses from './queryAdresses'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
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

const Ap = ({ treeName, showFilter = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { user, refetch } = store
  const { activeNodeArray } = store[treeName]

  let id =
    activeNodeArray.length > 3
      ? activeNodeArray[3]
      : '99999999-9999-9999-9999-999999999999'
  const { data, error, loading } = useQuery(query, {
    variables: { id },
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

  const [errors, setErrors] = useState({})

  const row = get(data, 'apById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
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
                bearbeitung: field === 'bearbeitung' ? value : row.bearbeitung,
                umsetzung: field === 'umsetzung' ? value : row.umsetzung,
                artId: field === 'artId' ? value : row.artId,
                bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                ekfBeobachtungszeitpunkt:
                  field === 'ekfBeobachtungszeitpunkt'
                    ? value
                    : row.ekfBeobachtungszeitpunkt,
                projId: field === 'projId' ? value : row.projId,
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
    },
    [row],
  )

  const aeEigenschaftenfilterForData = useCallback(
    inputValue =>
      !!inputValue
        ? {
            or: [
              { apByArtIdExists: false },
              { apByArtId: { id: { equalTo: id } } },
            ],
            artname: { includesInsensitive: inputValue },
          }
        : {
            or: [
              { apByArtIdExists: false },
              { apByArtId: { id: { equalTo: id } } },
            ],
          },
    [id],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle apId={row.id} title="Aktionsplan" treeName={treeName} />
        <FieldsContainer>
          <SelectLoadingOptions
            key={`${row.id}artId`}
            field="artId"
            valueLabelPath="aeEigenschaftenByArtId.artname"
            label="Art (gibt dem Aktionsplan den Namen)"
            row={row}
            saveToDb={saveToDb}
            error={errors.artId}
            query={queryAeEigenschaftens}
            filter={aeEigenschaftenfilterForData}
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
          <TextFieldNonUpdatable
            key={`${row.id}artwert`}
            label="Artwert"
            value={get(
              row,
              'aeEigenschaftenByArtId.artwert',
              'Diese Art hat keinen Artwert',
            )}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ap)
