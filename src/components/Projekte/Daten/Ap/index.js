// @flow
import React, { useContext, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withAeEigenschaftens from './withAeEigenschaftens'
import updateApByIdGql from './updateApById'
import withAllAdresses from './withAllAdresses'
import withAllAps from './withAllAps'
import query from './data'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

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

const enhance = compose(
  withAllAps,
  withAllAdresses,
  withAeEigenschaftens,
  observer,
)

const Ap = ({
  treeName,
  dataAllAdresses,
  dataAllAps,
  dataAeEigenschaftens,
}: {
  treeName: String,
  dataAllAdresses: Object,
  dataAllAps: Object,
  dataAeEigenschaftens: Object,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const { nodeFilter, nodeFilterSetValue, user, refetch } = mobxStore
  const { activeNodeArray } = mobxStore[treeName]
  const id =
    activeNodeArray.length > 3
      ? activeNodeArray[3]
      : '99999999-9999-9999-9999-999999999999'
  const { data, error, loading } = useQuery(query, {
    suspend: false,
    variables: { id },
  })

  const [errors, setErrors] = useState({})

  const showFilter = !!nodeFilter[treeName].activeTable
  let row
  if (showFilter) {
    row = nodeFilter[treeName].ap
  } else {
    row = get(data, 'apById', {})
  }

  useEffect(() => setErrors({}), [row])

  let bearbeitungWerte = get(data, 'allApBearbstandWertes.nodes', [])
  bearbeitungWerte = sortBy(bearbeitungWerte, 'sort')
  bearbeitungWerte = bearbeitungWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))
  let umsetzungWerte = get(data, 'allApUmsetzungWertes.nodes', [])
  umsetzungWerte = sortBy(umsetzungWerte, 'sort')
  umsetzungWerte = umsetzungWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))
  let adressenWerte = get(dataAllAdresses, 'allAdresses.nodes', [])
  adressenWerte = sortBy(adressenWerte, 'name')
  adressenWerte = adressenWerte.map(el => ({
    label: el.name,
    value: el.id,
  }))

  let apArten
  let artWerte
  if (showFilter) {
    apArten = get(dataAllAps, 'allAps.nodes', []).map(o => o.artId)
    artWerte = get(dataAeEigenschaftens, 'allAeEigenschaftens.nodes', [])
    // only list ap arten
    artWerte = artWerte.filter(o => apArten.includes(o.id))
    artWerte = sortBy(artWerte, 'artname')
    artWerte = artWerte.map(el => ({
      value: el.id,
      label: el.artname,
    }))
  } else {
    // list all ap-Arten BUT the active one
    apArten = get(dataAllAps, 'allAps.nodes', [])
      .filter(o => o.id !== row.id)
      .map(o => o.artId)
    artWerte = get(dataAeEigenschaftens, 'allAeEigenschaftens.nodes', [])
    // filter ap arten but the active one
    artWerte = artWerte.filter(o => !apArten.includes(o.id))
    artWerte = sortBy(artWerte, 'artname')
    artWerte = artWerte.map(el => ({
      value: el.id,
      label: el.artname,
    }))
  }

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value) || null
      const showFilter = !!nodeFilter[treeName].activeTable
      /**
       * only save if value changed
       */
      if (row[field] === value) return
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
            /*optimisticResponse: {
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
                adresseByBearbeiter: row.adresseByBearbeiter,
                aeEigenschaftenByArtId: row.aeEigenschaftenByArtId,
                __typename: 'Ap',
              },
              __typename: 'Ap',
            },
          },*/
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

  if (
    loading ||
    dataAeEigenschaftens.loading ||
    dataAllAdresses.loading ||
    dataAllAps.loading
  ) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (dataAeEigenschaftens.error) {
    return `Fehler: ${dataAeEigenschaftens.error.message}`
  }
  if (dataAllAdresses.error) return `Fehler: ${dataAllAdresses.error.message}`
  if (dataAllAps.error) return `Fehler: ${dataAllAps.error.message}`
  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <FormTitle
          apId={row.id}
          title="Aktionsplan"
          treeName={treeName}
          table="ap"
        />
        <FieldsContainer>
          <Select
            key={`${row.id}artId`}
            name="artId"
            value={row.artId}
            field="artId"
            label="Art (gibt dem Aktionsplan den Namen)"
            options={artWerte}
            saveToDb={saveToDb}
            error={errors.artId}
          />
          <RadioButtonGroupWithInfo
            key={`${row.id}bearbeitung`}
            name="bearbeitung"
            value={row.bearbeitung}
            dataSource={bearbeitungWerte}
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
            value={row.startJahr}
            type="number"
            saveToDb={saveToDb}
            error={errors.startJahr}
          />
          <FieldContainer>
            <RadioButtonGroupWithInfo
              key={`${row.id}umsetzung`}
              name="umsetzung"
              value={row.umsetzung}
              dataSource={umsetzungWerte}
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
            options={adressenWerte}
            saveToDb={saveToDb}
            error={errors.bearbeiter}
          />
          <TextField
            key={`${row.id}ekfBeobachtungszeitpunkt`}
            name="ekfBeobachtungszeitpunkt"
            label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
            value={row.ekfBeobachtungszeitpunkt}
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

export default enhance(Ap)
