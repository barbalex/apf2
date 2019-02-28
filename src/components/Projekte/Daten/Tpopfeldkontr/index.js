// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import compose from 'recompose/compose'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
//import format from 'date-fns/format'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import TpopfeldkontrentwicklungPopover from '../TpopfeldkontrentwicklungPopover'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './data'
import updateTpopkontrByIdGql from './updateTpopkontrById'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import withAllAdresses from './withAllAdresses'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import filterNodesByNodeFilterArray from '../../TreeContainer/filterNodesByNodeFilterArray'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  > div:first-child {
    > div:first-child {
      display: block !important;
    }
  }
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
const FormContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`
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

const enhance = compose(
  withAllAdresses,
  observer,
)

const Tpopfeldkontr = ({
  dimensions = { width: 380 },
  treeName,
  dataAllAdresses,
}: {
  dimensions: Object,
  treeName: string,
  dataAllAdresses: Object,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const {
    nodeFilter,
    nodeFilterSetValue,
    urlQuery,
    setUrlQuery,
    refetch,
  } = mobxStore
  const { activeNodeArray } = mobxStore[treeName]
  const showFilter = !!nodeFilter[treeName].activeTable

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 9
          ? activeNodeArray[9]
          : '99999999-9999-9999-9999-999999999999',
      showFilter,
    },
  })

  const [errors, setErrors] = useState({})
  const [value, setValue] = useState(
    get(urlQuery, 'feldkontrTab', 'entwicklung'),
  )

  let tpopkontrTotal = []
  let tpopkontrFiltered = []
  let row
  if (showFilter) {
    row = nodeFilter[treeName].tpopfeldkontr
    // get filter values length
    tpopkontrTotal = get(data, 'allTpopkontrs.nodes', [])
    const nodeFilterArray = Object.entries(
      nodeFilter[treeName].tpopfeldkontr,
    ).filter(([key, value]) => value || value === 0 || value === false)
    tpopkontrFiltered = tpopkontrTotal.filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray,
        table: 'tpopfeldkontr',
      }),
    )
  } else {
    row = get(data, 'tpopkontrById', {})
  }

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)
      if ([undefined, ''].includes(value)) value = null
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'tpopfeldkontr',
          key: field,
          value,
        })
      } else {
        /**
         * enable passing two values
         * with same update
         */
        const variables = {
          id: row.id,
          [field]: value,
          changedBy: mobxStore.user.name,
        }
        let field2
        if (field === 'jahr') field2 = 'datum'
        if (field === 'datum') field2 = 'jahr'
        let value2
        if (field === 'jahr') value2 = null
        if (field === 'datum') {
          // this broke 13.2.2019
          // value2 = !!value ? +format(new Date(value), 'yyyy') : null
          // value can be null so check if substring method exists
          value2 = value.substring ? +value.substring(0, 4) : value
        }
        if (field2) variables[field2] = value2
        try {
          await client.mutate({
            mutation: updateTpopkontrByIdGql,
            variables,
            optimisticResponse: {
              __typename: 'Mutation',
              updateTpopkontrById: {
                tpopkontr: {
                  id: row.id,
                  typ: field === 'typ' ? value : row.typ,
                  jahr:
                    field === 'jahr'
                      ? value
                      : field2 === 'jahr'
                      ? value2
                      : row.jahr,
                  datum:
                    field === 'datum'
                      ? value
                      : field2 === 'datum'
                      ? value2
                      : row.datum,
                  jungpflanzenAnzahl:
                    field === 'jungpflanzenAnzahl'
                      ? value
                      : row.jungpflanzenAnzahl,
                  vitalitaet: field === 'vitalitaet' ? value : row.vitalitaet,
                  ueberlebensrate:
                    field === 'ueberlebensrate' ? value : row.ueberlebensrate,
                  entwicklung:
                    field === 'entwicklung' ? value : row.entwicklung,
                  ursachen: field === 'ursachen' ? value : row.ursachen,
                  erfolgsbeurteilung:
                    field === 'erfolgsbeurteilung'
                      ? value
                      : row.erfolgsbeurteilung,
                  umsetzungAendern:
                    field === 'umsetzungAendern' ? value : row.umsetzungAendern,
                  kontrolleAendern:
                    field === 'kontrolleAendern' ? value : row.kontrolleAendern,
                  bemerkungen:
                    field === 'bemerkungen' ? value : row.bemerkungen,
                  lrDelarze: field === 'lrDelarze' ? value : row.lrDelarze,
                  flaeche: field === 'flaeche' ? value : row.flaeche,
                  lrUmgebungDelarze:
                    field === 'lrUmgebungDelarze'
                      ? value
                      : row.lrUmgebungDelarze,
                  vegetationstyp:
                    field === 'vegetationstyp' ? value : row.vegetationstyp,
                  konkurrenz: field === 'konkurrenz' ? value : row.konkurrenz,
                  moosschicht:
                    field === 'moosschicht' ? value : row.moosschicht,
                  krautschicht:
                    field === 'krautschicht' ? value : row.krautschicht,
                  strauchschicht:
                    field === 'strauchschicht' ? value : row.strauchschicht,
                  baumschicht:
                    field === 'baumschicht' ? value : row.baumschicht,
                  bodenTyp: field === 'bodenTyp' ? value : row.bodenTyp,
                  bodenKalkgehalt:
                    field === 'bodenKalkgehalt' ? value : row.bodenKalkgehalt,
                  bodenDurchlaessigkeit:
                    field === 'bodenDurchlaessigkeit'
                      ? value
                      : row.bodenDurchlaessigkeit,
                  bodenHumus: field === 'bodenHumus' ? value : row.bodenHumus,
                  bodenNaehrstoffgehalt:
                    field === 'bodenNaehrstoffgehalt'
                      ? value
                      : row.bodenNaehrstoffgehalt,
                  bodenAbtrag:
                    field === 'bodenAbtrag' ? value : row.bodenAbtrag,
                  wasserhaushalt:
                    field === 'wasserhaushalt' ? value : row.wasserhaushalt,
                  idealbiotopUebereinstimmung:
                    field === 'idealbiotopUebereinstimmung'
                      ? value
                      : row.idealbiotopUebereinstimmung,
                  handlungsbedarf:
                    field === 'handlungsbedarf' ? value : row.handlungsbedarf,
                  flaecheUeberprueft:
                    field === 'flaecheUeberprueft'
                      ? value
                      : row.flaecheUeberprueft,
                  deckungVegetation:
                    field === 'deckungVegetation'
                      ? value
                      : row.deckungVegetation,
                  deckungNackterBoden:
                    field === 'deckungNackterBoden'
                      ? value
                      : row.deckungNackterBoden,
                  deckungApArt:
                    field === 'deckungApArt' ? value : row.deckungApArt,
                  vegetationshoeheMaximum:
                    field === 'vegetationshoeheMaximum'
                      ? value
                      : row.vegetationshoeheMaximum,
                  vegetationshoeheMittel:
                    field === 'vegetationshoeheMittel'
                      ? value
                      : row.vegetationshoeheMittel,
                  gefaehrdung:
                    field === 'gefaehrdung' ? value : row.gefaehrdung,
                  tpopId: field === 'tpopId' ? value : row.tpopId,
                  bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                  planVorhanden:
                    field === 'planVorhanden' ? value : row.planVorhanden,
                  jungpflanzenVorhanden:
                    field === 'jungpflanzenVorhanden'
                      ? value
                      : row.jungpflanzenVorhanden,
                  adresseByBearbeiter: row.adresseByBearbeiter,
                  tpopByTpopId: row.tpopByTpopId,
                  __typename: 'Tpopkontr',
                },
                __typename: 'Tpopkontr',
              },
            },
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        setErrors({})
        if (['typ'].includes(field)) refetch.tpopfeldkontrs()
      }
    },
    [row, showFilter],
  )
  const onChangeTab = useCallback((event, value) => {
    setUrlQueryValue({
      key: 'feldkontrTab',
      value,
      urlQuery,
      setUrlQuery,
    })
    setValue(value)
  })

  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  let adressenWerte = get(dataAllAdresses, 'allAdresses.nodes', [])
  adressenWerte = sortBy(adressenWerte, 'name')
  adressenWerte = adressenWerte.map(el => ({
    value: el.id,
    label: el.name,
  }))
  let idbiotopuebereinstWerte = get(
    data,
    'allTpopkontrIdbiotuebereinstWertes.nodes',
    [],
  )
  idbiotopuebereinstWerte = sortBy(idbiotopuebereinstWerte, 'sort')
  idbiotopuebereinstWerte = idbiotopuebereinstWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))
  let tpopEntwicklungWerte = get(data, 'allTpopEntwicklungWertes.nodes', [])
  tpopEntwicklungWerte = sortBy(tpopEntwicklungWerte, 'sort')
  tpopEntwicklungWerte = tpopEntwicklungWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))
  let aeLrWerte = get(data, 'allAeLrdelarzes.nodes', [])
  aeLrWerte = sortBy(aeLrWerte, 'sort')
  aeLrWerte = aeLrWerte
    .map(e => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`)
    .map(o => ({ value: o, label: o }))

  if (loading || dataAllAdresses.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (dataAllAdresses.error) return `Fehler: ${dataAllAdresses.error.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <FormTitle
          apId={get(data, 'tpopkontrById.tpopByTpopId.popByPopId.apId')}
          title="Feld-Kontrolle"
          treeName={treeName}
          table="tpopfeldkontr"
          totalNr={tpopkontrTotal.length}
          filteredNr={tpopkontrFiltered.length}
        />
        <FieldsContainer>
          <Tabs
            value={value}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Entwicklung" value="entwicklung" />
            <Tab label="Biotop" value="biotop" />
          </Tabs>
          {value === 'entwicklung' && (
            <FormContainer data-width={width}>
              <TextField
                key={`${row.id}jahr`}
                name="jahr"
                label="Jahr"
                value={row.jahr}
                type="number"
                saveToDb={saveToDb}
                error={errors.jahr}
              />
              <DateFieldWithPicker
                key={`${row.id}datum`}
                name="datum"
                label="Datum"
                value={row.datum}
                saveToDb={saveToDb}
                error={errors.datum}
              />
              <RadioButtonGroup
                key={`${row.id}typ`}
                name="typ"
                label="Kontrolltyp"
                value={row.typ}
                dataSource={tpopkontrTypWerte}
                saveToDb={saveToDb}
                error={errors.typ}
              />
              <Select
                key={`${row.id}bearbeiter`}
                name="bearbeiter"
                value={row.bearbeiter}
                field="bearbeiter"
                label="BearbeiterIn"
                options={adressenWerte}
                saveToDb={saveToDb}
                error={errors.bearbeiter}
              />
              <TextField
                key={`${row.id}jungpflanzen_anzahl`}
                name="jungpflanzenAnzahl"
                label="Anzahl Jungpflanzen"
                value={row.jungpflanzenAnzahl}
                type="number"
                saveToDb={saveToDb}
                error={errors.jungpflanzenAnzahl}
              />
              <TextField
                key={`${row.id}vitalitaet`}
                name="vitalitaet"
                label="Vitalität"
                value={row.vitalitaet}
                type="text"
                saveToDb={saveToDb}
                error={errors.vitalitaet}
              />
              <TextField
                key={`${row.id}ueberlebensrate`}
                name="ueberlebensrate"
                label="Überlebensrate"
                value={row.ueberlebensrate}
                type="number"
                saveToDb={saveToDb}
                error={errors.ueberlebensrate}
              />
              <RadioButtonGroupWithInfo
                key={`${row.id}entwicklung`}
                name="entwicklung"
                label="Entwicklung"
                value={row.entwicklung}
                dataSource={tpopEntwicklungWerte}
                saveToDb={saveToDb}
                error={errors.entwicklung}
                popover={TpopfeldkontrentwicklungPopover}
              />
              <TextField
                key={`${row.id}ursachen`}
                name="ursachen"
                label="Ursachen"
                value={row.ursachen}
                hintText="Standort: ..., Klima: ..., anderes: ..."
                type="text"
                multiLine
                saveToDb={saveToDb}
                error={errors.ursachen}
              />
              <TextField
                key={`${row.id}erfolgsbeurteilung`}
                name="erfolgsbeurteilung"
                label="Erfolgsbeurteilung"
                value={row.erfolgsbeurteilung}
                type="text"
                multiLine
                saveToDb={saveToDb}
                error={errors.erfolgsbeurteilung}
              />
              <TextField
                key={`${row.id}umsetzung_aendern`}
                name="umsetzungAendern"
                label="Änderungs-Vorschläge Umsetzung"
                value={row.umsetzungAendern}
                type="text"
                multiLine
                saveToDb={saveToDb}
                error={errors.umsetzungAendern}
              />
              <TextField
                key={`${row.id}kontrolle_aendern`}
                name="kontrolleAendern"
                label="Änderungs-Vorschläge Kontrolle"
                value={row.kontrolleAendern}
                type="text"
                multiLine
                saveToDb={saveToDb}
                error={errors.kontrolleAendern}
              />
              <TextField
                key={`${row.id}bemerkungen`}
                name="bemerkungen"
                label="Bemerkungen"
                value={row.bemerkungen}
                type="text"
                multiLine
                saveToDb={saveToDb}
                error={errors.bemerkungen}
              />
              <StringToCopy text={row.id} label="id" />
            </FormContainer>
          )}
          {value === 'biotop' && (
            <FormContainer data-width={width}>
              <TextField
                key={`${row.id}flaeche`}
                name="flaeche"
                label="Fläche"
                value={row.flaeche}
                type="number"
                saveToDb={saveToDb}
                error={errors.flaeche}
              />
              <Section>Vegetation</Section>
              <Select
                key={`${row.id}lrDelarze`}
                name="lrDelarze"
                value={row.lrDelarze}
                field="lrDelarze"
                label="Lebensraum nach Delarze"
                options={aeLrWerte}
                saveToDb={saveToDb}
                error={errors.lrDelarze}
              />
              <Select
                key={`${row.id}lrUmgebungDelarze`}
                name="lrUmgebungDelarze"
                value={row.lrUmgebungDelarze}
                field="lrUmgebungDelarze"
                label="Umgebung nach Delarze"
                options={aeLrWerte}
                saveToDb={saveToDb}
                error={errors.lrUmgebungDelarze}
              />
              <TextField
                key={`${row.id}vegetationstyp`}
                name="vegetationstyp"
                label="Vegetationstyp"
                value={row.vegetationstyp}
                type="text"
                saveToDb={saveToDb}
                error={errors.vegetationstyp}
              />
              <TextField
                key={`${row.id}konkurrenz`}
                name="konkurrenz"
                label="Konkurrenz"
                value={row.konkurrenz}
                type="text"
                saveToDb={saveToDb}
                error={errors.konkurrenz}
              />
              <TextField
                key={`${row.id}moosschicht`}
                name="moosschicht"
                label="Moosschicht"
                value={row.moosschicht}
                type="text"
                saveToDb={saveToDb}
                error={errors.moosschicht}
              />
              <TextField
                key={`${row.id}krautschicht`}
                name="krautschicht"
                label="Krautschicht"
                value={row.krautschicht}
                type="text"
                saveToDb={saveToDb}
                error={errors.krautschicht}
              />
              <TextField
                key={`${row.id}strauchschicht`}
                name="strauchschicht"
                label="Strauchschicht"
                value={row.strauchschicht}
                type="text"
                saveToDb={saveToDb}
                error={errors.strauchschicht}
              />
              <TextField
                key={`${row.id}baumschicht`}
                name="baumschicht"
                label="Baumschicht"
                value={row.baumschicht}
                type="text"
                saveToDb={saveToDb}
                error={errors.baumschicht}
              />
              <Section>Boden</Section>
              <TextField
                key={`${row.id}boden_typ`}
                name="bodenTyp"
                label="Typ"
                value={row.bodenTyp}
                type="text"
                saveToDb={saveToDb}
                error={errors.bodenTyp}
              />
              <TextField
                key={`${row.id}boden_kalkgehalt`}
                name="bodenKalkgehalt"
                label="Kalkgehalt"
                value={row.bodenKalkgehalt}
                type="text"
                saveToDb={saveToDb}
                error={errors.bodenKalkgehalt}
              />
              <TextField
                key={`${row.id}boden_durchlaessigkeit`}
                name="bodenDurchlaessigkeit"
                label="Durchlässigkeit"
                value={row.bodenDurchlaessigkeit}
                type="text"
                saveToDb={saveToDb}
                error={errors.bodenDurchlaessigkeit}
              />
              <TextField
                key={`${row.id}boden_humus`}
                name="bodenHumus"
                label="Humusgehalt"
                value={row.bodenHumus}
                type="text"
                saveToDb={saveToDb}
                error={errors.bodenHumus}
              />
              <TextField
                key={`${row.id}boden_naehrstoffgehalt`}
                name="bodenNaehrstoffgehalt"
                label="Nährstoffgehalt"
                value={row.bodenNaehrstoffgehalt}
                type="text"
                saveToDb={saveToDb}
                error={errors.bodenNaehrstoffgehalt}
              />
              <TextField
                key={`${row.id}boden_abtrag`}
                name="bodenAbtrag"
                label="Bodenabtrag"
                value={row.bodenAbtrag}
                type="text"
                saveToDb={saveToDb}
                error={errors.bodenAbtrag}
              />
              <TextField
                key={`${row.id}wasserhaushalt`}
                name="wasserhaushalt"
                label="Wasserhaushalt"
                value={row.wasserhaushalt}
                type="text"
                saveToDb={saveToDb}
                error={errors.wasserhaushalt}
              />
              <Section>Beurteilung</Section>
              <TextField
                key={`${row.id}handlungsbedarf`}
                name="handlungsbedarf"
                label="Handlungsbedarf"
                value={row.handlungsbedarf}
                type="text"
                multiline
                saveToDb={saveToDb}
                error={errors.handlungsbedarf}
              />
              <RadioButtonGroup
                key={`${row.id}idealbiotop_uebereinstimmung`}
                name="idealbiotopUebereinstimmung"
                label="Übereinstimmung mit Idealbiotop"
                value={row.idealbiotopUebereinstimmung}
                dataSource={idbiotopuebereinstWerte}
                saveToDb={saveToDb}
                error={errors.idealbiotopUebereinstimmung}
              />
            </FormContainer>
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopfeldkontr)
