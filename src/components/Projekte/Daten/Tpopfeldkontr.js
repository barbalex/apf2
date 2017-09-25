// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Tabs, Tab } from 'material-ui/Tabs'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import AutoCompleteFromArray from '../../shared/AutocompleteFromArray'
import AutoComplete from '../../shared/Autocomplete'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import StringToCopy from '../../shared/StringToCopy'
import FormTitle from '../../shared/FormTitle'
import YearDatePair from '../../shared/YearDatePair'
import TabTemplate from '../../shared/TabTemplate'
import TpopfeldkontrentwicklungPopover from './TpopfeldkontrentwicklungPopover'
import constants from '../../../modules/constants'

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
const TabChildDiv = styled.div`height: 100%;`
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
  let name = ''
  if (activeDataset.row.TPopKontrBearb && adressen.length > 0) {
    const adresse = adressen.find(
      a => a.AdrId === activeDataset.row.TPopKontrBearb
    )
    if (adresse && adresse.AdrName) return adresse.AdrName
  }
  return name
}

const enhance = compose(
  inject('store'),
  withState('width', 'changeWidth', 0),
  withHandlers({
    onChangeTab: props => value =>
      props.store.setUrlQueryValue('feldkontrTab', value),
  }),
  observer
)

class Tpopfeldkontr extends Component {
  props: {
    store: Object,
    tree: Object,
    onChangeTab: () => void,
    width: number,
    changeWidth: () => {},
  }

  updateWidth = () => {
    if (this.container && this.container.offsetWidth) {
      this.props.changeWidth(this.container.offsetWidth)
    }
  }

  componentDidMount() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  }

  componentDidUpdate() {
    // not sure if this is necessary
    this.updateWidth()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth)
  }

  render() {
    const { store, tree, onChangeTab, width } = this.props
    const { activeDataset } = tree

    return (
      <Container
        // $FlowIssue
        innerRef={c => (this.container = c)}
      >
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
                    key={activeDataset.row.TPopKontrId}
                    tree={tree}
                    yearLabel="Jahr"
                    yearFieldName="TPopKontrJahr"
                    yearValue={activeDataset.row.TPopKontrJahr}
                    yearErrorText={activeDataset.valid.TPopKontrJahr}
                    dateLabel="Datum"
                    dateFieldName="TPopKontrDatum"
                    dateValue={activeDataset.row.TPopKontrDatum}
                    dateErrorText={activeDataset.valid.TPopKontrDatum}
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <RadioButtonGroup
                    tree={tree}
                    fieldName="TPopKontrTyp"
                    label="Kontrolltyp"
                    value={activeDataset.row.TPopKontrTyp}
                    errorText={activeDataset.valid.TPopKontrTyp}
                    dataSource={tpopkontrTypWerte}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <AutoComplete
                    key={`${activeDataset.row.TPopKontrId}TPopKontrBearb`}
                    tree={tree}
                    label="BearbeiterIn"
                    fieldName="TPopKontrBearb"
                    valueText={getBearbName({ store, tree })}
                    errorText={activeDataset.valid.TPopKontrBearb}
                    dataSource={store.dropdownList.adressen}
                    dataSourceConfig={{
                      value: 'AdrId',
                      text: 'AdrName',
                    }}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Anzahl Jungpflanzen"
                    fieldName="TPopKontrJungpfl"
                    value={activeDataset.row.TPopKontrJungpfl}
                    errorText={activeDataset.valid.TPopKontrJungpfl}
                    type="number"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Vitalität"
                    fieldName="TPopKontrVitalitaet"
                    value={activeDataset.row.TPopKontrVitalitaet}
                    errorText={activeDataset.valid.TPopKontrVitalitaet}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Überlebensrate"
                    fieldName="TPopKontrUeberleb"
                    value={activeDataset.row.TPopKontrUeberleb}
                    errorText={activeDataset.valid.TPopKontrUeberleb}
                    type="number"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <RadioButtonGroupWithInfo
                    tree={tree}
                    fieldName="TPopKontrEntwicklung"
                    value={activeDataset.row.TPopKontrEntwicklung}
                    dataSource={store.dropdownList.tpopEntwicklungWerte}
                    updatePropertyInDb={store.updatePropertyInDb}
                    popover={TpopfeldkontrentwicklungPopover}
                    label="Entwicklung"
                  />
                  <TextField
                    tree={tree}
                    label="Ursachen"
                    fieldName="TPopKontrUrsach"
                    value={activeDataset.row.TPopKontrUrsach}
                    errorText={activeDataset.valid.TPopKontrUrsach}
                    hintText="Standort: ..., Klima: ..., anderes: ..."
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Erfolgsbeurteilung"
                    fieldName="TPopKontrUrteil"
                    value={activeDataset.row.TPopKontrUrteil}
                    errorText={activeDataset.valid.TPopKontrUrteil}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Änderungs-Vorschläge Umsetzung"
                    fieldName="TPopKontrAendUms"
                    value={activeDataset.row.TPopKontrAendUms}
                    errorText={activeDataset.valid.TPopKontrAendUms}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Änderungs-Vorschläge Kontrolle"
                    fieldName="TPopKontrAendKontr"
                    value={activeDataset.row.TPopKontrAendKontr}
                    errorText={activeDataset.valid.TPopKontrAendKontr}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Bemerkungen"
                    fieldName="TPopKontrTxt"
                    value={activeDataset.row.TPopKontrTxt}
                    errorText={activeDataset.valid.TPopKontrTxt}
                    type="text"
                    multiLine
                    fullWidth
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <StringToCopy
                    text={activeDataset.row.TPopKontrGuid}
                    label="GUID"
                  />
                </FormContainer>
              </TabChildDiv>
            </Tab>
            <Tab label="Biotop" value="biotop">
              <TabChildDiv>
                <FormContainer data-width={width}>
                  <TextField
                    tree={tree}
                    label="Fläche"
                    fieldName="TPopKontrFlaeche"
                    value={activeDataset.row.TPopKontrFlaeche}
                    errorText={activeDataset.valid.TPopKontrFlaeche}
                    type="number"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <Section>Vegetation</Section>
                  <AutoCompleteFromArray
                    key={`${activeDataset.row.TPopKontrId}Lebensraum`}
                    tree={tree}
                    label="Lebensraum nach Delarze"
                    fieldName="TPopKontrLeb"
                    valueText={activeDataset.row.TPopKontrLeb}
                    errorText={activeDataset.valid.TPopKontrLeb}
                    dataSource={store.dropdownList.lr}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <AutoCompleteFromArray
                    key={`${activeDataset.row.TPopKontrId}Umgebung`}
                    tree={tree}
                    label="Umgebung nach Delarze"
                    fieldName="TPopKontrLebUmg"
                    valueText={activeDataset.row.TPopKontrLebUmg}
                    errorText={activeDataset.valid.TPopKontrLebUmg}
                    dataSource={store.dropdownList.lr}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Vegetationstyp"
                    fieldName="TPopKontrVegTyp"
                    value={activeDataset.row.TPopKontrVegTyp}
                    errorText={activeDataset.valid.TPopKontrVegTyp}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Konkurrenz"
                    fieldName="TPopKontrKonkurrenz"
                    value={activeDataset.row.TPopKontrKonkurrenz}
                    errorText={activeDataset.valid.TPopKontrKonkurrenz}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Moosschicht"
                    fieldName="TPopKontrMoosschicht"
                    value={activeDataset.row.TPopKontrMoosschicht}
                    errorText={activeDataset.valid.TPopKontrMoosschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Krautschicht"
                    fieldName="TPopKontrKrautschicht"
                    value={activeDataset.row.TPopKontrKrautschicht}
                    errorText={activeDataset.valid.TPopKontrKrautschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Strauchschicht"
                    fieldName="TPopKontrStrauchschicht"
                    value={activeDataset.row.TPopKontrStrauchschicht}
                    errorText={activeDataset.valid.TPopKontrStrauchschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Baumschicht"
                    fieldName="TPopKontrBaumschicht"
                    value={activeDataset.row.TPopKontrBaumschicht}
                    errorText={activeDataset.valid.TPopKontrBaumschicht}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <Section>Boden</Section>
                  <TextField
                    tree={tree}
                    label="Typ"
                    fieldName="TPopKontrBodenTyp"
                    value={activeDataset.row.TPopKontrBodenTyp}
                    errorText={activeDataset.valid.TPopKontrBodenTyp}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Kalkgehalt"
                    fieldName="TPopKontrBodenKalkgehalt"
                    value={activeDataset.row.TPopKontrBodenKalkgehalt}
                    errorText={activeDataset.valid.TPopKontrBodenKalkgehalt}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Durchlässigkeit"
                    fieldName="TPopKontrBodenDurchlaessigkeit"
                    value={activeDataset.row.TPopKontrBodenDurchlaessigkeit}
                    errorText={
                      activeDataset.valid.TPopKontrBodenDurchlaessigkeit
                    }
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Humusgehalt"
                    fieldName="TPopKontrBodenHumus"
                    value={activeDataset.row.TPopKontrBodenHumus}
                    errorText={activeDataset.valid.TPopKontrBodenHumus}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Nährstoffgehalt"
                    fieldName="TPopKontrBodenNaehrstoffgehalt"
                    value={activeDataset.row.TPopKontrBodenNaehrstoffgehalt}
                    errorText={
                      activeDataset.valid.TPopKontrBodenNaehrstoffgehalt
                    }
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Bodenabtrag"
                    fieldName="TPopKontrBodenAbtrag"
                    value={activeDataset.row.TPopKontrBodenAbtrag}
                    errorText={activeDataset.valid.TPopKontrBodenAbtrag}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <TextField
                    tree={tree}
                    label="Wasserhaushalt"
                    fieldName="TPopKontrWasserhaushalt"
                    value={activeDataset.row.TPopKontrWasserhaushalt}
                    errorText={activeDataset.valid.TPopKontrWasserhaushalt}
                    type="text"
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <Section>Beurteilung</Section>
                  <TextField
                    tree={tree}
                    label="Handlungsbedarf"
                    fieldName="TPopKontrHandlungsbedarf"
                    value={activeDataset.row.TPopKontrHandlungsbedarf}
                    errorText={activeDataset.valid.TPopKontrHandlungsbedarf}
                    type="text"
                    multiline
                    updateProperty={store.updateProperty}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                  <RadioButtonGroup
                    tree={tree}
                    fieldName="TPopKontrIdealBiotopUebereinst"
                    label="Übereinstimmung mit Idealbiotop"
                    value={activeDataset.row.TPopKontrIdealBiotopUebereinst}
                    errorText={
                      activeDataset.valid.TPopKontrIdealBiotopUebereinst
                    }
                    dataSource={store.dropdownList.idbiotopuebereinstWerte}
                    updatePropertyInDb={store.updatePropertyInDb}
                  />
                </FormContainer>
              </TabChildDiv>
            </Tab>
          </Tabs>
        </FieldsContainer>
      </Container>
    )
  }
}

export default enhance(Tpopfeldkontr)
