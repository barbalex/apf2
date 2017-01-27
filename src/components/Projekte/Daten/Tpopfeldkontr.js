import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import { Tabs, Tab } from 'material-ui/Tabs'
import AutoComplete from 'material-ui/AutoComplete'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import SelectField from '../../shared/SelectField'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import StringToCopy from '../../shared/StringToCopy'
import FormTitle from '../../shared/FormTitle'
import YearDatePair from '../../shared/YearDatePair'
import TabTemplate from '../../shared/TabTemplate'
import TpopfeldkontrentwicklungPopover from './TpopfeldkontrentwicklungPopover'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
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
    content: ":";
  }
`
const FormContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;

`

const enhance = compose(
  inject(`store`),
  withProps((props) => {
    const { store } = props
    const styles = {
      root: {
        flex: `1 1 100%`,
        minHeight: 0,
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
      },
      container: {
        flex: `1 1 100%`,
        display: `flex`,
        flexDirection: `column`,
        overflowX: `auto`,
      },
    }
    let tpopmassnErfbeurtWerte = Array.from(store.table.tpopmassn_erfbeurt_werte.values())
    tpopmassnErfbeurtWerte = sortBy(tpopmassnErfbeurtWerte, `BeurteilOrd`)
    tpopmassnErfbeurtWerte = tpopmassnErfbeurtWerte.map(el => ({
      value: el.BeurteilId,
      label: el.BeurteilTxt,
    }))
    const adressen = sortBy(
      Array.from(store.table.adresse.values()),
      `AdrName`
    )
    adressen.unshift({
      id: null,
      AdrName: ``,
    })
    let tpopEntwicklungWerte = Array.from(
      store.table.tpop_entwicklung_werte.values()
    )
    tpopEntwicklungWerte = sortBy(tpopEntwicklungWerte, `EntwicklungOrd`)
    tpopEntwicklungWerte = tpopEntwicklungWerte.map(el => ({
      value: el.EntwicklungCode,
      label: el.EntwicklungTxt,
    }))
    let idbiotopuebereinstWerte = Array.from(store.table.tpopkontr_idbiotuebereinst_werte.values())
    idbiotopuebereinstWerte = sortBy(idbiotopuebereinstWerte, `DomainOrd`)
    idbiotopuebereinstWerte = idbiotopuebereinstWerte.map(el => ({
      value: el.DomainCode,
      label: el.DomainTxt,
    }))
    let lr = Array.from(store.table.adb_lr.values())
    lr = lr.map(e => e.Einheit.replace(/  +/g, ` `)) // eslint-disable-line no-regex-spaces
    const tpopkontrTypWerte = [{
      value: `Ausgangszustand`,
      label: `Ausgangszustand`,
    }, {
      value: `Zwischenbeurteilung`,
      label: `Zwischenbeurteilung`,
    }]
    const tab = store.urlQuery.feldkontrTab || `entwicklung`
    return {
      tpopmassnErfbeurtWerte,
      adressen,
      tpopEntwicklungWerte,
      idbiotopuebereinstWerte,
      lr,
      tpopkontrTypWerte,
      tab,
      styles,
    }
  }),
  withHandlers({
    onChangeTab: props => value =>
      props.store.setUrlQuery(`feldkontrTab`, value),
  }),
  observer
)

const Tpopfeldkontr = ({
  store,
  onChangeTab,
  styles,
  adressen,
  tpopEntwicklungWerte,
  idbiotopuebereinstWerte,
  lr,
  tpopkontrTypWerte,
  tab,
}) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="Feld-Kontrolle" />
      <FieldsContainer>
        <Tabs
          style={styles.root}
          contentContainerStyle={styles.container}
          tabTemplate={TabTemplate}
          value={tab}
          onChange={onChangeTab}
        >
          <Tab
            label="Entwicklung"
            value="entwicklung"
          >
            <FormContainer>
              <YearDatePair
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
              <Label label="Kontrolltyp" />
              <RadioButtonGroup
                fieldName="TPopKontrTyp"
                value={activeDataset.row.TPopKontrTyp}
                errorText={activeDataset.valid.TPopKontrTyp}
                dataSource={tpopkontrTypWerte}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <SelectField
                label="BearbeiterIn"
                fieldName="TPopKontrBearb"
                value={activeDataset.row.TPopKontrBearb}
                errorText={activeDataset.valid.TPopKontrBearb}
                dataSource={adressen}
                valueProp="AdrId"
                labelProp="AdrName"
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Anzahl Jungpflanzen"
                fieldName="TPopKontrJungpfl"
                value={activeDataset.row.TPopKontrJungpfl}
                errorText={activeDataset.valid.TPopKontrJungpfl}
                type="number"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Vitalität"
                fieldName="TPopKontrVitalitaet"
                value={activeDataset.row.TPopKontrVitalitaet}
                errorText={activeDataset.valid.TPopKontrVitalitaet}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Überlebensrate"
                fieldName="TPopKontrUeberleb"
                value={activeDataset.row.TPopKontrUeberleb}
                errorText={activeDataset.valid.TPopKontrUeberleb}
                type="number"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <Label label="Entwicklung" />
              <RadioButtonGroupWithInfo
                fieldName="TPopKontrEntwicklung"
                value={activeDataset.row.TPopKontrEntwicklung}
                dataSource={tpopEntwicklungWerte}
                updatePropertyInDb={store.updatePropertyInDb}
                popover={TpopfeldkontrentwicklungPopover}
              />
              <TextField
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
              <Label label="GUID" />
              <StringToCopy text={activeDataset.row.TPopKontrGuid} />
              <div style={{ height: `25px` }} ></div>
            </FormContainer>
          </Tab>
          <Tab
            label="Biotop"
            value="biotop"
          >
            <FormContainer>
              <TextField
                label="Fläche"
                fieldName="TPopKontrFlaeche"
                value={activeDataset.row.TPopKontrFlaeche}
                errorText={activeDataset.valid.TPopKontrFlaeche}
                type="number"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <Section>Vegetation</Section>
              <AutoComplete
                floatingLabelText="Lebensraum nach Delarze"
                openOnFocus
                fullWidth
                searchText={activeDataset.row.TPopKontrLeb || ``}
                errorText={activeDataset.valid.TPopKontrLeb}
                dataSource={lr}
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={20}
                onNewRequest={val =>
                  store.updatePropertyInDb(`TPopKontrLeb`, val)
                }
                onBlur={e =>
                  store.updatePropertyInDb(`TPopKontrLeb`, e.target.value)
                }
              />
              <AutoComplete
                floatingLabelText="Umgebung nach Delarze"
                openOnFocus
                fullWidth
                searchText={activeDataset.row.TPopKontrLebUmg || ``}
                errorText={activeDataset.valid.TPopKontrLebUmg}
                dataSource={lr}
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={20}
                onNewRequest={val =>
                  store.updatePropertyInDb(`TPopKontrLebUmg`, val)
                }
                onBlur={e =>
                  store.updatePropertyInDb(`TPopKontrLebUmg`, e.target.value)
                }
              />
              <TextField
                label="Vegetationstyp"
                fieldName="TPopKontrVegTyp"
                value={activeDataset.row.TPopKontrVegTyp}
                errorText={activeDataset.valid.TPopKontrVegTyp}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Konkurrenz"
                fieldName="TPopKontrKonkurrenz"
                value={activeDataset.row.TPopKontrKonkurrenz}
                errorText={activeDataset.valid.TPopKontrKonkurrenz}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Moosschicht"
                fieldName="TPopKontrMoosschicht"
                value={activeDataset.row.TPopKontrMoosschicht}
                errorText={activeDataset.valid.TPopKontrMoosschicht}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Krautschicht"
                fieldName="TPopKontrKrautschicht"
                value={activeDataset.row.TPopKontrKrautschicht}
                errorText={activeDataset.valid.TPopKontrKrautschicht}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Strauchschicht"
                fieldName="TPopKontrStrauchschicht"
                value={activeDataset.row.TPopKontrStrauchschicht}
                errorText={activeDataset.valid.TPopKontrStrauchschicht}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
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
                label="Typ"
                fieldName="TPopKontrBodenTyp"
                value={activeDataset.row.TPopKontrBodenTyp}
                errorText={activeDataset.valid.TPopKontrBodenTyp}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Kalkgehalt"
                fieldName="TPopKontrBodenKalkgehalt"
                value={activeDataset.row.TPopKontrBodenKalkgehalt}
                errorText={activeDataset.valid.TPopKontrBodenKalkgehalt}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Durchlässigkeit"
                fieldName="TPopKontrBodenDurchlaessigkeit"
                value={activeDataset.row.TPopKontrBodenDurchlaessigkeit}
                errorText={activeDataset.valid.TPopKontrBodenDurchlaessigkeit}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Humusgehalt"
                fieldName="TPopKontrBodenHumus"
                value={activeDataset.row.TPopKontrBodenHumus}
                errorText={activeDataset.valid.TPopKontrBodenHumus}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Nährstoffgehalt"
                fieldName="TPopKontrBodenNaehrstoffgehalt"
                value={activeDataset.row.TPopKontrBodenNaehrstoffgehalt}
                errorText={activeDataset.valid.TPopKontrBodenNaehrstoffgehalt}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
                label="Bodenabtrag"
                fieldName="TPopKontrBodenAbtrag"
                value={activeDataset.row.TPopKontrBodenAbtrag}
                errorText={activeDataset.valid.TPopKontrBodenAbtrag}
                type="text"
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <TextField
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
                label="Handlungsbedarf"
                fieldName="TPopKontrHandlungsbedarf"
                value={activeDataset.row.TPopKontrHandlungsbedarf}
                errorText={activeDataset.valid.TPopKontrHandlungsbedarf}
                type="text"
                multiline
                updateProperty={store.updateProperty}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <Label label="Übereinstimmung mit Idealbiotop" />
              <RadioButtonGroup
                fieldName="TPopKontrIdealBiotopUebereinst"
                value={activeDataset.row.TPopKontrIdealBiotopUebereinst}
                errorText={activeDataset.valid.TPopKontrIdealBiotopUebereinst}
                dataSource={idbiotopuebereinstWerte}
                updatePropertyInDb={store.updatePropertyInDb}
              />
              <div style={{ height: `25px` }} ></div>
            </FormContainer>
          </Tab>
        </Tabs>
      </FieldsContainer>
    </Container>
  )
}

Tpopfeldkontr.propTypes = {
  store: PropTypes.object.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  adressen: PropTypes.array.isRequired,
  tpopEntwicklungWerte: PropTypes.array.isRequired,
  idbiotopuebereinstWerte: PropTypes.array.isRequired,
  lr: PropTypes.array.isRequired,
  tpopkontrTypWerte: PropTypes.array.isRequired,
  tab: PropTypes.string.isRequired,
}

export default enhance(Tpopfeldkontr)
