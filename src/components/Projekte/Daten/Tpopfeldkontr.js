// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Tabs, Tab } from 'material-ui/Tabs'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import AutoCompleteFromArrayNew from '../../shared/AutocompleteFromArray'
import AutoComplete from '../../shared/Autocomplete'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import StringToCopy from '../../shared/StringToCopy'
import FormTitle from '../../shared/FormTitle'
import YearDatePair from '../../shared/YearDatePair'
import TabTemplate from '../../shared/TabTemplate'
import TpopfeldkontrentwicklungPopover from './TpopfeldkontrentwicklungPopover'
import constants from '../../../modules/constants'
import ErrorBoundary from '../../shared/ErrorBoundary'

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
const TabChildDiv = styled.div`
  height: 100%;
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
const styles = {
  root: {
    flex: '1 1 100%',
    minHeight: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    height: '100%',
  },
}

const getBearbName = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adressen } = store.dropdownList
  const { activeDataset } = tree
  let value = ''
  if (activeDataset.row.bearbeiter && adressen.length > 0) {
    const adresse = adressen.find(a => a.id === activeDataset.row.bearbeiter)
    if (adresse && adresse.value) return adresse.value
  }
  return value
}

const enhance = compose(
  inject('store'),
  withHandlers({
    onChangeTab: props => value =>
      props.store.setUrlQueryValue('feldkontrTab', value),
  }),
  observer
)

const Tpopfeldkontr = ({
  store,
  tree,
  onChangeTab,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  onChangeTab: () => void,
  dimensions: Object,
}) => {
  const { activeDataset } = tree
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <ErrorBoundary>
      <Container innerRef={c => (this.container = c)}>
        <FormTitle tree={tree} title="Feld-Kontrolle" />
        <FieldsContainer>
          <Tabs
            style={styles.root}
            contentContainerStyle={styles.container}
            tabTemplate={TabTemplate}
            value={store.urlQuery.feldkontrTab || 'entwicklung'}
            onChange={onChangeTab}
          >
            <Tab label="Entwicklung" value="entwicklung">
              <TabChildDiv>
                <FormContainer data-width={width}>
                  <YearDatePair
                    key={activeDataset.row.id}
                    tree={tree}
                    yearLabel="Jahr"
                    yearFieldName="jahr"
                    yearValue={activeDataset.row.jahr}
                    yearErrorText={activeDataset.valid.jahr}
                    dateLabel="Datum"
                    dateFieldName="datum"
                    dateValue={activeDataset.row.datum}
                    dateErrorText={activeDataset.valid.datum}
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <RadioButtonGroup
                    key={`${activeDataset.row.id}typ`}
                    tree={tree}
                    fieldName="typ"
                    label="Kontrolltyp"
                    value={activeDataset.row.typ}
                    errorText={activeDataset.valid.typ}
                    dataSource={tpopkontrTypWerte}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <AutoComplete
                    key={`${activeDataset.row.id}bearbeiterNew`}
                    tree={tree}
                    label="BearbeiterIn"
                    fieldName="bearbeiter"
                    value={getBearbName({ store, tree })}
                    objects={store.dropdownList.adressen}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}jungpflanzen_anzahl`}
                    tree={tree}
                    label="Anzahl Jungpflanzen"
                    fieldName="jungpflanzen_anzahl"
                    value={activeDataset.row.jungpflanzen_anzahl}
                    errorText={activeDataset.valid.jungpflanzen_anzahl}
                    type="number"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}vitalitaet`}
                    tree={tree}
                    label="Vitalität"
                    fieldName="vitalitaet"
                    value={activeDataset.row.vitalitaet}
                    errorText={activeDataset.valid.vitalitaet}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}ueberlebensrate`}
                    tree={tree}
                    label="Überlebensrate"
                    fieldName="ueberlebensrate"
                    value={activeDataset.row.ueberlebensrate}
                    errorText={activeDataset.valid.ueberlebensrate}
                    type="number"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <RadioButtonGroupWithInfo
                    tree={tree}
                    fieldName="entwicklung"
                    value={activeDataset.row.entwicklung}
                    dataSource={store.dropdownList.tpopEntwicklungWerte}
                    updatePropertyInDb={store.updatePropertyInDb}
                    popover={TpopfeldkontrentwicklungPopover}
                    label="Entwicklung"
                  />
                  <TextField
                    key={`${activeDataset.row.id}ursachen`}
                    tree={tree}
                    label="Ursachen"
                    fieldName="ursachen"
                    value={activeDataset.row.ursachen}
                    errorText={activeDataset.valid.ursachen}
                    hintText="Standort: ..., Klima: ..., anderes: ..."
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}erfolgsbeurteilung`}
                    tree={tree}
                    label="Erfolgsbeurteilung"
                    fieldName="erfolgsbeurteilung"
                    value={activeDataset.row.erfolgsbeurteilung}
                    errorText={activeDataset.valid.erfolgsbeurteilung}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}umsetzung_aendern`}
                    tree={tree}
                    label="Änderungs-Vorschläge Umsetzung"
                    fieldName="umsetzung_aendern"
                    value={activeDataset.row.umsetzung_aendern}
                    errorText={activeDataset.valid.umsetzung_aendern}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}kontrolle_aendern`}
                    tree={tree}
                    label="Änderungs-Vorschläge Kontrolle"
                    fieldName="kontrolle_aendern"
                    value={activeDataset.row.kontrolle_aendern}
                    errorText={activeDataset.valid.kontrolle_aendern}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Bemerkungen"
                    fieldName="bemerkungen"
                    value={activeDataset.row.bemerkungen}
                    errorText={activeDataset.valid.bemerkungen}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <StringToCopy text={activeDataset.row.id} label="id" />
                </FormContainer>
              </TabChildDiv>
            </Tab>
            <Tab label="Biotop" value="biotop">
              <TabChildDiv>
                <FormContainer data-width={width}>
                  <TextField
                    key={`${activeDataset.row.id}flaeche`}
                    tree={tree}
                    label="Fläche"
                    fieldName="flaeche"
                    value={activeDataset.row.flaeche}
                    errorText={activeDataset.valid.flaeche}
                    type="number"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <Section>Vegetation</Section>
                  <AutoCompleteFromArrayNew
                    key={`${activeDataset.row.id}lr_delarze`}
                    tree={tree}
                    label="Lebensraum nach Delarze"
                    fieldName="lr_delarze"
                    value={activeDataset.row.lr_delarze}
                    errorText={activeDataset.valid.lr_delarze}
                    values={store.dropdownList.lr}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <AutoCompleteFromArrayNew
                    key={`${activeDataset.row.id}Umgebung`}
                    tree={tree}
                    label="Umgebung nach Delarze"
                    fieldName="lr_umgebung_delarze"
                    value={activeDataset.row.lr_umgebung_delarze}
                    errorText={activeDataset.valid.lr_umgebung_delarze}
                    values={store.dropdownList.lr}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}vegetationstyp`}
                    tree={tree}
                    label="Vegetationstyp"
                    fieldName="vegetationstyp"
                    value={activeDataset.row.vegetationstyp}
                    errorText={activeDataset.valid.vegetationstyp}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}konkurrenz`}
                    tree={tree}
                    label="Konkurrenz"
                    fieldName="konkurrenz"
                    value={activeDataset.row.konkurrenz}
                    errorText={activeDataset.valid.konkurrenz}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}moosschicht`}
                    tree={tree}
                    label="Moosschicht"
                    fieldName="moosschicht"
                    value={activeDataset.row.moosschicht}
                    errorText={activeDataset.valid.moosschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}krautschicht`}
                    tree={tree}
                    label="Krautschicht"
                    fieldName="krautschicht"
                    value={activeDataset.row.krautschicht}
                    errorText={activeDataset.valid.krautschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}strauchschicht`}
                    tree={tree}
                    label="Strauchschicht"
                    fieldName="strauchschicht"
                    value={activeDataset.row.strauchschicht}
                    errorText={activeDataset.valid.strauchschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}baumschicht`}
                    tree={tree}
                    label="Baumschicht"
                    fieldName="baumschicht"
                    value={activeDataset.row.baumschicht}
                    errorText={activeDataset.valid.baumschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <Section>Boden</Section>
                  <TextField
                    key={`${activeDataset.row.id}boden_typ`}
                    tree={tree}
                    label="Typ"
                    fieldName="boden_typ"
                    value={activeDataset.row.boden_typ}
                    errorText={activeDataset.valid.boden_typ}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}boden_kalkgehalt`}
                    tree={tree}
                    label="Kalkgehalt"
                    fieldName="boden_kalkgehalt"
                    value={activeDataset.row.boden_kalkgehalt}
                    errorText={activeDataset.valid.boden_kalkgehalt}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}boden_durchlaessigkeit`}
                    tree={tree}
                    label="Durchlässigkeit"
                    fieldName="boden_durchlaessigkeit"
                    value={activeDataset.row.boden_durchlaessigkeit}
                    errorText={activeDataset.valid.boden_durchlaessigkeit}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}boden_humus`}
                    tree={tree}
                    label="Humusgehalt"
                    fieldName="boden_humus"
                    value={activeDataset.row.boden_humus}
                    errorText={activeDataset.valid.boden_humus}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}boden_naehrstoffgehalt`}
                    tree={tree}
                    label="Nährstoffgehalt"
                    fieldName="boden_naehrstoffgehalt"
                    value={activeDataset.row.boden_naehrstoffgehalt}
                    errorText={activeDataset.valid.boden_naehrstoffgehalt}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}boden_abtrag`}
                    tree={tree}
                    label="Bodenabtrag"
                    fieldName="boden_abtrag"
                    value={activeDataset.row.boden_abtrag}
                    errorText={activeDataset.valid.boden_abtrag}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    key={`${activeDataset.row.id}wasserhaushalt`}
                    tree={tree}
                    label="Wasserhaushalt"
                    fieldName="wasserhaushalt"
                    value={activeDataset.row.wasserhaushalt}
                    errorText={activeDataset.valid.wasserhaushalt}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <Section>Beurteilung</Section>
                  <TextField
                    key={`${activeDataset.row.id}handlungsbedarf`}
                    tree={tree}
                    label="Handlungsbedarf"
                    fieldName="handlungsbedarf"
                    value={activeDataset.row.handlungsbedarf}
                    errorText={activeDataset.valid.handlungsbedarf}
                    type="text"
                    multiline
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <RadioButtonGroup
                    tree={tree}
                    fieldName="idealbiotop_uebereinstimmung"
                    label="Übereinstimmung mit Idealbiotop"
                    value={activeDataset.row.idealbiotop_uebereinstimmung}
                    errorText={activeDataset.valid.idealbiotop_uebereinstimmung}
                    dataSource={store.dropdownList.idbiotopuebereinstWerte}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                </FormContainer>
              </TabChildDiv>
            </Tab>
          </Tabs>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopfeldkontr)
