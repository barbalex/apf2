import React, { useCallback, useContext, useState, useMemo } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useResizeDetector } from 'react-resize-detector'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import MdField from '../../../shared/MarkdownField'
import Select from '../../../shared/Select'
import SelectLoadingOptionsTypable from '../../../shared/SelectLoadingOptionsTypable'
import Checkbox2States from '../../../shared/Checkbox2States'
import DateField from '../../../shared/Date'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import query from './query'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import exists from '../../../../modules/exists'
import Files from '../../../shared/Files'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Spinner from '../../../shared/Spinner'
import Error from '../../../shared/Error'
import useSearchParamsState from '../../../../modules/useSearchParamsState'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const ColumnContainer = styled.div`
  padding: 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: 100%;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  typ: 'Int',
  beschreibung: 'String',
  jahr: 'Int',
  datum: 'Date',
  bemerkungen: 'String',
  planBezeichnung: 'String',
  flaeche: 'Float',
  markierung: 'String',
  anzTriebe: 'Int',
  anzPflanzen: 'Int',
  anzPflanzstellen: 'Int',
  zieleinheitEinheit: 'Int',
  zieleinheitAnzahl: 'Int',
  wirtspflanze: 'String',
  herkunftPop: 'String',
  sammeldatum: 'String',
  vonAnzahlIndividuen: 'Int',
  form: 'String',
  pflanzanordnung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
}

const Tpopmassn = ({ showFilter = false }) => {
  const { tpopmassnId, apId } = useParams()

  const client = useApolloClient()
  const store = useContext(storeContext)
  const queryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const id = showFilter ? '99999999-9999-9999-9999-999999999999' : tpopmassnId

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const notMassnCountUnit =
    data?.tpopmassnById?.tpopByTpopId?.popByPopId?.apByApId
      ?.ekzaehleinheitsByApId?.nodes?.[0]?.notMassnCountUnit

  const row = useMemo(() => data?.tpopmassnById ?? {}, [data?.tpopmassnById])

  const isAnpflanzung = row?.tpopmassnTypWerteByTyp?.anpflanzung

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      if (field === 'jahr') {
        variables.datum = null
      }
      if (field === 'datum') {
        variables.jahr =
          value && value.substring ? +value.substring(0, 4) : value
      }
      if (field === 'typ') {
        // IF typ is anpflanzung
        // have to set zieleinheit_einheit to
        // ekzaehleinheit with zielrelevant = true
        let zieleinheitIdResult
        try {
          zieleinheitIdResult = await client.query({
            query: gql`
              query tpopmassnZieleinheitQuery1($apId: UUID!, $typ: Int!) {
                allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                  nodes {
                    id
                    anpflanzung
                  }
                }
                allEkzaehleinheits(
                  filter: {
                    zielrelevant: { equalTo: true }
                    apId: { equalTo: $apId }
                  }
                ) {
                  nodes {
                    id
                    tpopkontrzaehlEinheitWerteByZaehleinheitId {
                      id
                      code
                      correspondsToMassnAnzTriebe
                      correspondsToMassnAnzPflanzen
                    }
                  }
                }
              }
            `,
            variables: { apId, typ: value ?? 1 },
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        const isAnpflanzung =
          zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
            ?.anpflanzung
        const zieleinheit =
          zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
            ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
        const zieleinheitCode = zieleinheit?.code
        if (isAnpflanzung && zieleinheitCode) {
          variables.zieleinheitEinheit = zieleinheitCode
          if (!notMassnCountUnit && zieleinheit?.correspondsToMassnAnzTriebe) {
            variables.zieleinheitAnzahl = row.anzTriebe
          }
          if (
            !notMassnCountUnit &&
            zieleinheit?.correspondsToMassnAnzPflanzen
          ) {
            variables.zieleinheitAnzahl = row.anzPflanzen
          }
        }
      }
      if (!notMassnCountUnit && field === 'anzTriebe') {
        // IF zieleinheit corresponds to Anzahl Triebe
        // have to set zieleinheitAnzahl to anzTriebe
        let zieleinheitIdResult
        try {
          zieleinheitIdResult = await client.query({
            query: gql`
              query tpopmassnZieleinheitQuery2($apId: UUID!, $typ: Int!) {
                allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                  nodes {
                    id
                    anpflanzung
                  }
                }
                allEkzaehleinheits(
                  filter: {
                    zielrelevant: { equalTo: true }
                    apId: { equalTo: $apId }
                  }
                ) {
                  nodes {
                    id
                    tpopkontrzaehlEinheitWerteByZaehleinheitId {
                      id
                      correspondsToMassnAnzTriebe
                    }
                  }
                }
              }
            `,
            variables: { apId, typ: row.typ ?? 1 },
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        const isAnpflanzung =
          zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
            ?.anpflanzung
        const zieleinheit =
          zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
            ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
        if (isAnpflanzung && zieleinheit?.correspondsToMassnAnzTriebe) {
          variables.zieleinheitAnzahl = exists(value) ? value : null
        }
      }
      if (!notMassnCountUnit && field === 'anzPflanzen') {
        // IF zieleinheit corresponds to Anzahl Triebe
        // have to set zieleinheitAnzahl to anzPflanzen
        let zieleinheitIdResult
        try {
          zieleinheitIdResult = await client.query({
            query: gql`
              query tpopmassnZieleinheitQuery3($apId: UUID!, $typ: Int!) {
                allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                  nodes {
                    id
                    anpflanzung
                  }
                }
                allEkzaehleinheits(
                  filter: {
                    zielrelevant: { equalTo: true }
                    apId: { equalTo: $apId }
                  }
                ) {
                  nodes {
                    id
                    tpopkontrzaehlEinheitWerteByZaehleinheitId {
                      id
                      correspondsToMassnAnzPflanzen
                    }
                  }
                }
              }
            `,
            variables: { apId, typ: row.typ ?? 1 },
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        const isAnpflanzung =
          zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
            ?.anpflanzung
        const zieleinheit =
          zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
            ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
        if (isAnpflanzung && zieleinheit?.correspondsToMassnAnzPflanzen) {
          variables.zieleinheitAnzahl = exists(value) ? value : null
        }
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateTpopmassn(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              ${field === 'jahr' ? '$datum: Date' : ''}
              ${field === 'datum' ? '$jahr: Int' : ''}
              ${field === 'typ' ? '$zieleinheitEinheit: Int' : ''}
              ${
                ['typ', 'anzTriebe', 'anzPflanzen'].includes(field)
                  ? '$zieleinheitAnzahl: Int'
                  : ''
              }
              $changedBy: String
            ) {
              updateTpopmassnById(
                input: {
                  id: $id
                  tpopmassnPatch: {
                    ${field}: $${field}
                    ${field === 'jahr' ? 'datum: $datum' : ''}
                    ${field === 'datum' ? 'jahr: $jahr' : ''}
                    ${
                      field === 'typ'
                        ? 'zieleinheitEinheit: $zieleinheitEinheit'
                        : ''
                    }
                    ${
                      ['typ', 'anzTriebe', 'anzPflanzen'].includes(field)
                        ? 'zieleinheitAnzahl: $zieleinheitAnzahl'
                        : ''
                    }
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopmassn {
                  id
                  label
                  typ
                  tpopmassnTypWerteByTyp {
                    id
                    anpflanzung
                  }
                  beschreibung
                  jahr
                  datum
                  bemerkungen
                  planBezeichnung
                  flaeche
                  markierung
                  anzTriebe
                  anzPflanzen
                  anzPflanzstellen
                  zieleinheitEinheit
                  zieleinheitAnzahl
                  wirtspflanze
                  herkunftPop
                  sammeldatum
                  vonAnzahlIndividuen
                  form
                  pflanzanordnung
                  tpopId
                  bearbeiter
                  planVorhanden
                  changedBy
                }
              }
            }
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      if (['jahr', 'datum', 'typ'].includes(field)) {
        queryClient.invalidateQueries({ queryKey: [`treeQuery`] })
      }
    },
    [
      apId,
      client,
      notMassnCountUnit,
      queryClient,
      row.anzPflanzen,
      row.anzTriebe,
      row.id,
      row.typ,
      store.user.name,
    ],
  )

  const [tab, setTab] = useSearchParamsState('tpopmassnTab', 'tpopmassn')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

  const { width = 500, ref: resizeRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
    refreshOptions: { leading: true },
  })
  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container ref={resizeRef}>
        <FormTitle title="Massnahme" />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Massnahme" value="tpopmassn" data-id="tpopmassn" />
          <StyledTab label="Dateien" value="dateien" data-id="dateien" />
        </Tabs>
        <div style={{ overflowY: 'auto' }}>
          <TabContent>
            {tab === 'tpopmassn' && (
              <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
                <ColumnContainer data-column-width={columnWidth}>
                  <FormContainer>
                    <TextField
                      name="jahr"
                      label="Jahr"
                      type="number"
                      value={row.jahr}
                      saveToDb={saveToDb}
                      error={fieldErrors.jahr}
                    />
                    <DateField
                      name="datum"
                      label="Datum"
                      value={row.datum}
                      saveToDb={saveToDb}
                      error={fieldErrors.datum}
                    />
                    <RadioButtonGroup
                      name="typ"
                      label="Typ"
                      dataSource={data?.allTpopmassnTypWertes?.nodes ?? []}
                      loading={loading}
                      value={row.typ}
                      saveToDb={saveToDb}
                      error={fieldErrors.typ}
                    />
                    <TextField
                      name="beschreibung"
                      label="Massnahme"
                      type="text"
                      value={row.beschreibung}
                      saveToDb={saveToDb}
                      error={fieldErrors.beschreibung}
                    />
                    <Select
                      name="bearbeiter"
                      label="BearbeiterIn"
                      value={row.bearbeiter}
                      options={data?.allAdresses?.nodes ?? []}
                      loading={loading}
                      saveToDb={saveToDb}
                      error={fieldErrors.bearbeiter}
                    />
                    <MdField
                      name="bemerkungen"
                      label="Bemerkungen"
                      value={row.bemerkungen}
                      saveToDb={saveToDb}
                      error={fieldErrors.bemerkungen}
                    />
                    <Checkbox2States
                      name="planVorhanden"
                      label="Plan vorhanden"
                      value={row.planVorhanden}
                      saveToDb={saveToDb}
                      error={fieldErrors.planVorhanden}
                    />
                    <TextField
                      name="planBezeichnung"
                      label="Plan Bezeichnung"
                      type="text"
                      value={row.planBezeichnung}
                      saveToDb={saveToDb}
                      error={fieldErrors.planBezeichnung}
                    />
                    <TextField
                      name="flaeche"
                      label="Fläche (m2)"
                      type="number"
                      value={row.flaeche}
                      saveToDb={saveToDb}
                      error={fieldErrors.flaeche}
                    />
                    <TextField
                      name="form"
                      label="Form der Ansiedlung"
                      type="text"
                      value={row.form}
                      saveToDb={saveToDb}
                      error={fieldErrors.form}
                    />
                    <TextField
                      name="pflanzanordnung"
                      label="Pflanzanordnung"
                      type="text"
                      value={row.pflanzanordnung}
                      saveToDb={saveToDb}
                      error={fieldErrors.pflanzanordnung}
                    />
                    <TextField
                      name="markierung"
                      label="Markierung"
                      type="text"
                      value={row.markierung}
                      saveToDb={saveToDb}
                      error={fieldErrors.markierung}
                    />
                    <TextField
                      name="anzTriebe"
                      label="Anzahl Triebe"
                      type="number"
                      value={row.anzTriebe}
                      saveToDb={saveToDb}
                      error={fieldErrors.anzTriebe}
                    />
                    <TextField
                      name="anzPflanzen"
                      label="Anzahl Pflanzen"
                      type="number"
                      value={row.anzPflanzen}
                      saveToDb={saveToDb}
                      error={fieldErrors.anzPflanzen}
                    />
                    <TextField
                      name="anzPflanzstellen"
                      label="Anzahl Pflanzstellen"
                      type="number"
                      value={row.anzPflanzstellen}
                      saveToDb={saveToDb}
                      error={fieldErrors.anzPflanzstellen}
                    />
                    {isAnpflanzung && (
                      <>
                        <Select
                          name="zieleinheitEinheit"
                          label="Ziel-Einheit: Einheit (wird automatisch gesetzt)"
                          value={row.zieleinheitEinheit}
                          options={
                            data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
                          }
                          loading={loading}
                          saveToDb={saveToDb}
                          error={fieldErrors.zieleinheitEinheit}
                        />
                        <TextField
                          name="zieleinheitAnzahl"
                          label={
                            notMassnCountUnit === true
                              ? 'Ziel-Einheit: Anzahl'
                              : 'Ziel-Einheit: Anzahl (wird automatisch gesetzt)'
                          }
                          type="number"
                          value={row.zieleinheitAnzahl}
                          saveToDb={saveToDb}
                          error={fieldErrors.zieleinheitAnzahl}
                        />
                      </>
                    )}
                    <SelectLoadingOptionsTypable
                      key={`${id}${!!row.wirtspflanze}`}
                      label="Wirtspflanze"
                      row={row}
                      query={queryAeTaxonomies}
                      queryNodesName="allAeTaxonomies"
                      saveToDb={saveToDb}
                      error={fieldErrors.wirtspflanze}
                    />
                    <TextField
                      name="herkunftPop"
                      label="Herkunftspopulation"
                      type="text"
                      value={row.herkunftPop}
                      saveToDb={saveToDb}
                      error={fieldErrors.herkunftPop}
                    />
                    <TextField
                      name="sammeldatum"
                      label="Sammeldatum"
                      type="text"
                      value={row.sammeldatum}
                      saveToDb={saveToDb}
                      error={fieldErrors.sammeldatum}
                    />
                    <TextField
                      name="vonAnzahlIndividuen"
                      label="Anzahl besammelte Individuen der Herkunftspopulation"
                      type="number"
                      value={row.vonAnzahlIndividuen}
                      saveToDb={saveToDb}
                      error={fieldErrors.vonAnzahlIndividuen}
                    />
                    {!showFilter && <StringToCopy text={row.id} label="id" />}
                  </FormContainer>
                </ColumnContainer>
              </SimpleBar>
            )}
            {tab === 'dateien' && !showFilter && (
              <Files parentId={row.id} parent="tpopmassn" />
            )}
          </TabContent>
        </div>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopmassn)
