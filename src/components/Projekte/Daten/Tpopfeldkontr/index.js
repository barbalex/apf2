// @flow
import React, { Component, createRef } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { Query, Mutation, withApollo } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'
import gql from 'graphql-tag'
import withLifecycle from '@hocs/with-lifecycle'

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
import dataGql from './data'
import updateTpopkontrByIdGql from './updateTpopkontrById'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import withNodeFilter from '../../../../state/withNodeFilter'
import withAllAdresses from './withAllAdresses'

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
  withNodeFilter,
  withState('errors', 'setErrors', {}),
  withApollo,
  withState('value', 'setValue', ({ client }) => {
    const { data } = client.query({
      query: gql`
        query Query {
          urlQuery @client {
            projekteTabs
            feldkontrTab
          }
        }
      `,
    })
    return get(data, 'urlQuery.feldkontrTab', 'entwicklung')
  }),
  withHandlers({
    saveToDb: ({
      refetchTree,
      setErrors,
      errors,
      nodeFilterState,
      treeName,
    }) => async ({ row, field, value, field2, value2, updateTpopkontr }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      const showFilter = !!nodeFilterState.state[treeName].activeTable
      if (showFilter) {
        nodeFilterState.setValue({
          treeName,
          table: 'tpopfeldkontr',
          key: field,
          value,
        })
        //refetchTree()
      } else {
        /**
         * enable passing two values
         * with same update
         */
        const variables = {
          id: row.id,
          [field]: value,
        }
        if (field2) variables[field2] = value2
        try {
          await updateTpopkontr({
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
        if (['typ'].includes(field)) refetchTree('tpopfeldkontrs')
      }
    },
    onChangeTab: ({ setValue }) => (event, value) => {
      setUrlQueryValue({ key: 'feldkontrTab', value })
      setValue(value)
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

type Props = {
  id: string,
  onChangeTab: () => void,
  dimensions: Object,
  value: string,
  setValue: () => void,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
  nodeFilterState: Object,
  dataAllAdresses: Object,
}

class Tpopfeldkontr extends Component<Props> {
  constructor(props) {
    super(props)
    this.container = createRef()
  }

  render() {
    const {
      // pass in fake id to avoid error when filter is shown
      // which means there is no id
      id = '99999999-9999-9999-9999-999999999999',
      onChangeTab,
      dimensions = { width: 380 },
      value,
      saveToDb,
      errors,
      treeName,
      nodeFilterState,
      dataAllAdresses,
    } = this.props

    return (
      <Query query={dataGql} variables={{ id }}>
        {({ loading, error, data, client }) => {
          if (loading || dataAllAdresses.loading)
            return (
              <Container>
                <FieldsContainer>Lade...</FieldsContainer>
              </Container>
            )
          if (error) return `Fehler: ${error.message}`
          if (dataAllAdresses.error)
            return `Fehler: ${dataAllAdresses.error.message}`

          const width = isNaN(dimensions.width) ? 380 : dimensions.width

          const showFilter = !!nodeFilterState.state[treeName].activeTable
          let row
          if (showFilter) {
            row = nodeFilterState.state[treeName].tpopfeldkontr
          } else {
            row = get(data, 'tpopkontrById', {})
          }

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
          let tpopEntwicklungWerte = get(
            data,
            'allTpopEntwicklungWertes.nodes',
            [],
          )
          tpopEntwicklungWerte = sortBy(tpopEntwicklungWerte, 'sort')
          tpopEntwicklungWerte = tpopEntwicklungWerte.map(el => ({
            value: el.code,
            label: el.text,
          }))
          let aeLrWerte = get(data, 'allAeLrdelarzes.nodes', [])
          aeLrWerte = sortBy(aeLrWerte, 'sort')
          aeLrWerte = aeLrWerte
            .map(
              e =>
                `${e.label}: ${
                  e.einheit ? e.einheit.replace(/  +/g, ' ') : ''
                }`,
            )
            .map(o => ({ value: o, label: o }))

          return (
            <ErrorBoundary>
              <Container innerRef={this.container} showfilter={showFilter}>
                <FormTitle
                  apId={get(data, 'tpopkontrById.tpopByTpopId.popByPopId.apId')}
                  title="Feld-Kontrolle"
                  treeName={treeName}
                  table="tpopfeldkontr"
                />
                <Mutation mutation={updateTpopkontrByIdGql}>
                  {(updateTpopkontr, { data }) => (
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
                            label="Jahr"
                            value={row.jahr}
                            type="number"
                            saveToDb={value => {
                              saveToDb({
                                row,
                                field: 'jahr',
                                value,
                                field2: 'datum',
                                value2: null,
                                updateTpopkontr,
                              })
                            }}
                            error={errors.jahr}
                          />
                          <DateFieldWithPicker
                            key={`${row.id}datum`}
                            label="Datum"
                            value={row.datum}
                            saveToDb={value => {
                              saveToDb({
                                row,
                                field: 'datum',
                                value,
                                field2: 'jahr',
                                value2: !!value ? format(value, 'YYYY') : null,
                                updateTpopkontr,
                              })
                            }}
                            error={errors.datum}
                          />
                          <RadioButtonGroup
                            key={`${row.id}typ`}
                            label="Kontrolltyp"
                            value={row.typ}
                            dataSource={tpopkontrTypWerte}
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'typ',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.typ}
                          />
                          <Select
                            key={`${row.id}bearbeiter`}
                            value={row.bearbeiter}
                            field="bearbeiter"
                            label="BearbeiterIn"
                            options={adressenWerte}
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bearbeiter',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bearbeiter}
                          />
                          <TextField
                            key={`${row.id}jungpflanzen_anzahl`}
                            label="Anzahl Jungpflanzen"
                            value={row.jungpflanzenAnzahl}
                            type="number"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'jungpflanzenAnzahl',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.jungpflanzenAnzahl}
                          />
                          <TextField
                            key={`${row.id}vitalitaet`}
                            label="Vitalität"
                            value={row.vitalitaet}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'vitalitaet',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.vitalitaet}
                          />
                          <TextField
                            key={`${row.id}ueberlebensrate`}
                            label="Überlebensrate"
                            value={row.ueberlebensrate}
                            type="number"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'ueberlebensrate',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.ueberlebensrate}
                          />
                          <RadioButtonGroupWithInfo
                            key={`${row.id}entwicklung`}
                            label="Entwicklung"
                            value={row.entwicklung}
                            dataSource={tpopEntwicklungWerte}
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'entwicklung',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.entwicklung}
                            popover={TpopfeldkontrentwicklungPopover}
                          />
                          <TextField
                            key={`${row.id}ursachen`}
                            label="Ursachen"
                            value={row.ursachen}
                            hintText="Standort: ..., Klima: ..., anderes: ..."
                            type="text"
                            multiLine
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'ursachen',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.ursachen}
                          />
                          <TextField
                            key={`${row.id}erfolgsbeurteilung`}
                            label="Erfolgsbeurteilung"
                            value={row.erfolgsbeurteilung}
                            type="text"
                            multiLine
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'erfolgsbeurteilung',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.erfolgsbeurteilung}
                          />
                          <TextField
                            key={`${row.id}umsetzung_aendern`}
                            label="Änderungs-Vorschläge Umsetzung"
                            value={row.umsetzungAendern}
                            type="text"
                            multiLine
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'umsetzungAendern',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.umsetzungAendern}
                          />
                          <TextField
                            key={`${row.id}kontrolle_aendern`}
                            label="Änderungs-Vorschläge Kontrolle"
                            value={row.kontrolleAendern}
                            type="text"
                            multiLine
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'kontrolleAendern',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.kontrolleAendern}
                          />
                          <TextField
                            key={`${row.id}bemerkungen`}
                            label="Bemerkungen"
                            value={row.bemerkungen}
                            type="text"
                            multiLine
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bemerkungen',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bemerkungen}
                          />
                          <StringToCopy text={row.id} label="id" />
                        </FormContainer>
                      )}
                      {value === 'biotop' && (
                        <FormContainer data-width={width}>
                          <TextField
                            key={`${row.id}flaeche`}
                            label="Fläche"
                            value={row.flaeche}
                            type="number"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'flaeche',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.flaeche}
                          />
                          <Section>Vegetation</Section>
                          <Select
                            key={`${row.id}lrDelarze`}
                            value={row.lrDelarze}
                            field="lrDelarze"
                            label="Lebensraum nach Delarze"
                            options={aeLrWerte}
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'lrDelarze',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.lrDelarze}
                          />
                          <Select
                            key={`${row.id}lrUmgebungDelarze`}
                            value={row.lrUmgebungDelarze}
                            field="lrUmgebungDelarze"
                            label="Umgebung nach Delarze"
                            options={aeLrWerte}
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'lrUmgebungDelarze',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.lrUmgebungDelarze}
                          />
                          <TextField
                            key={`${row.id}vegetationstyp`}
                            label="Vegetationstyp"
                            value={row.vegetationstyp}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'vegetationstyp',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.vegetationstyp}
                          />
                          <TextField
                            key={`${row.id}konkurrenz`}
                            label="Konkurrenz"
                            value={row.konkurrenz}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'konkurrenz',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.konkurrenz}
                          />
                          <TextField
                            key={`${row.id}moosschicht`}
                            label="Moosschicht"
                            value={row.moosschicht}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'moosschicht',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.moosschicht}
                          />
                          <TextField
                            key={`${row.id}krautschicht`}
                            label="Krautschicht"
                            value={row.krautschicht}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'krautschicht',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.krautschicht}
                          />
                          <TextField
                            key={`${row.id}strauchschicht`}
                            label="Strauchschicht"
                            value={row.strauchschicht}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'strauchschicht',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.strauchschicht}
                          />
                          <TextField
                            key={`${row.id}baumschicht`}
                            label="Baumschicht"
                            value={row.baumschicht}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'baumschicht',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.baumschicht}
                          />
                          <Section>Boden</Section>
                          <TextField
                            key={`${row.id}boden_typ`}
                            label="Typ"
                            value={row.bodenTyp}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bodenTyp',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bodenTyp}
                          />
                          <TextField
                            key={`${row.id}boden_kalkgehalt`}
                            label="Kalkgehalt"
                            value={row.bodenKalkgehalt}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bodenKalkgehalt',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bodenKalkgehalt}
                          />
                          <TextField
                            key={`${row.id}boden_durchlaessigkeit`}
                            label="Durchlässigkeit"
                            value={row.bodenDurchlaessigkeit}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bodenDurchlaessigkeit',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bodenDurchlaessigkeit}
                          />
                          <TextField
                            key={`${row.id}boden_humus`}
                            label="Humusgehalt"
                            value={row.bodenHumus}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bodenHumus',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bodenHumus}
                          />
                          <TextField
                            key={`${row.id}boden_naehrstoffgehalt`}
                            label="Nährstoffgehalt"
                            value={row.bodenNaehrstoffgehalt}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bodenNaehrstoffgehalt',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bodenNaehrstoffgehalt}
                          />
                          <TextField
                            key={`${row.id}boden_abtrag`}
                            label="Bodenabtrag"
                            value={row.bodenAbtrag}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'bodenAbtrag',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.bodenAbtrag}
                          />
                          <TextField
                            key={`${row.id}wasserhaushalt`}
                            label="Wasserhaushalt"
                            value={row.wasserhaushalt}
                            type="text"
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'wasserhaushalt',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.wasserhaushalt}
                          />
                          <Section>Beurteilung</Section>
                          <TextField
                            key={`${row.id}handlungsbedarf`}
                            label="Handlungsbedarf"
                            value={row.handlungsbedarf}
                            type="text"
                            multiline
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'handlungsbedarf',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.handlungsbedarf}
                          />
                          <RadioButtonGroup
                            key={`${row.id}idealbiotop_uebereinstimmung`}
                            label="Übereinstimmung mit Idealbiotop"
                            value={row.idealbiotopUebereinstimmung}
                            dataSource={idbiotopuebereinstWerte}
                            saveToDb={value =>
                              saveToDb({
                                row,
                                field: 'idealbiotopUebereinstimmung',
                                value,
                                updateTpopkontr,
                              })
                            }
                            error={errors.idealbiotopUebereinstimmung}
                          />
                        </FormContainer>
                      )}
                    </FieldsContainer>
                  )}
                </Mutation>
              </Container>
            </ErrorBoundary>
          )
        }}
      </Query>
    )
  }
}

export default enhance(Tpopfeldkontr)
