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

import RadioButtonGroup from '../../../shared/RadioButtonGroupGql'
import TextField from '../../../shared/TextFieldGql'
import AutoCompleteFromArray from '../../../shared/AutocompleteFromArray'
import AutoComplete from '../../../shared/AutocompleteGql'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import YearDatePair from '../../../shared/YearDatePair'
import TpopfeldkontrentwicklungPopover from '../TpopfeldkontrentwicklungPopover'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import tpopkontrByIdGql from './tpopkontrById.graphql'

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
  margin-bottom: -7px;
  color: rgba(255, 255, 255, 0.298039);
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
          value: el.id,
          label: el.name,
        }))

        return (
          <ErrorBoundary>
            <Container innerRef={c => (this.container = c)}>
              <FormTitle
                apId={get(data, 'tpopkontrById.tpopByTpopId.popByPopId.apId')}
                title="Feld-Kontrolle"
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
                    <YearDatePair
                      key={row.id}
                      tree={tree}
                      yearLabel="Jahr"
                      yearFieldName="jahr"
                      yearValue={row.jahr}
                      dateLabel="Datum"
                      dateFieldName="datum"
                      dateValue={row.datum}
                      updateProperty={store.updateProperty}
                      updatePropertyInDb={store.updatePropertyInDb}
                    />
                    <RadioButtonGroup
                      key={`${row.id}typ`}
                      label="Kontrolltyp"
                      value={row.typ}
                      dataSource={tpopkontrTypWerte}
                      saveToDb={() => 'TODO'}
                    />
                    <AutoComplete
                      key={`${row.id}bearbeiter`}
                      label="BearbeiterIn"
                      value={get(row, 'adresseByBearbeiter.name')}
                      objects={adressenWerte}
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}jungpflanzen_anzahl`}
                      label="Anzahl Jungpflanzen"
                      value={row.jungpflanzen_anzahl}
                      type="number"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}vitalitaet`}
                      label="Vitalität"
                      value={row.vitalitaet}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}ueberlebensrate`}
                      label="Überlebensrate"
                      value={row.ueberlebensrate}
                      type="number"
                      saveToDb={() => 'TODO'}
                    />
                    <RadioButtonGroupWithInfo
                      key={`${row.id}entwicklung`}
                      label="Entwicklung"
                      value={row.entwicklung}
                      dataSource={store.dropdownList.tpopEntwicklungWerte}
                      saveToDb={() => 'TODO'}
                      popover={TpopfeldkontrentwicklungPopover}
                    />
                    <TextField
                      key={`${row.id}ursachen`}
                      label="Ursachen"
                      value={row.ursachen}
                      hintText="Standort: ..., Klima: ..., anderes: ..."
                      type="text"
                      multiLine
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}erfolgsbeurteilung`}
                      label="Erfolgsbeurteilung"
                      value={row.erfolgsbeurteilung}
                      type="text"
                      multiLine
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}umsetzung_aendern`}
                      label="Änderungs-Vorschläge Umsetzung"
                      value={row.umsetzung_aendern}
                      type="text"
                      multiLine
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}kontrolle_aendern`}
                      label="Änderungs-Vorschläge Kontrolle"
                      value={row.kontrolle_aendern}
                      type="text"
                      multiLine
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}bemerkungen`}
                      label="Bemerkungen"
                      value={row.bemerkungen}
                      type="text"
                      multiLine
                      saveToDb={() => 'TODO'}
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
                      saveToDb={() => 'TODO'}
                    />
                    <Section>Vegetation</Section>
                    <AutoCompleteFromArray
                      key={`${row.id}lr_delarze`}
                      label="Lebensraum nach Delarze"
                      value={row.lr_delarze}
                      values={store.dropdownList.lr}
                      saveToDb={() => 'TODO'}
                    />
                    <AutoCompleteFromArray
                      key={`${row.id}Umgebung`}
                      label="Umgebung nach Delarze"
                      value={row.lr_umgebung_delarze}
                      values={store.dropdownList.lr}
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}vegetationstyp`}
                      label="Vegetationstyp"
                      value={row.vegetationstyp}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}konkurrenz`}
                      label="Konkurrenz"
                      value={row.konkurrenz}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}moosschicht`}
                      label="Moosschicht"
                      value={row.moosschicht}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}krautschicht`}
                      label="Krautschicht"
                      value={row.krautschicht}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}strauchschicht`}
                      label="Strauchschicht"
                      value={row.strauchschicht}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}baumschicht`}
                      label="Baumschicht"
                      value={row.baumschicht}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <Section>Boden</Section>
                    <TextField
                      key={`${row.id}boden_typ`}
                      label="Typ"
                      value={row.boden_typ}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}boden_kalkgehalt`}
                      label="Kalkgehalt"
                      value={row.boden_kalkgehalt}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}boden_durchlaessigkeit`}
                      label="Durchlässigkeit"
                      value={row.boden_durchlaessigkeit}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}boden_humus`}
                      label="Humusgehalt"
                      value={row.boden_humus}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}boden_naehrstoffgehalt`}
                      label="Nährstoffgehalt"
                      value={row.boden_naehrstoffgehalt}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}boden_abtrag`}
                      label="Bodenabtrag"
                      value={row.boden_abtrag}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <TextField
                      key={`${row.id}wasserhaushalt`}
                      label="Wasserhaushalt"
                      value={row.wasserhaushalt}
                      type="text"
                      saveToDb={() => 'TODO'}
                    />
                    <Section>Beurteilung</Section>
                    <TextField
                      key={`${row.id}handlungsbedarf`}
                      label="Handlungsbedarf"
                      value={row.handlungsbedarf}
                      type="text"
                      multiline
                      saveToDb={() => 'TODO'}
                    />
                    <RadioButtonGroup
                      key={`${row.id}idealbiotop_uebereinstimmung`}
                      label="Übereinstimmung mit Idealbiotop"
                      value={row.idealbiotop_uebereinstimmung}
                      dataSource={store.dropdownList.idbiotopuebereinstWerte}
                      saveToDb={() => 'TODO'}
                    />
                  </FormContainer>
                )}
              </FieldsContainer>
            </Container>
          </ErrorBoundary>
        )
      }}
    </Query>
  )
}

export default enhance(Tpopfeldkontr)
