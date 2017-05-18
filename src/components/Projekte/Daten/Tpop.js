// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import TextFieldWithInfo from '../../shared/TextFieldWithInfo'
import Status from '../../shared/Status'
import RadioButton from '../../shared/RadioButton'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import FormTitle from '../../shared/FormTitle'
import TpopAbBerRelevantInfoPopover from './TpopAbBerRelevantInfoPopover'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  overflow: auto !important;
`

const enhance = compose(inject('store'), observer)

const Tpop = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree
  const apArtId = store.table.pop.get(activeDataset.row.PopId).ApArtId
  const apJahr = store.table.ap.get(apArtId).ApJahr

  return (
    <Container>
      <FormTitle tree={tree} title="Teil-Population" />
      <FieldsContainer>
        <TextField
          tree={tree}
          label="Nr."
          fieldName="TPopNr"
          value={activeDataset.row.TPopNr}
          errorText={activeDataset.valid.TPopNr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextFieldWithInfo
          tree={tree}
          label="Flurname"
          fieldName="TPopFlurname"
          value={activeDataset.row.TPopFlurname}
          errorText={activeDataset.valid.TPopFlurname}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
          popover="Dieses Feld möglichst immer ausfüllen"
        />
        <Status
          tree={tree}
          apJahr={apJahr}
          herkunftFieldName="TPopHerkunft"
          herkunftValue={activeDataset.row.TPopHerkunft}
          bekanntSeitFieldName="TPopBekanntSeit"
          bekanntSeitValue={activeDataset.row.TPopBekanntSeit}
          bekanntSeitValid={activeDataset.valid.TPopBekanntSeit}
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <RadioButton
          tree={tree}
          fieldName="TPopHerkunftUnklar"
          label="Status unklar"
          value={activeDataset.row.TPopHerkunftUnklar}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Begründung"
          fieldName="TPopHerkunftUnklarBegruendung"
          value={activeDataset.row.TPopHerkunftUnklarBegruendung}
          errorText={activeDataset.valid.TPopHerkunftUnklarBegruendung}
          type="text"
          multiLine
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <RadioButtonGroupWithInfo
          tree={tree}
          fieldName="TPopApBerichtRelevant"
          value={activeDataset.row.TPopApBerichtRelevant}
          dataSource={store.dropdownList.tpopApBerichtRelevantWerte}
          updatePropertyInDb={store.updatePropertyInDb}
          popover={TpopAbBerRelevantInfoPopover}
          label="Für AP-Bericht relevant"
        />
        <TextField
          tree={tree}
          label="X-Koordinaten"
          fieldName="TPopXKoord"
          value={activeDataset.row.TPopXKoord}
          errorText={activeDataset.valid.TPopXKoord}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Y-Koordinaten"
          fieldName="TPopYKoord"
          value={activeDataset.row.TPopYKoord}
          errorText={activeDataset.valid.TPopYKoord}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <AutoComplete
          hintText={
            store.dropdownList.gemeinden.length === 0 ? 'lade Daten...' : ''
          }
          fullWidth
          floatingLabelText="Gemeinde"
          dataSource={store.dropdownList.gemeinden}
          searchText={activeDataset.row.TPopGemeinde || ''}
          filter={AutoComplete.caseInsensitiveFilter}
          maxSearchResults={20}
          onNewRequest={val =>
            store.updatePropertyInDb(tree, 'TPopGemeinde', val)}
          onBlur={e =>
            store.updatePropertyInDb(tree, 'TPopGemeinde', e.target.value)}
          value={activeDataset.row.TPopGemeinde || ''}
        />
        <TextField
          tree={tree}
          label="Radius (m)"
          fieldName="TPopRadius"
          value={activeDataset.row.TPopRadius}
          errorText={activeDataset.valid.TPopRadius}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Höhe (m.ü.M.)"
          fieldName="TPopHoehe"
          value={activeDataset.row.TPopHoehe}
          errorText={activeDataset.valid.TPopHoehe}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Exposition, Besonnung"
          fieldName="TPopExposition"
          value={activeDataset.row.TPopExposition}
          errorText={activeDataset.valid.TPopExposition}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Klima"
          fieldName="TPopKlima"
          value={activeDataset.row.TPopKlima}
          errorText={activeDataset.valid.TPopKlima}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Hangneigung"
          fieldName="TPopNeigung"
          value={activeDataset.row.TPopNeigung}
          errorText={activeDataset.valid.TPopNeigung}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Beschreibung"
          fieldName="TPopBeschr"
          value={activeDataset.row.TPopBeschr}
          errorText={activeDataset.valid.TPopBeschr}
          type="text"
          multiline
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Kataster-Nr."
          fieldName="TPopKatNr"
          value={activeDataset.row.TPopKatNr}
          errorText={activeDataset.valid.TPopKatNr}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="EigentümerIn"
          fieldName="TPopEigen"
          value={activeDataset.row.TPopEigen}
          errorText={activeDataset.valid.TPopEigen}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Kontakt vor Ort"
          fieldName="TPopKontakt"
          value={activeDataset.row.TPopKontakt}
          errorText={activeDataset.valid.TPopKontakt}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Nutzungszone"
          fieldName="TPopNutzungszone"
          value={activeDataset.row.TPopNutzungszone}
          errorText={activeDataset.valid.TPopNutzungszone}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="BewirtschafterIn"
          fieldName="TPopBewirtschafterIn"
          value={activeDataset.row.TPopBewirtschafterIn}
          errorText={activeDataset.valid.TPopBewirtschafterIn}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Bewirtschaftung"
          fieldName="TPopBewirtschaftung"
          value={activeDataset.row.TPopBewirtschaftung}
          errorText={activeDataset.valid.TPopBewirtschaftung}
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Bemerkungen"
          fieldName="TPopTxt"
          value={activeDataset.row.TPopTxt}
          errorText={activeDataset.valid.TPopTxt}
          type="text"
          multiline
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Tpop)
