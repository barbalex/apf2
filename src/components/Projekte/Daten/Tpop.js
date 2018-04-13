// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import TextFieldWithInfo from '../../shared/TextFieldWithInfo'
import Status from '../../shared/Status'
import AutoCompleteFromArray from '../../shared/AutocompleteFromArray'
import RadioButton from '../../shared/RadioButton'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import FormTitle from '../../shared/FormTitle'
import TpopAbBerRelevantInfoPopover from './TpopAbBerRelevantInfoPopover'
import constants from '../../../modules/constants'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(inject('store'), observer)

const Tpop = ({
  store,
  tree,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const { activeDataset } = tree
  const ads = store.table.pop.get(activeDataset.row.PopId)
  const apArtId = ads && ads.ApArtId ? ads.ApArtId : null
  const ap = store.table.ap.get(apArtId)
  const apJahr = ap && ap.ApJahr ? ap.ApJahr : null
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <ErrorBoundary>
      <Container innerRef={c => (this.container = c)}>
        <FormTitle tree={tree} title="Teil-Population" />
        <FieldsContainer data-width={width}>
          <TextField
            key={`${activeDataset.row.id}nr`}
            tree={tree}
            label="Nr."
            fieldName="nr"
            value={activeDataset.row.nr}
            errorText={activeDataset.valid.nr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextFieldWithInfo
            key={`${activeDataset.row.id}flurname`}
            tree={tree}
            label="Flurname"
            fieldName="flurname"
            value={activeDataset.row.flurname}
            errorText={activeDataset.valid.flurname}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
            popover="Dieses Feld möglichst immer ausfüllen"
          />
          <Status
            key={`${activeDataset.row.id}status`}
            tree={tree}
            apJahr={apJahr}
            herkunftFieldName="status"
            herkunftValue={activeDataset.row.status}
            bekanntSeitFieldName="TPopBekanntSeit"
            bekanntSeitValue={activeDataset.row.TPopBekanntSeit}
            bekanntSeitValid={activeDataset.valid.TPopBekanntSeit}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButton
            tree={tree}
            fieldName="status_unklar"
            label="Status unklar"
            value={activeDataset.row.status_unklar}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}status_unklar_grund`}
            tree={tree}
            label="Begründung"
            fieldName="status_unklar_grund"
            value={activeDataset.row.status_unklar_grund}
            errorText={activeDataset.valid.status_unklar_grund}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroupWithInfo
            tree={tree}
            fieldName="apber_relevant"
            value={activeDataset.row.apber_relevant}
            dataSource={store.dropdownList.tpopApBerichtRelevantWerte}
            updatePropertyInDb={store.updatePropertyInDb}
            popover={TpopAbBerRelevantInfoPopover}
            label="Für AP-Bericht relevant"
          />
          <TextField
            key={`${activeDataset.row.id}x`}
            tree={tree}
            label="X-Koordinaten"
            fieldName="x"
            value={activeDataset.row.x}
            errorText={activeDataset.valid.x}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}y`}
            tree={tree}
            label="Y-Koordinaten"
            fieldName="y"
            value={activeDataset.row.y}
            errorText={activeDataset.valid.y}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoCompleteFromArray
            key={activeDataset.row.id}
            tree={tree}
            label="Gemeinde"
            fieldName="gemeinde"
            valueText={activeDataset.row.gemeinde}
            errorText={activeDataset.valid.gemeinde}
            dataSource={store.dropdownList.gemeinden}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}radius`}
            tree={tree}
            label="Radius (m)"
            fieldName="radius"
            value={activeDataset.row.radius}
            errorText={activeDataset.valid.radius}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}hoehe`}
            tree={tree}
            label="Höhe (m.ü.M.)"
            fieldName="hoehe"
            value={activeDataset.row.hoehe}
            errorText={activeDataset.valid.hoehe}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}exposition`}
            tree={tree}
            label="Exposition, Besonnung"
            fieldName="exposition"
            value={activeDataset.row.exposition}
            errorText={activeDataset.valid.exposition}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}klima`}
            tree={tree}
            label="Klima"
            fieldName="klima"
            value={activeDataset.row.klima}
            errorText={activeDataset.valid.klima}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}neigung`}
            tree={tree}
            label="Hangneigung"
            fieldName="neigung"
            value={activeDataset.row.neigung}
            errorText={activeDataset.valid.neigung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}beschreibung`}
            tree={tree}
            label="Beschreibung"
            fieldName="beschreibung"
            value={activeDataset.row.beschreibung}
            errorText={activeDataset.valid.beschreibung}
            type="text"
            multiline
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}kataster_nr`}
            tree={tree}
            label="Kataster-Nr."
            fieldName="kataster_nr"
            value={activeDataset.row.kataster_nr}
            errorText={activeDataset.valid.kataster_nr}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopEigen`}
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
            key={`${activeDataset.row.id}TPopKontakt`}
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
            key={`${activeDataset.row.id}TPopNutzungszone`}
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
            key={`${activeDataset.row.id}TPopBewirtschafterIn`}
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
            key={`${activeDataset.row.id}TPopBewirtschaftung`}
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
            key={`${activeDataset.row.id}TPopTxt`}
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
    </ErrorBoundary>
  )
}

export default enhance(Tpop)
