// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Tabs, { Tab } from 'material-ui/Tabs'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

import RadioButtonGroup from '../../../shared/RadioButtonGroupGql'
import TextField from '../../../shared/TextFieldGql'
import AutoCompleteFromArray from '../../../shared/AutocompleteFromArrayGql'
import AutoComplete from '../../../shared/AutocompleteGql'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfoGql'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerGql'
import TpopfeldkontrentwicklungPopover from '../TpopfeldkontrentwicklungPopover'
import constants from '../../../../modules/constants'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import tpopkontrByIdGql from './tpopkontrById.graphql'
import updateTpopkontrByIdGql from './updateTpopkontrById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
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
  inject('store'),
  withState(
    'value',
    'setValue',
    ({ store }) => store.urlQuery.feldkontrTab || 'entwicklung'
  ),
  withHandlers({
    onChangeTab: ({ setValue, store }) => (event, value) => {
      store.setUrlQueryValue('feldkontrTab', value)
      setValue(value)
    },
  }),
  observer
)

const Tpopfeldkontr = ({
  id,
  onChangeTab,
  dimensions = { width: 380 },
  value,
  setValue,
}: {
  id: String,
  onChangeTab: () => void,
  dimensions: Object,
  value: String,
  setValue: () => void,
}) => {
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <Query query={tpopkontrByIdGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`
        const row = get(data, 'tpopkontrById')
        let adressenWerte = get(data, 'allAdresses.nodes', [])
        adressenWerte = sortBy(adressenWerte, 'name')
        adressenWerte = adressenWerte.map(el => ({
          id: el.id,
          value: el.name,
        }))
        let idbiotopuebereinstWerte = get(
          data,
          'allTpopkontrIdbiotuebereinstWertes.nodes',
          []
        )
        idbiotopuebereinstWerte = sortBy(idbiotopuebereinstWerte, 'sort')
        idbiotopuebereinstWerte = idbiotopuebereinstWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
        let tpopEntwicklungWerte = get(
          data,
          'allTpopEntwicklungWertes.nodes',
          []
        )
        tpopEntwicklungWerte = sortBy(tpopEntwicklungWerte, 'sort')
        tpopEntwicklungWerte = tpopEntwicklungWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
        let aeLrWerte = get(data, 'allAeLrdelarzes.nodes', [])
        aeLrWerte = sortBy(aeLrWerte, 'sort')
        aeLrWerte = aeLrWerte.map(
          e => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`
        )

        return (
          <ErrorBoundary>
            <Container innerRef={c => (this.container = c)}>
              <FormTitle
                apId={get(data, 'tpopkontrById.tpopByTpopId.popByPopId.apId')}
                title="Feld-Kontrolle"
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
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                jahr: event.target.value || null,
                                datum: null,
                              },
                            })
                          }
                        />
                        <DateFieldWithPicker
                          key={`${row.id}datum`}
                          label="Datum"
                          value={row.datum}
                          saveToDb={value =>
                            updateTpopkontr({
                              variables: {
                                id,
                                datum: value,
                                jahr: !!value ? format(value, 'YYYY') : null,
                              },
                            })
                          }
                        />
                        <RadioButtonGroup
                          key={`${row.id}typ`}
                          label="Kontrolltyp"
                          value={row.typ}
                          dataSource={tpopkontrTypWerte}
                          saveToDb={value =>
                            updateTpopkontr({
                              variables: {
                                id,
                                typ: value,
                              },
                            })
                          }
                        />
                        <AutoComplete
                          key={`${row.id}bearbeiter`}
                          label="BearbeiterIn"
                          value={get(row, 'adresseByBearbeiter.name')}
                          objects={adressenWerte}
                          saveToDb={value =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bearbeiter: value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}jungpflanzen_anzahl`}
                          label="Anzahl Jungpflanzen"
                          value={row.jungpflanzenAnzahl}
                          type="number"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                jungpflanzenAnzahl: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}vitalitaet`}
                          label="Vitalität"
                          value={row.vitalitaet}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                vitalitaet: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}ueberlebensrate`}
                          label="Überlebensrate"
                          value={row.ueberlebensrate}
                          type="number"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                ueberlebensrate: event.target.value,
                              },
                            })
                          }
                        />
                        <RadioButtonGroupWithInfo
                          key={`${row.id}entwicklung`}
                          label="Entwicklung"
                          value={row.entwicklung}
                          dataSource={tpopEntwicklungWerte}
                          saveToDb={value =>
                            updateTpopkontr({
                              variables: {
                                id,
                                entwicklung: value,
                              },
                            })
                          }
                          popover={TpopfeldkontrentwicklungPopover}
                        />
                        <TextField
                          key={`${row.id}ursachen`}
                          label="Ursachen"
                          value={row.ursachen}
                          hintText="Standort: ..., Klima: ..., anderes: ..."
                          type="text"
                          multiLine
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                ursachen: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}erfolgsbeurteilung`}
                          label="Erfolgsbeurteilung"
                          value={row.erfolgsbeurteilung}
                          type="text"
                          multiLine
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                erfolgsbeurteilung: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}umsetzung_aendern`}
                          label="Änderungs-Vorschläge Umsetzung"
                          value={row.umsetzungAendern}
                          type="text"
                          multiLine
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                umsetzungAendern: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}kontrolle_aendern`}
                          label="Änderungs-Vorschläge Kontrolle"
                          value={row.kontrolleAendern}
                          type="text"
                          multiLine
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                kontrolleAendern: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}bemerkungen`}
                          label="Bemerkungen"
                          value={row.bemerkungen}
                          type="text"
                          multiLine
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bemerkungen: event.target.value,
                              },
                            })
                          }
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
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                flaeche: event.target.value,
                              },
                            })
                          }
                        />
                        <Section>Vegetation</Section>
                        <AutoCompleteFromArray
                          key={`${row.id}lr_delarze`}
                          label="Lebensraum nach Delarze"
                          value={row.lrDelarze}
                          values={aeLrWerte}
                          saveToDb={val =>
                            updateTpopkontr({
                              variables: {
                                id,
                                lrDelarze: val,
                              },
                            })
                          }
                        />
                        <AutoCompleteFromArray
                          key={`${row.id}Umgebung`}
                          label="Umgebung nach Delarze"
                          value={row.lrUmgebungDelarze}
                          values={aeLrWerte}
                          saveToDb={val =>
                            updateTpopkontr({
                              variables: {
                                id,
                                lrUmgebungDelarze: val,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}vegetationstyp`}
                          label="Vegetationstyp"
                          value={row.vegetationstyp}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                vegetationstyp: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}konkurrenz`}
                          label="Konkurrenz"
                          value={row.konkurrenz}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                konkurrenz: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}moosschicht`}
                          label="Moosschicht"
                          value={row.moosschicht}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                moosschicht: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}krautschicht`}
                          label="Krautschicht"
                          value={row.krautschicht}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                krautschicht: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}strauchschicht`}
                          label="Strauchschicht"
                          value={row.strauchschicht}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                strauchschicht: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}baumschicht`}
                          label="Baumschicht"
                          value={row.baumschicht}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                baumschicht: event.target.value,
                              },
                            })
                          }
                        />
                        <Section>Boden</Section>
                        <TextField
                          key={`${row.id}boden_typ`}
                          label="Typ"
                          value={row.bodenTyp}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bodenTyp: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}boden_kalkgehalt`}
                          label="Kalkgehalt"
                          value={row.bodenKalkgehalt}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bodenKalkgehalt: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}boden_durchlaessigkeit`}
                          label="Durchlässigkeit"
                          value={row.bodenDurchlaessigkeit}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bodenDurchlaessigkeit: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}boden_humus`}
                          label="Humusgehalt"
                          value={row.bodenHumus}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bodenHumus: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}boden_naehrstoffgehalt`}
                          label="Nährstoffgehalt"
                          value={row.bodenNaehrstoffgehalt}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bodenNaehrstoffgehalt: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}boden_abtrag`}
                          label="Bodenabtrag"
                          value={row.bodenAbtrag}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                bodenAbtrag: event.target.value,
                              },
                            })
                          }
                        />
                        <TextField
                          key={`${row.id}wasserhaushalt`}
                          label="Wasserhaushalt"
                          value={row.wasserhaushalt}
                          type="text"
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                wasserhaushalt: event.target.value,
                              },
                            })
                          }
                        />
                        <Section>Beurteilung</Section>
                        <TextField
                          key={`${row.id}handlungsbedarf`}
                          label="Handlungsbedarf"
                          value={row.handlungsbedarf}
                          type="text"
                          multiline
                          saveToDb={event =>
                            updateTpopkontr({
                              variables: {
                                id,
                                handlungsbedarf: event.target.value,
                              },
                            })
                          }
                        />
                        <RadioButtonGroup
                          key={`${row.id}idealbiotop_uebereinstimmung`}
                          label="Übereinstimmung mit Idealbiotop"
                          value={row.idealbiotopUebereinstimmung}
                          dataSource={idbiotopuebereinstWerte}
                          saveToDb={value =>
                            updateTpopkontr({
                              variables: {
                                id,
                                idealbiotopUebereinstimmung: value,
                              },
                            })
                          }
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

export default enhance(Tpopfeldkontr)
