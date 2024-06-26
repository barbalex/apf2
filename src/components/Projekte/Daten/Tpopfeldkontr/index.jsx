import React, { useState, useCallback, useContext } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import RadioButtonGroup from '../../../shared/RadioButtonGroup.jsx'
import TextField from '../../../shared/TextField.jsx'
import MdField from '../../../shared/MarkdownField/index.jsx'
import Select from '../../../shared/Select.jsx'
import JesNo from '../../../shared/JesNo.jsx'
import Checkbox2States from '../../../shared/Checkbox2States.jsx'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo.jsx'
import DateField from '../../../shared/Date.jsx'
import StringToCopy from '../../../shared/StringToCopy.jsx'
import FormTitle from '../../../shared/FormTitle/index.jsx'
import TpopfeldkontrentwicklungPopover from '../TpopfeldkontrentwicklungPopover.jsx'
import constants from '../../../../modules/constants.js'
import query from './query.js'
import storeContext from '../../../../storeContext.js'
import Files from '../../../shared/Files/index.jsx'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber.js'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import Error from '../../../shared/Error.jsx'
import { tpopfeldkontr } from '../../../shared/fragments.js'
import Spinner from '../../../shared/Spinner.jsx'
import useSearchParamsState from '../../../../modules/useSearchParamsState.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-of-type {
    > div:first-of-type {
      display: block !important;
    }
  }
`
const FormContainer = styled.div`
  padding: 10px;
  height: 100%;
  column-width: ${constants.columnWidth}px;
`
const Section = styled.div`
  padding-top: 20px;
  padding-bottom: 5px;
  font-weight: bold;
  break-after: avoid;
  &:after {
    content: ':';
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: 100%;
`

const fieldTypes = {
  typ: 'String',
  datum: 'Date',
  jahr: 'Int',
  vitalitaet: 'String',
  ueberlebensrate: 'Int',
  entwicklung: 'Int',
  ursachen: 'String',
  erfolgsbeurteilung: 'String',
  umsetzungAendern: 'String',
  kontrolleAendern: 'String',
  bemerkungen: 'String',
  lrDelarze: 'String',
  flaeche: 'Int',
  lrUmgebungDelarze: 'String',
  vegetationstyp: 'String',
  konkurrenz: 'String',
  moosschicht: 'String',
  krautschicht: 'String',
  strauchschicht: 'String',
  baumschicht: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  bodenAbtrag: 'String',
  idealbiotopUebereinstimmung: 'Int',
  handlungsbedarf: 'String',
  flaecheUeberprueft: 'Int',
  deckungVegetation: 'Int',
  deckungNackterBoden: 'Int',
  deckungApArt: 'Int',
  vegetationshoeheMaximum: 'Int',
  vegetationshoeheMittel: 'Int',
  gefaehrdung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
  jungpflanzenVorhanden: 'Boolean',
  apberNichtRelevant: 'Boolean',
  apberNichtRelevantGrund: 'String',
}

const tpopkontrTypWerte = [
  {
    value: 'Ausgangszustand',
    label: 'Ausgangszustand',
  },
  {
    value: 'Zwischenbeurteilung',
    label: 'Zwischenbeurteilung',
  },
]

const Tpopfeldkontr = () => {
  const { tpopkontrId: id } = useParams()

  const client = useApolloClient()
  const queryClient = useQueryClient()
  const store = useContext(storeContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const [tab, setTab] = useSearchParamsState('feldkontrTab', 'entwicklung')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

  const row = data?.tpopkontrById ?? {}

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
        // value can be null so check if substring method exists
        const newJahr =
          value && value.substring ? +value.substring(0, 4) : value
        variables.jahr = newJahr
      }
      try {
        await client.mutate({
          mutation: gql`
              mutation updateTpopkontrForEk(
                $id: UUID!
                $${field}: ${fieldTypes[field]}
                ${field === 'jahr' ? '$datum: Date' : ''}
                ${field === 'datum' ? '$jahr: Int' : ''}
                $changedBy: String
              ) {
                updateTpopkontrById(
                  input: {
                    id: $id
                    tpopkontrPatch: {
                      ${field}: $${field}
                      ${field === 'jahr' ? 'datum: $datum' : ''}
                      ${field === 'datum' ? 'jahr: $jahr' : ''}
                      changedBy: $changedBy
                    }
                  }
                ) {
                  tpopkontr {
                    ...TpopfeldkontrFields
                  }
                }
              }
              ${tpopfeldkontr}
            `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      if (['jahr', 'datum', 'typ'].includes(field)) {
        queryClient.invalidateQueries({
          queryKey: [`treeTpopfeldkontr`],
        })
      }
    },
    [client, queryClient, row.id, store.user.name],
  )

  const aeLrWerte = (data?.allAeLrDelarzes?.nodes ?? [])
    .map(
      (e) => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`,
    )
    .map((o) => ({ value: o, label: o }))

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Feld-Kontrolle" />
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab
              label="Entwicklung"
              value="entwicklung"
              data-id="entwicklung"
            />
            <StyledTab label="Biotop" value="biotop" data-id="biotop" />
            <StyledTab label="Dateien" value="dateien" data-id="dateien" />
          </Tabs>
          <div style={{ overflowY: 'auto' }}>
            <TabContent>
              {tab === 'entwicklung' && (
                <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
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
                      label="Kontrolltyp"
                      dataSource={tpopkontrTypWerte}
                      value={row.typ}
                      saveToDb={saveToDb}
                      error={fieldErrors.typ}
                    />
                    <Select
                      name="bearbeiter"
                      label="BearbeiterIn"
                      options={data?.allAdresses?.nodes ?? []}
                      loading={loading}
                      value={row.bearbeiter}
                      saveToDb={saveToDb}
                      error={fieldErrors.bearbeiter}
                    />
                    <JesNo
                      name="jungpflanzenVorhanden"
                      label="Jungpflanzen vorhanden"
                      value={row.jungpflanzenVorhanden}
                      saveToDb={saveToDb}
                      error={fieldErrors.jungpflanzenVorhanden}
                    />
                    <TextField
                      name="vitalitaet"
                      label="Vitalität"
                      type="text"
                      value={row.vitalitaet}
                      saveToDb={saveToDb}
                      error={fieldErrors.vitalitaet}
                    />
                    <TextField
                      name="ueberlebensrate"
                      label="Überlebensrate (in Prozent)"
                      type="number"
                      value={row.ueberlebensrate}
                      saveToDb={saveToDb}
                      error={fieldErrors.ueberlebensrate}
                    />
                    <RadioButtonGroupWithInfo
                      name="entwicklung"
                      label="Entwicklung"
                      dataSource={data?.allTpopEntwicklungWertes?.nodes ?? []}
                      loading={loading}
                      popover={TpopfeldkontrentwicklungPopover}
                      value={row.entwicklung}
                      saveToDb={saveToDb}
                      error={fieldErrors.entwicklung}
                    />
                    <TextField
                      name="ursachen"
                      label="Ursachen"
                      hintText="Standort: ..., Klima: ..., anderes: ..."
                      type="text"
                      multiLine
                      value={row.ursachen}
                      saveToDb={saveToDb}
                      error={fieldErrors.ursachen}
                    />
                    <TextField
                      name="gefaehrdung"
                      label="Gefährdung"
                      type="text"
                      multiLine
                      value={row.gefaehrdung}
                      saveToDb={saveToDb}
                      error={fieldErrors.gefaehrdung}
                    />
                    <TextField
                      name="erfolgsbeurteilung"
                      label="Erfolgsbeurteilung"
                      type="text"
                      multiLine
                      value={row.erfolgsbeurteilung}
                      saveToDb={saveToDb}
                      error={fieldErrors.erfolgsbeurteilung}
                    />
                    <TextField
                      name="umsetzungAendern"
                      label="Änderungs-Vorschläge Umsetzung"
                      type="text"
                      multiLine
                      value={row.umsetzungAendern}
                      saveToDb={saveToDb}
                      error={fieldErrors.umsetzungAendern}
                    />
                    <TextField
                      name="kontrolleAendern"
                      label="Änderungs-Vorschläge Kontrolle"
                      type="text"
                      multiLine
                      value={row.kontrolleAendern}
                      saveToDb={saveToDb}
                      error={fieldErrors.kontrolleAendern}
                    />
                    <MdField
                      name="bemerkungen"
                      label="Bemerkungen"
                      value={row.bemerkungen}
                      saveToDb={saveToDb}
                      error={fieldErrors.bemerkungen}
                    />
                    <Checkbox2States
                      name="apberNichtRelevant"
                      label="Im Jahresbericht nicht berücksichtigen"
                      value={row.apberNichtRelevant}
                      saveToDb={saveToDb}
                      error={fieldErrors.apberNichtRelevant}
                    />
                    <TextField
                      name="apberNichtRelevantGrund"
                      label="Wieso im Jahresbericht nicht berücksichtigen?"
                      type="text"
                      multiLine
                      value={row.apberNichtRelevantGrund}
                      saveToDb={saveToDb}
                      error={fieldErrors.apberNichtRelevantGrund}
                    />
                    <StringToCopy text={row.id} label="id" />
                  </FormContainer>
                </SimpleBar>
              )}
              {tab === 'biotop' && (
                <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
                  <FormContainer>
                    <TextField
                      name="flaeche"
                      label="Fläche"
                      type="number"
                      value={row.flaeche}
                      saveToDb={saveToDb}
                      error={fieldErrors.flaeche}
                    />
                    <Section>Vegetation</Section>
                    <Select
                      data-id="lrDelarze"
                      name="lrDelarze"
                      label="Lebensraum nach Delarze"
                      options={aeLrWerte}
                      loading={loading}
                      value={row.lrDelarze}
                      saveToDb={saveToDb}
                      error={fieldErrors.lrDelarze}
                    />
                    <Select
                      name="lrUmgebungDelarze"
                      label="Umgebung nach Delarze"
                      options={aeLrWerte}
                      loading={loading}
                      value={row.lrUmgebungDelarze}
                      saveToDb={saveToDb}
                      error={fieldErrors.lrUmgebungDelarze}
                    />
                    <TextField
                      name="vegetationstyp"
                      label="Vegetationstyp"
                      type="text"
                      value={row.vegetationstyp}
                      saveToDb={saveToDb}
                      error={fieldErrors.vegetationstyp}
                    />
                    <TextField
                      name="konkurrenz"
                      label="Konkurrenz"
                      type="text"
                      value={row.konkurrenz}
                      saveToDb={saveToDb}
                      error={fieldErrors.konkurrenz}
                    />
                    <TextField
                      name="moosschicht"
                      label="Moosschicht"
                      type="text"
                      value={row.moosschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.moosschicht}
                    />
                    <TextField
                      name="krautschicht"
                      label="Krautschicht"
                      type="text"
                      value={row.krautschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.krautschicht}
                    />
                    <TextField
                      name="strauchschicht"
                      label="Strauchschicht"
                      type="text"
                      value={row.strauchschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.strauchschicht}
                    />
                    <TextField
                      name="baumschicht"
                      label="Baumschicht"
                      type="text"
                      value={row.baumschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.baumschicht}
                    />
                    <Section>Beurteilung</Section>
                    <TextField
                      name="handlungsbedarf"
                      label="Handlungsbedarf"
                      type="text"
                      multiline
                      value={row.handlungsbedarf}
                      saveToDb={saveToDb}
                      error={fieldErrors.handlungsbedarf}
                    />
                    <RadioButtonGroup
                      name="idealbiotopUebereinstimmung"
                      label="Übereinstimmung mit Idealbiotop"
                      dataSource={
                        data?.allTpopkontrIdbiotuebereinstWertes?.nodes ?? []
                      }
                      loading={loading}
                      value={row.idealbiotopUebereinstimmung}
                      saveToDb={saveToDb}
                      error={fieldErrors.idealbiotopUebereinstimmung}
                    />
                  </FormContainer>
                </SimpleBar>
              )}
              {tab === 'dateien' && (
                <Files parentId={row.id} parent="tpopkontr" />
              )}
            </TabContent>
          </div>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = observer(Tpopfeldkontr)
